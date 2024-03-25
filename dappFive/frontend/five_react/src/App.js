import './App.css';
import React, { useState, useEffect, Component } from 'react';
import Web3 from 'web3'


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


function App() {

  const [fiveToken, setFiveToken] = useState(0);
  const [accounts, setAccounts] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);
  const [accountStakes, setAccountStakes] = useState({});


  useEffect(() => {
    // Here we check if there is web3 support / if metamask is installed
    if (typeof window.ethereum !== 'undefined') {

      // console.log("window.ethereum :", window.ethereum);
      
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      

      const fetchAccounts = async () => {
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
      }

      const getFiveTokenContract = async () => {
        const abi = await getABI();
        const address = getFiveTokenContractAddress();
        const fiveToken = new web3.eth.Contract(abi, address); // Make a new instance of the contract'
        setFiveToken(fiveToken);
      }

      fetchAccounts();
      getFiveTokenContract();




      //the MetaMask window.web3.currentProvider shim. This property is deprecated
      // if (window.web3.currentProvider.isMetaMask === true) {
      //     // connectMetaMask();
      //     // connectToSelectedNetwork(web3);
      //     console.log("window.web3.currentProvider.isMetaMask === true");
      //   } else {
      //     // Another web3 provider, add support if you want
      //     throw new Error("Only metamask supported yet");
      //   }

      // Request user's account address
      // window.ethereum.request({ method: 'eth_requestAccounts' })
      // .then((accounts) => {
      //   console.log("User's accounts[0] address:", accounts[0]);
      //   setAccounts(accounts);
      //   // connectToSelectedNetwork(web3);
      // })
      // .catch((error) => {
      //   throw new Error(error);
      // });

    } else {
      // MetaMask is not installed
      throw new Error("MetaMask is not installed. Please install it to use this DAPP.");
    }
  }, []);

  useEffect(() => {
    if (loaded && (accounts !== 0) && (fiveToken !== 0)) {
      // console.log("accounts :", accounts);
      getUserProfile();
    } else {
    // dirty trick to trigger reload if something went wrong
      setTimeout(setLoaded(true), 500);
    }
  }, [loaded, accounts, fiveToken]);


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

    return ABI;
  }

  async function getUserProfile() {
  
    call(fiveToken.methods.balanceOf, setAccountBalance, accounts[0]);
    call(fiveToken.methods.hasStake, setAccountStakes, accounts[0]);
    call(fiveToken.methods.totalSupply, setTotalSupply);

    console.log("totalSupply = ", totalSupply);
    // await fiveToken.methods.totalSupply().call()
    // .then((result) => {
    //   setTotalSupply(result);
    // })
    // .catch((error) => {
    //   throw new Error(error);
    // })
  }

  // A hardcoded shortcut with FiveToken contract address from ganache 
  function getFiveTokenContractAddress() {
    return "0x1917b8513697Cf919eec8E848b139013c14C8402";
  }

  function call(func, callback, ...args) {
    func(...args).call()
    .then((result) => {
      callback(result);
    })
    .catch((error) => {
      throw new Error(error);
    })
  }

  // async function connectToSelectedNetwork(web3) {
  //   const abi = await getABI();
  //   const address = getFiveTokenContractAddress();

  //   // [!] web3.eth UNDEFINED !
  //   const fiveToken = new web3.eth.Contract(abi, address); // Make a new instance of the contract'
  //   setFiveToken(fiveToken);
  // }

   
  // function connectMetaMask() {
  //     // We need to make the connection to MetaMask work.
  //     // Send Request for accounts and to connect to metamask.
  //     window.web3.requestAccounts()
  //     .then((result) => {
  //     // Whenever the user accepts this will trigger
  //     console.log(result)
  //     })
  //     .catch((error) => {
  //     // Handle errors, such as when a user does not accept
  //     throw new Error(error);
  //     });
  // };

  return (
    <div className="App">
        <header className="App-header">
            <h1> Welcome to your DAPP application</h1>
            <p> Account : {accounts[0]}</p>
            <p>FiveToken total supply : {totalSupply}</p>
            <button ><p>Stake</p></button>
        </header>
    </div>
  );
}

export default App;
