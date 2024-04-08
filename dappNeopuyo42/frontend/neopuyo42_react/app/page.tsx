"use client"

import React, { useEffect, useState } from "react"
import { ethers } from "ethers";
import { useWeb3Context, IWeb3Context } from "./context/Web3Context";
import { HStack, Icon, VStack, Text, CardBody, Box, Card, Heading, CardHeader, Stack, StackDivider, CardFooter, Divider, Tabs, TabList, Tab, TabPanels, TabPanel, Spacer } from "@chakra-ui/react";
import useNeopuyo42Contract from "./hooks/useNeopuyo42Contract";
import { BiStar } from "react-icons/bi";
import { Tx, TxStatus } from "./handler/neopuyo42Handler";
import StakeInput from "./components/StakeInput";
import { Stake, StakingSummary } from "tools/types/StakingSummary";
import StakeList from "./components/StakeList";
import { NeoColors } from "tools/types/NeoColors";
import { loglog } from "tools/loglog";


interface MetamaskData {
  totalSupply: string;
  accountBalance: string;
  accountTotalStake: string;
  stakes: Stake[];
  isTokenOwner: boolean;
  neopuyo42Contract: ethers.Contract | null;
}

export default function Home() {

  const {
    web3: { isAuthenticated, address, accounts, provider, signer },
  } = useWeb3Context() as IWeb3Context;

  const neopuyo42Handler = useNeopuyo42Contract();
  const [walletDetected, setWalletDetected] = useState(false);

  const [tx, setTx] = useState<Tx>({status: TxStatus.IDLE, message: "No transaction in progress"});

  const [meta, setMeta] = useState<MetamaskData>({
    totalSupply: "0",
    accountBalance: "0",
    accountTotalStake: "0",
    stakes: [],
    isTokenOwner: false,
    neopuyo42Contract: null,
  });

  useEffect(() => {
    if (walletDetected) { return; }
    if (typeof window !== 'undefined' && window.ethereum !== undefined) {
      setWalletDetected(true);
    }
  }, [isAuthenticated]); 

  useEffect(() => {
    if (isAuthenticated) {
      if (!neopuyo42Handler) {
        loglog("neopuyo42handler is null");
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
        loglog("neopuyo42Contract handler is not available");
        return;
      }
      setMeta((prevState) => ({ ...prevState, neopuyo42Contract: handler.neoContract }));
    } catch (error) {
      loglog("getContract Error : ", (error as Error).message);
    }
  }

  async function getMetamaskInfos() {
    try {
      if (meta.neopuyo42Contract) {

        await meta.neopuyo42Contract!.totalSupply().then((rawValue) => {
          const formatedValue = ethers.formatEther(rawValue);
          setMeta((prevState) => ({ ...prevState, totalSupply: formatedValue }));
        });
        
        await meta.neopuyo42Contract!.balanceOf(address).then((rawValue) => {
          const formatedValue = ethers.formatEther(rawValue);
          setMeta((prevState) => ({ ...prevState, accountBalance: formatedValue }));
        });
        
        await meta.neopuyo42Contract!.hasStake(address).then((stackingSummary: StakingSummary) => {
          const stakes:Stake[] = stackingSummary.stakes;
          stakes.forEach((stake: Stake) => {
          });
          const formatedValue = ethers.formatEther(stackingSummary.total_amount);
          setMeta((prevState) => ({ ...prevState, accountTotalStake: formatedValue, stakes: stakes}));
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
      loglog("getWalletInfos Error : ", (error as Error).message);
    }
  }
  
  function _contractSetupError(): boolean {
    const isError = (!meta.neopuyo42Contract || !provider || !signer || !neopuyo42Handler );
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

  async function withdrawStake(amount: number, index: number) {
    if (_contractSetupError()) { 
      setTx({status: TxStatus.ERROR, message: "Error in retreiving Neopuyo42 contract, try later please"});
      return; 
    }
    (await neopuyo42Handler)?.withdrawStake(amount, index, setTx, getMetamaskInfos);
  }
  // ---------------------------------------------------

  function _getTxColor(): string {
    switch (tx.status) {
      case TxStatus.IDLE:
        return NeoColors.gray;
      case TxStatus.PENDING:
        return NeoColors.yellow;
      case TxStatus.SUCCESS:
        return NeoColors.teal;
      case TxStatus.ERROR:
        return NeoColors.red;
    }
  }

  function _getTxMessage(): string {
    const maxLength = 200;
    if (tx.message.length <= maxLength) {
      return tx.message;
    }

    return `${tx.message.substring(0, maxLength)}...`;
  }

  // ----------------------------------------------------render
  if (!walletDetected) { 
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
                <Text fontSize="xs" color={NeoColors.gray}>Account Address</Text>
                {meta.isTokenOwner && <Icon  as={BiStar} color="yellow.400"/>}
              </HStack>
              <Text fontSize="xl">{address}</Text>
            </Box>

            <Box>
              <Text fontSize="xs" color={NeoColors.gray}>Neopuyo42 total token</Text>
              <HStack>
                <Text fontSize="xl" color={NeoColors.gray}>{meta.totalSupply}</Text>
                <Heading size="md" color={NeoColors.teal}>Neo</Heading>
              </HStack>
            </Box>

            <Box textAlign="right">
              <Text fontSize="xs" color={NeoColors.gray}>
                my Neopuyo42 balance
              </Text>
              <Heading size="md" color={NeoColors.teal}>{`${meta.accountBalance} Neo`}</Heading>
            </Box>

            <Box textAlign="right">
              <Text fontSize="xs" color={NeoColors.gray}>
                my Stakes total amount
              </Text>
              <Heading size="md" color={NeoColors.teal}>{`${meta.accountTotalStake} Neo`}</Heading>
            </Box>
          </Stack>
        </CardBody>

        <Divider />

        <CardFooter justifyContent="flex-end">
          <VStack alignItems="flex-start">
            <Box textAlign="left">
              <Text fontSize="md" fontWeight="bold" color={NeoColors.teal}>My stakes</Text>
            </Box>
            <Tabs align='end' variant='enclosed' isLazy minWidth={550}>
              <TabList color={NeoColors.gray}>
                <Tab _selected={{ color: NeoColors.teal }}>new stake</Tab>
                <Tab _selected={{ color: NeoColors.teal }}>withdraw</Tab>
              </TabList>
              <TabPanels>
                <TabPanel height={400}>
                  <StakeInput 
                    stakeNeopuyo42={stakeNeopuyo42}
                    setTx={setTx}
                    userBalance={meta.accountBalance}
                  />
                </TabPanel>
                <TabPanel height={400} overflowY={"scroll"}>
                  <StakeList stakes={meta.stakes} setTx={setTx} withdrawStake={withdrawStake}/>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </CardFooter>

      </Card>

      <Card borderWidth="4px" borderRadius="md" borderColor={NeoColors.yellow}>

        <CardHeader>
          <Heading size='md' fontWeight="bold" color={NeoColors.yellow}>Transaction</Heading>
        </CardHeader>

        <CardBody paddingTop={0} paddingBottom={0}>
          <Stack divider={<StackDivider />} spacing='4'>
            <Box minHeight={100}>
                <Text maxWidth={500} fontSize="xs" color={_getTxColor()}>{_getTxMessage()}</Text>
            </Box>
          </Stack>
        </CardBody>

      </Card>
      </div>
    </div>
  );
};
