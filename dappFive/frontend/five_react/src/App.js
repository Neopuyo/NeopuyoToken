import './App.css';

import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";

function App() {

  const [accounts, setAccounts] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);
  const [accountStakes, setAccountStakes] = useState({});
  const [fiveContract, setFiveContract] = useState(0);
  // const [fiveWallet, setFiveWallet] = useState(0);
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

        setFiveContract(new ethers.Contract(address, abi, providerStamp));
      } else {
        console.error('MetaMask is needed to use this dapp.');
      }
    } catch (error) {
      console.log("connectWallet Error : ", error.message);
    }
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

      } else {
        throw new Error("Can't getWalletInfos from Metamask.");
      }
    } catch (error) {
      console.log("getWalletInfos Error : ", error.message);
    }
    
  }

  async function stakeFiveTokens() {

    if (typeof fiveContract === "undefined") {
      console.log("typeof fiveContract === undefined");
      return;
    }

    if (!signer) {
      console.log("signer is NULL");
      return ; 
    }

    await signer.getAddress().then((result) => {
        console.log("signerAddress = ", result);
    });

    const abi = await getABI();
    const address = getFiveTokenContractAddress();
    const privateKey = getPrivateKey();
    const wallet = new ethers.Wallet(privateKey, provider);

    const contractS = new ethers.Contract(address, abi, wallet);
    const amount = ethers.parseEther("1472"); // convertit l'Ether en Wei
    
    const tx = await contractS.stake(amount);
    const receipt = await tx.wait();

    console.log("Stake transaction Done receipt : ", receipt);

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

  // A hardcoded shortcut with FiveToken contract address from ganache 
  // GET CORRECT CONTRACT ADDRESS IN GANACHE
  // need be update after each migration
  function getFiveTokenContractAddress() {
    // return "0x1917b8513697Cf919eec8E848b139013c14C8402";
    // return "0x30Dbdcb045f6EB1A058c10f2acdFC69C26e3F3c0";
    // return "0x8290DE0cd608E1643c00426404516F96565151BC";
    // return "0xF8b182f81C9C6431c97f62a8004aE366c5f32eB9";
    // return "0x76782C6181ca62A85580473fFDDba7Ad5dba4C54";
    return "0x025998C6322385CC0b371dB602C8796Dde41DC59";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
  }

  function getPrivateKey() {
    return "0x3197c4a8fc6b0a9438304a7ffe40a3c782fd1ff52a174c57b6483b8fcb0d966e";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
  }





  return (
        <div className="App">
            <header className="App-header">
                <h1> Welcome to your DAPP application</h1>
                <p> Account : {accounts[0]}</p>
                {totalSupply === 0 && <p>FiveToken total supply: 0</p>}
                {totalSupply !== 0 && <p>FiveToken total supply: {totalSupply} Five</p>}
                <p> Your FiveToken balance: {accountBalance} Five</p>
                <button onClick={stakeFiveTokens}><p>Stake</p></button>
            </header>
        </div>
      );
}

export default App;





/****************************************** */

/*
function App() {
  const [provider, setProvider] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [network, setNetwork] = useState('');
  const [contractP, setContractP] = useState(null);
  const [contractS, setContractS] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        setAccounts(accounts);
        setProvider(provider);
      }
    };

    initializeProvider();
  }, []);
  
  useEffect(() => {

    const getContract = async () => {
      const signer = provider.getSigner();
      const abi = await getABI();
      const contractAddress = getFiveTokenContractAddress();

      const contractP = new ethers.Contract(contractAddress, abi, provider);
      setContractP(contractP);

      const contractS = new ethers.Contract(contractAddress, abi, signer);
      setContractS(contractS);
    }

     const getNetwork = async () => {
      const network = await provider.getNetwork();
      setNetwork(network.name);
    };

    if (provider && accounts) {
      getContract();
      getNetwork();
      getWalletInfos();
    }
  }, [provider, accounts]); // refaire plutot comme avant pour ca


  function stakeFiveTokens() {
    const amount = 1472;

    if (!contractS) {
      console.log("contractSigner is null");
      return;
    }
    
    contractS.stake(amount).estimateGas({from: accounts[0]})
      .then((gas) => {
        contractS.stake(amount).send({
          from: accounts[0],
          gas: gas,
        });

        // [!] Fake update of account by changing stake, Trigger a reload when transaction is done later
        setAccountBalance(accountBalance - amount);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  async function getWalletInfos() {
    try {
      if (window.ethereum) {
        await contractP.totalSupply().then((rawValue) => {
          const formatedValue = ethers.formatEther(rawValue);
          console.log("totalSupply = ",rawValue, " => ", formatedValue);
          setTotalSupply(formatedValue);
        })

        await contractP.balanceOf(accounts[0]).then((rawValue) => {
           const formatedValue = ethers.formatEther(rawValue);
           console.log("accountBalance = ",rawValue, " => ", formatedValue);
           setAccountBalance(formatedValue);
        });

      } else {
        throw new Error("Can't getWalletInfos from Metamask.");
      }
    } catch (error) {
      console.log("getWalletInfos Error : ", error.message);
    }
    
  }


  const interactWithContract = async () => {
    if (contractP) {
      await contractP.totalSupply().then((rawValue) => {
        const formatedValue = ethers.formatEther(rawValue);
        console.log("totalSupply = ",rawValue, " => ", formatedValue);
        setTotalSupply(formatedValue);
      })
    }
  };
  

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

    // A hardcoded shortcut with FiveToken contract address from ganache 
  // GET CORRECT CONTRACT ADDRESS IN GANACHE
  // need be update after each migration
  function getFiveTokenContractAddress() {
    // return "0x1917b8513697Cf919eec8E848b139013c14C8402";
    // return "0x30Dbdcb045f6EB1A058c10f2acdFC69C26e3F3c0";
    // return "0x8290DE0cd608E1643c00426404516F96565151BC";
    // return "0xF8b182f81C9C6431c97f62a8004aE366c5f32eB9";
    // return "0x76782C6181ca62A85580473fFDDba7Ad5dba4C54";
    return "0x025998C6322385CC0b371dB602C8796Dde41DC59";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
    // return "";
  }




  return (
    <div className="App">
        <header className="App-header">
            <h1> Welcome to your DAPP</h1>
            <p>Connected to network: {network}</p>
            {accounts !== null &&<p> Account : {accounts[0]}</p>}
            <p> Your FiveToken balance: {accountBalance} Five</p>
            {totalSupply !== 0 && <p>FiveToken total supply: {totalSupply} Five</p>}
            <button onClick={interactWithContract}>Display</button>
            <button onClick={stakeFiveTokens}><p>Stake</p></button>
        </header>
    </div>
  );

}

export default App;


*/