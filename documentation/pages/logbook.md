# **Logbook, the road i followed to build the project**

[< Table of contents](../tokenizerDocumentation.md)

## **The road i followed to build the project**

1. Read provided links and documentation, note keyword and their meaning in this file
2. Lets try to code something, using this BNB Chain tutorial  
[Develop Full Stack dApp on BNB Smart Chain in 5 minutes](https://docs.bnbchain.org/docs/dapp-dev/Hello-World/) "😮 5 minutes"
   - including [Connecting MetaMask to BNB Smart Chain](https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain)
3. [Issue BEP20 Tokens](https://docs.bnbchain.org/docs/issue-BEP20/) +  [Let’s create your own BEP20 Token on Binance Smart Chain(Step-by-Step by using BEP20-Token Template)](https://misterfocusth.medium.com/lets-create-your-own-bep20-token-on-binance-smart-chain-step-by-step-by-using-bep20-token-c41eacd1a5da)  
4. [This tutorial going a bit deeper](https://blog.logrocket.com/how-to-create-deploy-bep-20-token-binance-smart-chain/)
5. How deploy the token through something like a dApp ? following this **tutorial serie** should be interesting :  
   - [Building a Decentralized Application with BEP-20 contract in Solidity](https://programmingpercy.tech/blog/building-a-decentralized-application-with-bep-20-contract-in-solidity/)
   - [Creating a Inheritable Staking contract in Solidity](https://programmingpercy.tech/blog/creating-a-inheritable-staking-contract-in-solidity/)
   - [Using a Smart contract in an Web Application](https://programmingpercy.tech/blog/using-a-smart-contract-in-an-web-application/)  
     - [How to add a custom network RPC Metamask doc](https://support.metamask.io/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC)  
     - [Try with ethersJS library](https://docs.ethers.org/v6/getting-started/) The frontend of Percyprograming is outdated | The EthersJS documentation isn't really helpfull. I used this [medium article](https://medium.com/coinmonks/integrating-ether-js-with-react-a-comprehensive-guide-cd9ccba57b93) to get help  
   - [Deploying Smart Contracts to Binance Smart chain with Truffle](https://programmingpercy.tech/blog/deploying-smart-contracts-to-binance-smart-chain-with-truffle/)
6. - Truffle and Ganache [deprecated : Consensys Announces the Sunset of Truffle and Ganache and New Hardhat Partnership](https://consensys.io/blog/consensys-announces-the-sunset-of-truffle-and-ganache-and-new-hardhat) (2023) need migrate to Hardhat
   - [Using Hardhat for Deploying Smart Contracts on BSC - doc](https://docs.bnbchain.org/docs/hardhat-new/) Seems not working well, let's try this [medium tuto](https://medium.com/@melihgunduz/deploying-smart-contract-to-bsc-testnet-with-hardhat-aa7b046eea1d) from nov 2023
   - [Hardhat doc tutorial (updated 20 march 2024)](https://hardhat.org/tutorial) if need reset from scratch ... included a boilerplate project code
7. - seems Bsc testnet not working (yet / anymore ?) -> let's follow **Hardhat** doc that advise to deploy on [Ethereum](https://ethereum.org/en/developers/docs/networks/#ethereum-testnets) with **sepolia testnet** in this, [doc](https://docs.alchemy.com/docs/how-to-deploy-a-smart-contract-to-the-sepolia-testnet) from **Alchemy**  
***Aborted** : Sepolia Faucet need holding 0.001 ETH on mainnet to give sepoliaETH*  
1. - Bsc testnet is working back ! Can go on from point 6. Let's now implement our own contract from Percy tutorials deloy them with Hardhat and then interact with it from the react dapp.
lets use NexjJS too and link Metamask types with typescript.  
     - [Connecting to MetaMask with Next.js and Typescript](https://medium.com/@mansour-qaderi/connecting-to-metamask-with-next-js-and-typescript-63a294144443) 
     - [How to call smart contracts using Ethers + NextJS](https://medium.com/@flavtech/how-to-easily-call-smart-contracts-using-ethers-nextjs-dd3dabd43c07)  
     - [hardhat-boilerplate project](https://github.com/NomicFoundation/hardhat-boilerplate/blob/master/frontend/src/components/Dapp.js)


## TIPS & FIXES


### 🔻 **Ganache and Truffle**  

> These tips are no longer usefull if you use Hardhat

**[1] "Invalid opcode in smart contract"**  

After **truffle migrate/test** to **ganache** desktop :  
to fix:  
    `pragma solidity >0.4.0 <= 0.8.19;`  
and in *truffle-config.js* :
```
 compilers: {
    solc: {
      version: "0.8.19",  
```

---

**[2] using Docker Containers**  
Can't use localhost 127.0.0.1
Need find host machine ip address with `ifconfig` then update *truffle-config.js*

```
development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
     host: "192.XXX.XXX.X", // The machine ip address host
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
```

---

### 🔻 **MetaMask : window.web3.currentProvider**

You are accessing the MetaMask window.web3.currentProvider shim. This property is deprecated; use window.ethereum instead.

To update see this [metamask doc](https://docs.metamask.io/wallet/concepts/wallet-api/)

---

### 🔻 **NextJS**  
[Next.JS 13.4 : Using Context API in App router](https://medium.com/@seb_5882/nextjs-13-4-using-context-api-in-app-router-a1198a61c5c8)  

---

<br/>


[< Table of contents](../tokenizerDocumentation.md)