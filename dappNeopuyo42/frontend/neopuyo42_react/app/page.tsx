"use client"

import React, { use, useEffect, useState } from "react"
import { ethers } from "ethers";
import { useWeb3Context, IWeb3Context } from "./context/Web3Context";
import { Button, HStack, Icon, VStack, Text } from "@chakra-ui/react";
import useNeopuyo42Contract from "./hooks/useNeopuyo42Contract";


interface MetamaskData {
  accounts: string[];
  totalSupply: string;
  accountBalance: string;
  accountTotalStake: string;
  neopuyo42Contract: ethers.Contract | null;
  signer: ethers.Signer | null;
  // provider: ethers.JsonRpcProvider | null; // hardhat local networtk
  provider : ethers.BrowserProvider | null; // testnet
}

const BSC_CHAIN_ID = '97';

export default function Home() {

  const {
    connectWallet,
    disconnect,
    web3: { isAuthenticated, address, chainID, provider },
  } = useWeb3Context() as IWeb3Context;

  const hookContract = useNeopuyo42Contract();

  const [meta, setMeta] = useState<MetamaskData>({
    accounts: [],
    totalSupply: "0",
    accountBalance: "0",
    accountTotalStake: "0",
    neopuyo42Contract: null,
    signer: null,
    provider: null,
  });

  

  useEffect(() => {
    if (isAuthenticated) {
      console.log("METAMASK CONNECTED");
      if (!hookContract) {
        console.log("hookContract is null");
        return;
      }
      getContract();
      // getWalletInfos();
    }
  }, [isAuthenticated]);

  async function getContract() {
    try {
      const contract = await hookContract;
      // setMeta((prevState) => ({ ...prevState, neopuyo42Contract: contract }));
      console.log("neopuyo42Contract = ", contract);
    } catch (error) {
      console.error("getContract Error : ", (error as Error).message);
    }
  }

  // async function getWalletInfos() {
  //   try {
  //     if (window.ethereum) {
  //       await meta.neopuyo42Contract!.totalSupply().then((rawValue) => {
  //         const formatedValue = ethers.formatEther(rawValue);
  //         console.log("totalSupply = ",rawValue, " => ", formatedValue); // [!] debug
  //         setMeta((prevState) => ({ ...prevState, totalSupply: formatedValue }));
  //       });

  //     await meta.neopuyo42Contract!.balanceOf(meta.accounts[0]).then((rawValue) => {
  //       const formatedValue = ethers.formatEther(rawValue);
  //       console.log("accountBalance = ",rawValue, " => ", formatedValue); // [!] debug
  //       setMeta((prevState) => ({ ...prevState, accountBalance: formatedValue }));
  //     });

  //     await meta.neopuyo42Contract!.hasStake(meta.accounts[0]).then((stackingSummary) => {
  //       const formatedValue = ethers.formatEther(stackingSummary.total_amount);
  //       console.log("stackingSummary.total_amount = ",stackingSummary.total_amount, " => ", formatedValue); // [!] debug
  //       setMeta((prevState) => ({ ...prevState, accountTotalStake: formatedValue }));
  //     });
  //     } else {
  //       throw new Error("Can't getWalletInfos from Metamask.");
  //     }
  //   } catch (error) {
  //     console.log("getWalletInfos Error : ", (error as Error).message);
  //   }
  // }

  if (!isAuthenticated) {
    return (
      <VStack>
        <Text fontSize="xl" fontWeight="bold" color="white">Please connect your metamask account to continue</Text>
        {/* <HStack>
          <Icon as={FaEthereum} color="white"/>
          <Button
                    onClick={connectWallet}
                    variant="solid"
                    bg="blue.400"
                    colorScheme="blue"
                    gap={2}
                    color="white"
                  >Connect Wallet</Button>
        </HStack> */}
      </VStack>
    );
  }



  // useEffect(() => {
  //   connectWallet();
  // }, []);

  // useEffect(() => {
  //   if (isMetamaskConnected()) {
  //     console.log("OK METAMASK CONNECTED");
  //     console.log("Accounts = ", meta.accounts);
  //     getWalletInfos();
  //   }
  // }, [meta.neopuyo42Contract]);

  // async function olderConnectWallet() {
  //   try {

  //     if (window.ethereum) {
  //       const accountsStamp = await window.ethereum.request({
  //         method: 'eth_requestAccounts',
  //       });
  //       setMeta((prevState) => ({ ...prevState, accounts: accountsStamp }));
  //       console.log("accounts[0] = ", accountsStamp[0]);
  //       _checkNetwork();

  //       const providerStamp = new ethers.BrowserProvider(window.ethereum); // for testnet
  //       // const providerStamp = new ethers.JsonRpcProvider('http://localhost:8545'); // for local hardhat

  //       const signerStamp = await providerStamp.getSigner();
  //       setMeta((prevState) => ({ ...prevState, signer: signerStamp, provider: providerStamp }));

  //       const abi = await getABI();
  //       const address = getNeopuyo42ContractAddress();
  //       const contractStamp = new ethers.Contract(address, abi, providerStamp);
  //       setMeta((prevState) => ({ ...prevState, neopuyo42Contract: contractStamp }));
  //     } else {
  //       console.error('MetaMask is needed to use this dapp.');
  //     }
  //   } catch (error) {
  //     console.log("connectWallet Error : ", (error as Error).message);
  //   }
  // }

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

  // async function _checkNetwork() {
  //   const networkID = await window.ethereum.request({
  //     method: 'net_version',
  //   });
  //   if (networkID !== BSC_CHAIN_ID) {
  //     console.log("Wrong networkID : ", networkID, "Ask switching...");
  //     _switchChain();
  //   }
  // }

  // async function _switchChain() {
  //   const chainIdHex = `0x${parseInt(BSC_CHAIN_ID).toString(16)}`; // [!] const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}` in boilerplate
  //   await window.ethereum.request({
  //     method: "wallet_switchEthereumChain",
  //     params: [{ chainId: chainIdHex }],
  //   });
  //   // go to next initialize etc...
  // }


  // async function createStakeListener() {
  //   try {
  //     meta.neopuyo42Contract!.on("Staked", async (stakerRaw: string, amount: any) => {
  //       console.log("Staked event : ", stakerRaw, amount.toString());
  //       const staker = ethers.getAddress(stakerRaw).toLowerCase();
  //       console.log("StakerRaw: ", stakerRaw, " => ", staker);
  //       if (staker === meta.accounts[0]) {
  //         console.log("Staked event from current user");
  //       }
  //       await getWalletInfos();
  //     });
  //   } catch (error) {
  //     console.error("Error listener:", (error as Error).message);
  //   }
  // }

  // function isMetamaskConnected() {
  //   return (
  //     typeof meta.neopuyo42Contract !== "undefined" &&
  //     typeof meta.accounts[0] !== "undefined"
  //   );
  // }

  // async function stakeNeopuyo42() {
  //   try {
  //     const amount = 1472;
  //     const abi = await getABI();
  //     const address = getNeopuyo42ContractAddress();
  //     const contractS = new ethers.Contract(address, abi, meta.signer);
  //     const amountParsed = ethers.parseEther(amount.toString());
      
  //     // Estimate gas cost and ask confirmation
  //     const gasEstimate = await contractS.stake.estimateGas(amountParsed);
  //     const gasPrice = (await meta.provider!.getFeeData()).gasPrice;

  //     console.log("gasPrice : ", gasPrice);
  //     console.log("gasEstimate : ", gasEstimate);

  //     const gasCost = gasEstimate * gasPrice!; // [!] care unwrapping
  //     const gasCostInEth = ethers.formatEther(gasCost);
  //     console.log("gasCost : ", gasCost);

  //     console.log("Gas cost: ", gasCostInEth, " Ether");

  //     const confirmed = await window.ethereum.request({
  //       method: "eth_sendTransaction",
  //       params: [
  //         {
  //           to: address,
  //           from: await meta.signer!.getAddress(),
  //           value: "0x0",
  //           gas: gasEstimate.toString(),
  //           gasPrice: gasPrice?.toString(),
  //           data: contractS.interface.encodeFunctionData("stake", [amountParsed]),
  //         },
  //       ],
  //     });

  //     if (!confirmed) {
  //       console.log("Transaction canceled.");
  //       return;
  //     }

  //     console.log("Transaction validate, waiting for process...");

  //     const receipt = await meta.provider!.waitForTransaction(confirmed);
  //     console.log("Stake transaction Done receipt : ", receipt);
  //   } catch (error) {
  //     console.log("stakeNeopuyo42 Error : ", (error as Error).message);
  //   }
  // }

  // for later : onClick={stakeNeopuyo42}
  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <div className="grid gap-4">
        <p>Authenticated</p>
        <p> Account : {meta.accounts[0]}</p>
        <p> Account Address from context: {address}</p>
        {meta.totalSupply === "0" && <p>Neopuyo42 total supply: 0</p>}
        {meta.totalSupply !== "0" && <p>Neopuyo42 total supply: {meta.totalSupply} Neo</p>}
        <p> Your Neopuyo42 balance: {meta.accountBalance} Neo</p>
        <p> Your Neopuyo42 stack: {meta.accountTotalStake} Neo</p>
        <button className="bg-black text-white p-4 rounded-lg"><p>Stake</p></button>
      </div>
    </div>
  );
};
