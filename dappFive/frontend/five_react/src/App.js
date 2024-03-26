import './App.css';
import React, { useState, useEffect, Component } from 'react';
import { ethers } from "ethers";



// class App extends Component {
//   componentWillMount() {
//     this.loadBlockchainData()
//   }

//   async loadBlockchainData() {
//     const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
//     const accounts = await web3.eth.getAccounts()
//     this.setState({ account: accounts[0] })
//   }

//   constructor(props) {
//     super(props)
//     this.state = { account: '' }
//   }

//   render() {
//     return (
//       <div className="container">
//         <h1>Hello, World!</h1>
//         <p>Your account: {this.state.account}</p>
//       </div>
//     );
//   }
// }

// export default App;


//------------------------------------------------------------------

function App() {

  const [fiveToken, setFiveToken] = useState(0);
  const [accounts, setAccounts] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);
  const [accountStakes, setAccountStakes] = useState({});

  useEffect(() => {
    // Here we check if there is web3 support / if metamask is installed
    connectWallet();
    getWalletInfos();

    
  }, []);

  async function connectWallet() {
    try {
      
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        setAccounts(accounts);
      } else {
        console.error('MetaMask is needed to use this dapp.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getWalletInfos() {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = provider.getSigner();

        const abi = await getABI();
        const address = getFiveTokenContractAddress();

        // [!] si utilisé ainsi, à séparer
        const contract = new ethers.Contract(address, abi, provider);
        setFiveToken(contract);
        
        await contract.totalSupply().then((rawValue) => {
          const formatedValue = ethers.formatEther(rawValue);
          console.log("totalSupply = ",rawValue, " => ", formatedValue);
          setTotalSupply(formatedValue);
        });

        await contract.balanceOf(accounts[0]).then((rawValue) => {
           const formatedValue = ethers.formatEther(rawValue);
           console.log("accountBalance = ",rawValue, " => ", formatedValue);
           setAccountBalance(formatedValue);
        });

      } else {
        throw new Error("Can't getWalletInfos from Metamask.");
      }
    } catch (error) {
      console.error(error);
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

  // A hardcoded shortcut with FiveToken contract address from ganache 
  // GET CORRECT CONTRACT ADDRESS IN GANACHE
  // need be update after each migration
  function getFiveTokenContractAddress() {
    // return "0x1917b8513697Cf919eec8E848b139013c14C8402";
    // return "0x30Dbdcb045f6EB1A058c10f2acdFC69C26e3F3c0";
    // return "0x8290DE0cd608E1643c00426404516F96565151BC";
    // return "0xF8b182f81C9C6431c97f62a8004aE366c5f32eB9";
    return "0x76782C6181ca62A85580473fFDDba7Ad5dba4C54";
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
                <button ><p>Stake</p></button>
            </header>
        </div>
      );
}

export default App;














//------------------------------------------------------------------
// function App() {

//   const [fiveToken, setFiveToken] = useState(0);
//   const [accounts, setAccounts] = useState(0);
//   const [loaded, setLoaded] = useState(false);
//   const [totalSupply, setTotalSupply] = useState(0);
//   const [accountBalance, setAccountBalance] = useState(0);
//   const [accountStakes, setAccountStakes] = useState({});


//   useEffect(() => {
//     // Here we check if there is web3 support / if metamask is installed
//     if (typeof window.ethereum !== 'undefined') {      
//       const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      

//       const fetchAccounts = async () => {
//         const accounts = await web3.eth.getAccounts();
//         setAccounts(accounts);
//       }

//       const getFiveTokenContract = async () => {
//         const abi = await getABI();
//         const address = getFiveTokenContractAddress();
//         const fiveToken = new web3.eth.Contract(abi, address); // Make a new instance of the contract'
//         setFiveToken(fiveToken);
//       }

//       fetchAccounts();
//       getFiveTokenContract();

//     } else {
//       // MetaMask is not installed
//       throw new Error("MetaMask is not installed. Please install it to use this DAPP.");
//     }
//   }, []);

//   useEffect(() => {
//     if (loaded && (accounts !== 0) && ((fiveToken !== 0) || (typeof fiveToken.methods !== 'undefined'))) {
//       // console.log("accounts :", accounts);
//       getUserProfile();
//     } else {
//     // dirty trick to trigger reload if something went wrong
//       setTimeout(setLoaded(true), 500);
//     }
//   }, [loaded, accounts]);


//   async function getABI() {
//     let ABI = "";

//     await fetch("./FiveToken.json", {
//       headers : {
//         'Accept': 'application.json',
//         'Content-Type': 'application.json',
//       }
//     }).then((response) => {
//       if (response.status === 200) {
//         return response.json();
//       } else {
//         throw new Error('Error fetching ABI (FiveToken.json)');
//       }
//     }).then((data) => {
//       ABI = data.abi; // [!] need abi, not all json
//     }).catch((error) => {
//       throw new Error(error);
//     });

//     if (Array.isArray(ABI) && ABI.length > 0) {
//         return ABI;
//       } else {
//         throw new Error('Invalid ABI format.');
//       }
//   }

//   async function getUserProfile() {
  
//     call(fiveToken.methods.balanceOf, setAccountBalance, accounts[0]);
//     call(fiveToken.methods.hasStake, setAccountStakes, accounts[0]);
//     call(fiveToken.methods.totalSupply, setTotalSupply);

//     // await fiveToken.methods.totalSupply().call()
//     // .then((result) => {
//     //   setTotalSupply(result);
//     // })
//     // .catch((error) => {
//     //   throw new Error(error);
//     // })
//     if (typeof totalSupply === 'number') {  
//         console.log("totalSupply = ", totalSupply);
//     }
//   }

//   // A hardcoded shortcut with FiveToken contract address from ganache 
//   // GET CORRECT CONTRACT ADDRESS IN GANACHE
//   function getFiveTokenContractAddress() {
//     // return "0x1917b8513697Cf919eec8E848b139013c14C8402";
//     return "0x30Dbdcb045f6EB1A058c10f2acdFC69C26e3F3c0";
//   }

//   function call(func, callback, ...args) {
//     func(...args).call()
//     .then((result) => {
//       callback(result);
//     })
//     .catch((error) => {
//       throw new Error(error);
//     })
//   }


//   return (
//     <div className="App">
//         <header className="App-header">
//             <h1> Welcome to your DAPP application</h1>
//             <p> Account : {accounts[0]}</p>
//             {totalSupply === 0 && <p>FiveToken total supply: 0</p>}
//             {totalSupply !== 0 && <p>FiveToken total supply: {totalSupply}</p>}
//             <p> Your FiveToken balance: {accountBalance}</p>
//             <button ><p>Stake</p></button>
//         </header>
//     </div>
//   );
// }

// export default App;
