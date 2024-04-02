"use client"

import React, { useCallback, useEffect, useState } from "react"
import Image from "next/image";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { ethers } from "ethers";
import { getFiveTokenContractAddress } from "./tools/getFiveTokenAddress";

const inter = Inter({ subsets: ["latin"] });

type ContractWithRemoveListener = ethers.Contract & {
  removeListener: () => void;
};

interface MetamaskData {
  accounts: string[];
  totalSupply: string;
  accountBalance: string;
  accountTotalStake: string;
  fiveContract: ethers.Contract | null;
  signer: ethers.Signer | null;

  provider: ethers.JsonRpcProvider | null; // testnet
  // provider: ethers.BrowserProvider | null; // local hardhat or BAD TRY ;(
}

export default function Home() {

  const [meta, setMeta] = useState<MetamaskData>({
    accounts: [],
    totalSupply: "0",
    accountBalance: "0",
    accountTotalStake: "0",
    fiveContract: null,
    signer: null,
    provider: null,
  });

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (isMetamaskConnected()) {
      console.log("OK METAMASK CONNECTED");
      console.log("Accounts = ", meta.accounts);
      getWalletInfos();
    }
  }, [meta.fiveContract]);

  async function connectWallet() {
    try {
      if (window.ethereum) {
        const accountsStamp = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setMeta((prevState) => ({ ...prevState, accounts: accountsStamp }));

        // const providerStamp = new ethers.JsonRpcProvider(); // for testnet
        const providerStamp = new ethers.JsonRpcProvider('http://localhost:8545'); // for local hardhat
        
        const signerStamp = await providerStamp.getSigner();
        console.log("signer = ", signerStamp);
        setMeta((prevState) => ({ ...prevState, signer: signerStamp, provider: providerStamp }));

        const abi = await getABI();
        const address = getFiveTokenContractAddress();
        const contractStamp = new ethers.Contract(address, abi, providerStamp);
        setMeta((prevState) => ({ ...prevState, fiveContract: contractStamp }));
      } else {
        console.error('MetaMask is needed to use this dapp.');
      }
    } catch (error) {
      console.log("connectWallet Error : ", (error as Error).message);
    }
  }

  useEffect(() => {
    async function rmStakeListener() {
       await meta.fiveContract?.removeAllListeners("Staked");
    }
    if (meta.fiveContract) {
      createStakeListener();
      return () => {
        rmStakeListener();
      };
    }
  }, [meta.fiveContract]);

  async function createStakeListener() {
    try {
      meta.fiveContract!.on("Staked", async (stakerRaw: string, amount: any) => {
        console.log("Staked event : ", stakerRaw, amount.toString());
        const staker = ethers.getAddress(stakerRaw).toLowerCase();
        console.log("StakerRaw: ", stakerRaw, " => ", staker);
        if (staker === meta.accounts[0]) {
          console.log("Staked event from current user");
        }
        await getWalletInfos();
      });
    } catch (error) {
      console.error("Error listener:", (error as Error).message);
    }
  }

  function isMetamaskConnected() {
    return (
      typeof meta.fiveContract !== "undefined" &&
      typeof meta.accounts[0] !== "undefined"
    );
  }

  async function getWalletInfos() {
    try {
      if (window.ethereum) {
        await meta.fiveContract!.totalSupply().then((rawValue) => {
          const formatedValue = ethers.formatEther(rawValue);
          console.log("totalSupply = ",rawValue, " => ", formatedValue); // [!] debug
          setMeta((prevState) => ({ ...prevState, totalSupply: formatedValue }));
        });

      await meta.fiveContract!.balanceOf(meta.accounts[0]).then((rawValue) => {
        const formatedValue = ethers.formatEther(rawValue);
        console.log("accountBalance = ",rawValue, " => ", formatedValue); // [!] debug
        setMeta((prevState) => ({ ...prevState, accountBalance: formatedValue }));
      });

      await meta.fiveContract!.hasStake(meta.accounts[0]).then((stackingSummary) => {
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

  async function stakeFiveTokens() {
    try {
      const amount = 1472;
      const abi = await getABI();
      const address = getFiveTokenContractAddress();
      const contractS = new ethers.Contract(address, abi, meta.signer);
      const amountParsed = ethers.parseEther(amount.toString());
      
      // Estimate gas cost and ask confirmation
      const gasEstimate = await contractS.stake.estimateGas(amountParsed);
      const gasPrice = (await meta.provider!.getFeeData()).gasPrice;

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
            from: await meta.signer!.getAddress(),
            value: "0x0",
            gas: gasEstimate.toString(),
            gasPrice: gasPrice?.toString(),
            data: contractS.interface.encodeFunctionData("stake", [amountParsed]),
          },
        ],
      });

      if (!confirmed) {
        console.log("Transaction canceled.");
        return;
      }

      console.log("Transaction validate, waiting for process...");

      const receipt = await meta.provider!.waitForTransaction(confirmed);
      console.log("Stake transaction Done receipt : ", receipt);
    } catch (error) {
      console.log("stakeFiveTokens Error : ", (error as Error).message);
    }
  }

  async function getABI(): Promise<any[]> {
    let ABI: any[] = [];

    await fetch("./abi/FiveToken.json", {
      headers : {
        'Accept': 'application.json',
        'Content-Type': 'application.json',
      }
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Error fetching ABI (FiveToken.json)');
      }
    }).then((data) => {
      ABI = data.abi;
    }).catch((error) => {
      throw new Error(error);
    });

    if (Array.isArray(ABI) && ABI.length > 0) {
      return ABI;
    } else {
      throw new Error('Invalid ABI format.');
    }
  }

  // for later : onClick={stakeFiveTokens}
  return (
    <div  className={`h-full flex flex-col before:from-white after:from-sky-200 py-2 `}>
      <header className="App-header">
        <h1> Welcome to your DAPP application</h1>
      </header>
      <div className="flex flex-col flex-1 justify-center items-center">
      <div className="grid gap-4">
        <p> Account : {meta.accounts[0]}</p>
        {meta.totalSupply === "0" && <p>FiveToken total supply: 0</p>}
        {meta.totalSupply !== "0" && <p>FiveToken total supply: {meta.totalSupply} Five</p>}
        <p> Your FiveToken balance: {meta.accountBalance} Five</p>
        <p> Your FiveToken stack: {meta.accountTotalStake} Five</p>
        <button className="bg-black text-white p-4 rounded-lg" onClick={stakeFiveTokens}><p>Stake</p></button>
        </div>
      </div>
    </div>
  );
};
