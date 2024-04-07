"use client"

import React, { useEffect, useState } from "react"
import { ethers } from "ethers";
import { useWeb3Context, IWeb3Context } from "./context/Web3Context";
import { HStack, Icon, VStack, Text, CardBody, Box, Card, Heading, CardHeader, Stack, StackDivider, CardFooter, Divider } from "@chakra-ui/react";
import useNeopuyo42Contract from "./hooks/useNeopuyo42Contract";
import { BiStar } from "react-icons/bi";
import { Tx, TxStatus } from "./handler/neopuyo42Handler";
import StakeInput from "./components/StakeInput";
import { StakingSummary } from "tools/types/StakingSummary";


interface MetamaskData {
  // accounts: string[];
  totalSupply: string;
  accountBalance: string;
  accountTotalStake: string;
  isTokenOwner: boolean;
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

  const neopuyo42Handler = useNeopuyo42Contract();

  const [tx, setTx] = useState<Tx>({status: TxStatus.IDLE, message: "No transaction in progress"});

  const [meta, setMeta] = useState<MetamaskData>({
    totalSupply: "0",
    accountBalance: "0",
    accountTotalStake: "0",
    isTokenOwner: false,
    neopuyo42Contract: null,
  });

  useEffect(() => {
    if (isAuthenticated) {
      console.log("METAMASK CONNECTED");
      if (!neopuyo42Handler) {
        console.log("neopuyo42handler is null");
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
      const handler = await neopuyo42Handler;
      if (!handler) {
        console.log("neopuyo42Contract handler is not available");
        return;
      }
      console.log("neopuyo42Contract handler is ready -> ", handler);
      setMeta((prevState) => ({ ...prevState, neopuyo42Contract: handler.neoContract }));
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
        
        await meta.neopuyo42Contract!.hasStake(address).then((stackingSummary: StakingSummary) => {
          const formatedValue = ethers.formatEther(stackingSummary.total_amount);
          console.log("stackingSummary.total_amount = ",stackingSummary.total_amount, " => ", formatedValue); // [!] debug
          console.log("stackingSummary = ",stackingSummary); // [!] debug
          setMeta((prevState) => ({ ...prevState, accountTotalStake: formatedValue }));
        });

        await meta.neopuyo42Contract!.getOwner().then((ownerAddress: string) => {
          if (address && address.toLowerCase() === ownerAddress.toLowerCase()) {
            setMeta((prevState) => ({ ...prevState, isTokenOwner: true }));
          }
        });

      } else {
        throw new Error("Can't getWalletInfos from Metamask.");
      }
    } catch (error) {
      console.log("getWalletInfos Error : ", (error as Error).message);
    }
  }
  
  function _contractSetupError(): boolean {
    const isError = (!meta.neopuyo42Contract || !provider || !signer || !neopuyo42Handler );
    // [!] DEBUG
    if (!meta.neopuyo42Contract) { console.log("[setUp] !meta.neopuyo42Contract");}
    if (!provider)               { console.log("[setUp] !provider");}
    if (!signer)                 { console.log("[setUp] !signer");}
    if (!neopuyo42Handler)       { console.log("[setUp] !neopuyo42Handler");}
    if (isError) {
      setTx({status:TxStatus.ERROR, message:"Error in fetching Neopuyo42 token contract, please try later."});
    }
    return isError;
  }

  async function stakeNeopuyo42(stakeAmount: number) {
    if (_contractSetupError()) { 
      setTx({status: TxStatus.ERROR, message: "Error in retreiving Neopuyo42 contract, try later please"});
      return; 
    }
    (await neopuyo42Handler)?.stakeNeopuyo42(stakeAmount, setTx, getMetamaskInfos);
  }

  // ---------------------------------------------------

  function _getTxColor(): string {
    switch (tx.status) {
      case TxStatus.IDLE:
        return "gray.400";
      case TxStatus.PENDING:
        return "yellow.500";
      case TxStatus.SUCCESS:
        return "teal.400";
      case TxStatus.ERROR:
        return "red.300";
    }
  }

  function _getTxMessage(): string {
    const maxLength = 72;

    if (tx.message.length <= maxLength) {
      return tx.message;
    }

    return `${tx.message.substring(0, maxLength)}...`;
  }

  // ----------------------------------------------------render
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
              <HStack alignItems="baseline">
                <Text fontSize="xs" color="gray.400">Account Address</Text>
                {meta.isTokenOwner && <Icon  as={BiStar} color="yellow.400"/>}
              </HStack>
              <Text fontSize="xl">{address}</Text>
            </Box>

            <Box>
              <Text fontSize="xs" color="gray.400">Neopuyo42 total token</Text>
              <HStack>
                <Text fontSize="xl" color="gray.400">{meta.totalSupply}</Text>
                <Heading size="md" color="teal.400">Neo</Heading>
              </HStack>
            </Box>

            <Box textAlign="right">
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
          <StakeInput 
            stakeNeopuyo42={stakeNeopuyo42}
            setTx={setTx}
            userBalance={meta.accountBalance}
          />
        </CardFooter>

      </Card>

      <Card borderWidth="4px" borderRadius="md" borderColor="yellow.400">

        <CardHeader>
          <Heading size='md' fontWeight="bold" color="yellow.400">Transaction</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing='4'>
            <Box>
                <Text fontSize="xs" color={_getTxColor()}>{_getTxMessage()}</Text>
            </Box>
          </Stack>
        </CardBody>

      </Card>
      </div>
    </div>
  );
};
