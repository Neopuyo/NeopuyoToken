"use client"

import React, { use, useEffect, useMemo, useState } from "react"
import { ethers } from "ethers";
import { useWeb3Context, IWeb3Context } from "./context/Web3Context";
import { Button, HStack, Icon, VStack, Text, CardBody, Box, Card, Heading, CardHeader, Stack, StackDivider, Highlight, CardFooter, Divider } from "@chakra-ui/react";
import useNeopuyo42Contract from "./hooks/useNeopuyo42Contract";


interface MetamaskData {
  // accounts: string[];
  totalSupply: string;
  accountBalance: string;
  accountTotalStake: string;
  neopuyo42Contract: ethers.Contract | null;
  // signer: ethers.Signer | null;
  // provider: ethers.JsonRpcProvider | null; // hardhat local networtk
  // provider : ethers.BrowserProvider | null; // testnet
}

export default function Home() {

  const {
    connectWallet,
    disconnect,
    web3: { isAuthenticated, address, chainID, accounts, provider, signer },
  } = useWeb3Context() as IWeb3Context;

  const neopuyo42Contract = useNeopuyo42Contract();

  const [meta, setMeta] = useState<MetamaskData>({
    totalSupply: "0",
    accountBalance: "0",
    accountTotalStake: "0",
    neopuyo42Contract: null,
  });

  useEffect(() => {
    if (isAuthenticated) {
      console.log("METAMASK CONNECTED");
      if (!neopuyo42Contract) {
        console.log("neopuyo42Contract is null");
        return;
      }
      getContract();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (meta.neopuyo42Contract) {
      getMetamaskInfos();
    }
  }, [meta.neopuyo42Contract, address, accounts]);

  // ----------------------------------------------------------

  async function getContract() {
    try {
      const contract = await neopuyo42Contract;
      if (!contract) {
        console.log("neopuyo42Contract is not available");
        return;
      }
      console.log("neopuyo42Contract is ready -> ", contract);
      setMeta((prevState) => ({ ...prevState, neopuyo42Contract: contract }));
    } catch (error) {
      console.error("getContract Error : ", (error as Error).message);
    }
  }

  async function getMetamaskInfos() {
    try {
      if (meta.neopuyo42Contract) {

        
        await meta.neopuyo42Contract!.totalSupply().then((rawValue) => {
          const formatedValue = ethers.formatEther(rawValue);
          console.log("totalSupply = ",rawValue, " => ", formatedValue); // [!] debug
          setMeta((prevState) => ({ ...prevState, totalSupply: formatedValue }));
        });
        
        await meta.neopuyo42Contract!.balanceOf(address).then((rawValue) => {
          const formatedValue = ethers.formatEther(rawValue);
          console.log("accountBalance = ",rawValue, " => ", formatedValue); // [!] debug
          setMeta((prevState) => ({ ...prevState, accountBalance: formatedValue }));
        });
        
        await meta.neopuyo42Contract!.hasStake(address).then((stackingSummary) => {
          const formatedValue = ethers.formatEther(stackingSummary.total_amount);
          console.log("stackingSummary.total_amount = ",stackingSummary.total_amount, " => ", formatedValue); // [!] debug
          setMeta((prevState) => ({ ...prevState, accountTotalStake: formatedValue }));
        });

      } else {
        throw new Error("Can't getWalletInfos from Metamask.");
      }
    } catch (error) {
      console.log("getWalletInfos Error : ", (error as Error).message);
    }
  }

  if (window.ethereum === undefined) { 
    return (
      <VStack>
        <Text fontSize="xl" fontWeight="bold" color="white">No dapp wallet detected in your browser</Text>
      </VStack>
    );
  }

  if (!isAuthenticated) {
    return (
      <VStack>
        <Text fontSize="xl" fontWeight="bold" color="white">Please connect your metamask account to continue</Text>
      </VStack>
    );
  }

  if (meta.totalSupply === "0") {
    return (
      <VStack>
        <Text fontSize="xl" fontWeight="bold" color="white">Loading...</Text>
      </VStack>
    );
  }

  // [K] Keep this 
  // useEffect(() => {
  //   async function rmStakeListener() {
  //      await meta.neopuyo42Contract?.removeAllListeners("Staked");
  //   }
  //   if (meta.neopuyo42Contract) {
  //     createStakeListener();
  //     return () => {
  //       rmStakeListener();
  //     };
  //   }
  // }, [meta.neopuyo42Contract]);

  // async function createStakeListener() {
  //   if (!meta.neopuyo42Contract) {
  //     console.log("neopuyo42Contract is null");
  //     return;
  //   }
  //   try {
  //     meta.neopuyo42Contract!.on("Staked", async (stakerRaw: string, amount: any) => {
  //       console.log("Staked event : ", stakerRaw, amount.toString());
  //       const staker = ethers.getAddress(stakerRaw).toLowerCase();
  //       console.log("StakerRaw: ", stakerRaw, " => ", staker);
  //       if (staker === address) {
  //         console.log("Staked event from current user, refreshing states...");
  //         await getMetamaskInfos();
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error listener:", (error as Error).message);
  //   }
  // }

  // [K] Keep this 
  async function stakeNeopuyo42() {
    if (!meta.neopuyo42Contract || !provider || !signer ) { return; }
    try {
      const amount = 1472;
      const amountParsed = ethers.parseEther(amount.toString());
      
      // Estimate gas cost and ask confirmation
      const gasEstimate = await meta.neopuyo42Contract.stake.estimateGas(amountParsed);
      const gasPrice = (await provider.getFeeData()).gasPrice;

      console.log("gasPrice : ", gasPrice);
      console.log("gasEstimate : ", gasEstimate);

      const gasCost = gasEstimate * gasPrice!; // [!] care unwrapping
      const gasCostInEth = ethers.formatEther(gasCost);
      console.log("gasCost : ", gasCost);

      console.log("Gas cost: ", gasCostInEth, " Ether");

      const confirmed = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: address,
            from: await signer.getAddress(),
            value: "0x0",
            gas: gasEstimate.toString(),
            gasPrice: gasPrice?.toString(),
            data: meta.neopuyo42Contract.interface.encodeFunctionData("stake", [amountParsed]),
          },
        ],
      });

      if (!confirmed) {
        console.log("Transaction canceled.");
        return;
      }

      console.log("Transaction validate, waiting for process...");

      const receipt = await provider.waitForTransaction(confirmed);
      console.log("Stake transaction Done receipt : ", receipt);
      await getMetamaskInfos(); // [!] refresh UI
    } catch (error) {
      console.log("stakeNeopuyo42 Error : ", (error as Error).message);
    }
  }

  // for later : onClick={stakeNeopuyo42}
  return (
    <div className="flex flex-col flex-1 justify-center items-center text-white">
      <div className="grid gap-4">
      <Card borderWidth="4px" borderRadius="md" borderColor="teal.500">

        <CardHeader>
          <Heading size='lg' fontWeight="bold" color="teal.400">My Neopuyo42 Account</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing='4'>
            <Box>
              <Text fontSize="xs" color="gray.400">Account Address</Text>
              <Text fontSize="xl">{address}</Text>
            </Box>

            <Box>
              <Text fontSize="xs" color="gray.400">Neopuyo42 total token</Text>
              <HStack>
                <Text fontSize="xl" color="gray.400">{meta.totalSupply}</Text>
                <Heading size="md" color="teal.400">Neo</Heading>
              </HStack>
            </Box>


            <Box>
              <Text fontSize="xs" color="gray.400">
                my Neopuyo42
              </Text>
              <Heading size="md" color="teal.400">{`${meta.accountBalance} Neo`}</Heading>
            </Box>

            <Box textAlign="right">
              <Text fontSize="xs" color="gray.400">
                my Stakes
              </Text>
              <Heading size="md" color="teal.400">{`${meta.accountTotalStake} Neo`}</Heading>
            </Box>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter justifyContent="flex-end">
          <Button onClick={stakeNeopuyo42} variant="solid" bg="yellow.400" color="white" gap={2} >
            <Text fontSize="xl" fontWeight="bold" paddingTop="4px">Stake</Text>
          </Button>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
};
