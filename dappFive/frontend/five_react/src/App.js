import './App.css';

import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { getFiveTokenContractAddress } from './config/config';

function App() {

  const [accounts, setAccounts] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);
  // const [accountStakes, setAccountStakes] = useState([]);
  const [accountTotalStake, setAccountTotalStake] = useState(0);
  const [fiveContract, setFiveContract] = useState(0);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);


  useEffect(() => {
    // Here we check if there is web3 support / if metamask is installed
    connectWallet();
  }, []);

  useEffect(() => {
    // let time to connectWallet to retrieve account
    if (isMetamaskConnected()) {
      getWalletInfos();
    }
  }, [fiveContract]);

  async function connectWallet() {
    try {
      
      if (window.ethereum) {
        
        // Request account access
        const accountsStamp = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccounts(accountsStamp);

        // const providerStamp = new ethers.BrowserProvider(window.ethereum);
        const providerStamp = new ethers.JsonRpcProvider();
        const signerStamp = await providerStamp.getSigner();
        setSigner(signerStamp);
        setProvider(providerStamp);

        const abi = await getABI();
        const address = getFiveTokenContractAddress();

        const contractStamp = new ethers.Contract(address, abi, providerStamp);

        setFiveContract(contractStamp);
      } else {
        console.error('MetaMask is needed to use this dapp.');
      }
    } catch (error) {
      console.log("connectWallet Error : ", error.message);
    }
  }

  // For Listener
  useEffect(() => {
    if (fiveContract) {
      const stakeListener = createStakeListener(fiveContract);

      return () => {
        if (stakeListener && stakeListener.removeListener) {
          stakeListener.removeListener();
        }
      };
    }
  }, [fiveContract]);

  async function createStakeListener(contract) {
    const stakeListener = contract.on("Staked", async (stakerRaw, amount) => {
      console.log("Staked event : ", stakerRaw, amount);

      const staker = ethers.getAddress(stakerRaw).toLowerCase();
      console.log("StakerRaw: ", stakerRaw, " => ", staker);

      if (staker === accounts[0]) {
        console.log("Staked event from current user");
      }
      await getWalletInfos();
    });

    return stakeListener;
  }

  function isMetamaskConnected() {
    return typeof fiveContract !== "undefined" 
      && typeof accounts[0] !== "undefined"
  }

  async function getWalletInfos() {
    try {
      if (window.ethereum) {
        await fiveContract.totalSupply().then((rawValue) => {
          const formatedValue = ethers.formatEther(rawValue);
          console.log("totalSupply = ",rawValue, " => ", formatedValue);
          setTotalSupply(formatedValue);
        })

        await fiveContract.balanceOf(accounts[0]).then((rawValue) => {
           const formatedValue = ethers.formatEther(rawValue);
           console.log("accountBalance = ",rawValue, " => ", formatedValue);
           setAccountBalance(formatedValue);
        });

        await fiveContract.hasStake(accounts[0]).then((stackingSummary) => {
          const formatedValue = ethers.formatEther(stackingSummary.total_amount);
          console.log("stackingSummary.total_amount = ",stackingSummary.total_amount, " => ", formatedValue);
          setAccountTotalStake(formatedValue);
        });

      } else {
        throw new Error("Can't getWalletInfos from Metamask.");
      }
    } catch (error) {
      console.log("getWalletInfos Error : ", error.message);
    }
    
  }



  async function stakeFiveTokens() {
    
    try {
      const amount = 1472;
      const abi = await getABI();
      const address = getFiveTokenContractAddress();
      // const privateKey = getPrivateKey();
      // const wallet = new ethers.Wallet(privateKey, provider);


  
      const contractS = new ethers.Contract(address, abi, signer);
      const amountParsed = ethers.parseEther(amount.toString());
      

      // Estimate gas cost and ask confirmation
      const gasEstimate = await contractS.stake.estimateGas(amountParsed);
      const gasPrice = (await provider.getFeeData()).gasPrice;

      console.log("gasPrice : ", gasPrice);
      console.log("gasEstimate : ", gasEstimate);

      const gasCost = gasEstimate * gasPrice;
      const gasCostInEth = ethers.formatEther(gasCost);
      console.log("gasCost : ", gasCost);

      console.log("Gas cost: ", gasCostInEth, " Ether");

      // Ask confirmation request via MetaMask
      const confirmed = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: address,
            from: await signer.getAddress(),
            value: "0x0",
            gas: gasEstimate.toString(),
            gasPrice: gasPrice.toString(),
            data: contractS.interface.encodeFunctionData("stake", [amountParsed]),
          },
        ],
      });

      if (!confirmed) {
        console.log("Transaction canceled.");
        return;
      }

      console.log("Transaction validate, waiting for process...");

      // Wait 
      const receipt = await provider.waitForTransaction(confirmed);
      console.log("Stake transaction Done receipt : ", receipt);
    } catch (error) {
      console.log("stakeFiveTokens Error : ", error.message);
    }

  }

  async function getABI() {
    let ABI = "";

    await fetch("./FiveToken.json", {
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
      ABI = data.abi; // [!] need abi, not all json
    }).catch((error) => {
      throw new Error(error);
    });

    if (Array.isArray(ABI) && ABI.length > 0) {
        return ABI;
      } else {
        throw new Error('Invalid ABI format.');
      }
  }

  return (
        <div className="App">
            <header className="App-header">
                <h1> Welcome to your DAPP application</h1>
                <p> Account : {accounts[0]}</p>
                {totalSupply === 0 && <p>FiveToken total supply: 0</p>}
                {totalSupply !== 0 && <p>FiveToken total supply: {totalSupply} Five</p>}
                <p> Your FiveToken balance: {accountBalance} Five</p>
                <p> Your FiveToken stack: {accountTotalStake} Five</p>
                <button onClick={stakeFiveTokens}><p>Stake</p></button>
            </header>
        </div>
      );
}

export default App;




/* ------------------------------------------------------- */

  /* version utilisant directement wallet avec privatekey pas de confirmation metamask
  async function stakeFiveTokens() {
    
    try {
      const amount = 1472;
      const abi = await getABI();
      const address = getFiveTokenContractAddress();
      const privateKey = getPrivateKey();
      const wallet = new ethers.Wallet(privateKey, provider);


  
      const contractS = new ethers.Contract(address, abi, wallet);
      const amountParsed = ethers.parseEther(amount.toString());
      

      // Estimate gas cost and ask confirmation
      const gasEstimate = await contractS.stake.estimateGas(amountParsed);
      const gasPrice = (await provider.getFeeData()).gasPrice;

      console.log("gasPrice : ", gasPrice);
      console.log("gasEstimate : ", gasEstimate);

      const gasCost = gasEstimate * gasPrice;
      const gasCostInEth = ethers.formatEther(gasCost);
      console.log("gasCost : ", gasCost);

      // // Demander une confirmation à l'utilisateur
      // const confirmed = window.confirm(`Estimated Gas cost for this transaction is ${gasCostInEth} Ether. Would you like to continue ?`);

      // if (!confirmed) { return; }



      const tx = await contractS.stake(amountParsed);
      const receipt = await tx.wait();
  
      console.log("Stake transaction Done receipt : ", receipt);
      // [!] Fake update --> TODO listen method
      setAccountBalance(accountBalance - amount);
    } catch (error) {
      console.log("stakeFiveTokens Error : ", error.message);
    }

  }
  */

