"use client"

import React, { useCallback, useEffect, useState } from "react"
import Image from "next/image";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { ethers } from "ethers";
import { getFiveTokenContractAddress } from "./tools/getFiveTokenAddress";

const inter = Inter({ subsets: ["latin"] });

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

        // console.log("Accounts = ", meta.accounts);

        // const providerStamp = new ethers.JsonRpcProvider(); // for testnet
        const providerStamp = new ethers.JsonRpcProvider('http://localhost:8545'); // for local hardhat
        
        // [K] false try usign api to fix cross-origin issue
        // const providerStamp = new ethers.JsonRpcProvider("api/ethereum", 
          // {
          //   chainId: 31337, // Chaîne d'identification du réseau Hardhat
          //   name: 'hardhat', // Nom du réseau Hardhat
          // }
        // ); // for localnode hardhat


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

  // useEffect(() => {
  //   if (state.fiveContract) {
  //     const stakeListener = createStakeListener(state.fiveContract);
  //     return () => {
  //       if (stakeListener && stakeListener.removeListener) {
  //         stakeListener.removeListener();
  //       }
  //     };
  //   }
  // }, [state.fiveContract]);

  // async function createStakeListener(contract: ethers.Contract) {
  //   const stakeListener = contract.on("Staked", async (stakerRaw: string, amount: BigNumber) => {
  //     console.log("Staked event : ", stakerRaw, amount.toString());
  //     const staker = ethers.getAddress(stakerRaw).toLowerCase();
  //     console.log("StakerRaw: ", stakerRaw, " => ", staker);
  //     if (staker === state.accounts[0]) {
  //       console.log("Staked event from current user");
  //     }
  //     await getWalletInfos();
  //   });
  //   return stakeListener;
  // }

  function isMetamaskConnected() {
    return (
      typeof meta.fiveContract !== "undefined" &&
      typeof meta.accounts[0] !== "undefined"
    );
  }

  async function getWalletInfos() {
    try {
      if (window.ethereum) {

        // TEST
        // const contract = new ethers.Contract(
        //   getFiveTokenContractAddress(),
        //   meta.fiveContract!.interface,
        //   meta.signer
        // );
  
        // // Appelez la méthode totalSupply() sur l'instance du contrat connectée au signataire
        // const totalSupply2 = await contract.totalSupply();
        // console.log("totalSupply2 = ", totalSupply2);

        await meta.fiveContract!.totalSupply().then((rawValue) => {
          const formatedValue = ethers.formatEther(rawValue);
          console.log("totalSupply = ",rawValue, " => ", formatedValue);
        })


        // const totalSupply = await meta.fiveContract!.totalSupply();
        // console.log("totalSupply = ", totalSupply);
        // const formattedTotalSupply = ethers.formatEther(totalSupply);
        // console.log("totalSupply = ", totalSupply, " => ", formattedTotalSupply);
        // setMeta((prevState) => ({ ...prevState, totalSupply: formattedTotalSupply }));

        // const accountBalance = await meta.fiveContract!.balanceOf(meta.accounts[0]);
        // const formattedAccountBalance = ethers.formatEther(accountBalance);
        // console.log("accountBalance = ", accountBalance, " => ", formattedAccountBalance);
        // setMeta((prevState) => ({ ...prevState, accountBalance: formattedAccountBalance }));

        // const stackingSummary = await meta.fiveContract!.hasStake(meta.accounts[0]);
        // const formattedAccountTotalStake = ethers.formatEther(stackingSummary.total_amount);
        // console.log("stackingSummary.total_amount = ", stackingSummary.total_amount, " => ", formattedAccountTotalStake);
        // setMeta((prevState) => ({ ...prevState, accountTotalStake: formattedAccountTotalStake }));
      } else {
        throw new Error("Can't getWalletInfos from Metamask.");
      }
    } catch (error) {
      console.log("getWalletInfos Error : ", (error as Error).message);
    }
  }

  // async function stakeFiveTokens() {
  //   try {
  //     const amount = 1472;
  //     const abi = await getABI();
  //     const address = getFiveTokenContractAddress();
  //     const contractS = new ethers.Contract(address, abi, state.signer);
  //     const amountParsed = ethers.parseEther(amount.toString());

  //     const gasEstimate = await contractS.stake.estimateGas(amountParsed);
  //     const gasPrice = (await state.provider!.getFeeData()).gasPrice;

  //     console.log("gasPrice : ", gasPrice);
  //     console.log("gasEstimate : ", gasEstimate);

  //     const gasCost = gasEstimate.mul(gasPrice);
  //     const gasCostInEth = ethers.formatEther(gasCost);
  //     console.log("gasCost : ", gasCost);

  //     console.log("Gas cost: ", gasCostInEth, " Ether");

  //     const confirmed = await window.ethereum.request({
  //       method: "eth_sendTransaction",
  //       params: [
  //         {
  //           to: address,
  //           from: await state.signer!.getAddress(),
  //           value: "0x0",
  //           gas: gasEstimate.toString(),
  //           gasPrice: gasPrice.toString(),
  //           data: contractS.interface.encodeFunctionData("stake", [amountParsed]),
  //         },
  //       ],
  //     });

  //     if (!confirmed) {
  //       console.log("Transaction canceled.");
  //       return;
  //     }

  //     console.log("Transaction validate, waiting for process...");

  //     const receipt = await state.provider!.waitForTransaction(confirmed);
  //     console.log("Stake transaction Done receipt : ", receipt);
  //   } catch (error) {
  //     console.log("stakeFiveTokens Error : ", error.message);
  //   }
  // }

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
        <button className="bg-black text-white p-4 rounded-lg"><p>Stake</p></button>
        </div>
      </div>
    </div>
  );
};
