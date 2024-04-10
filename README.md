# Neopuyo42 Token project - Overview

> **What are we talking about here ?**  
> The aim of this project is to **deploy** a **token** *called Neopuyo42* on a **blockchain decentralized network**

## Shortcuts
  - [**Project overview**](#project-overview)
  - [**Choices made**](#choices-made)
  - [**Deployment sheet**](#deployment-sheet)
  - [**What Neopuyo42Token represents**](#what-neopuyo42token-represents)
  - [**`Project documentation` table of contents**](./documentation/tokenizerDocumentation.md)


## Project overview

> A demonstration on how can be used the Neopuyo42 token











<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

---
---
---

## **Choices made**

**🔻 Blockchain**  

> First and foremost, i needed to choose a **blockchain platform** that supports the
creation of tokens.

![Blochain Platefrom supporting token creation](./documentation//ressources/BlochainPlateform.webp)

*image from this medium [article](https://medium.com/geekculture/top-5-blockchain-platforms-to-be-considered-for-token-development-7b2c42decdf4)*

I chose **Binance** plateform because :  
  - this subject is the production of a partnership between 42 and BNB Chain
  - looks beginner friendly with tutorials & documentation
  - supports a lot of language like `GO`, `Java`, `Javascript`, `C++,` `C#`, `Python`
  - can use `NodeJS` framworks *like ganache and truffle or later hardhat*
  - EVM (Ethereum Virtual Machine) compatible, support **Ethereum** toolings including **Metamask**, **Remix**  
&emsp;  **Ethereum** compatibility looks really nice to a beginner.
&emsp;  The Metamask wallet has a lot of documentation and seems to be the most used one.

**🔻 Token**

To build a **token**, you need to create a **smart contract** written in **solidity**.
Each smart contract is a bit like a `class` with `properties` and `methods`. 

>  You can read the smart contracts used in this project in [the contracts folder](./code/dappNeopuyo42/project/contracts/)

The Ethereum blockchain has and **ERC-20** protocol which can be implemented to build a token.
And because **Binance** is built to be Ethereum-compatible it has its **BEP-20** equivalent interface. 

> To learn more about token creation you can read my [meet new things](./documentation/pages/meet_new_things.md) document.

**🔻 Frameworks**

Once the **smart contract** of your **token** is written, you need some **frameworks** to **compile** it, **test** it and **deploy** it on **local network**, on **test blockchain network** or on **main blockchain network**.  
I firstly tried **ChainIDE** which is a nice way to getting started. Therefore a cloud IDE isn't really what i needed. That's why i chose to continue with **Truffle** and **Ganache**. These two frameworks can easily be used through **npm**. Truffle is responsible of deploying the smart contract and Ganache hold the local server to communicate with the frontend **dapp** part.  
And later, i discovered that the team working on these two projects were migrating to **Hardhat** since september 2023. So i chose to migrate myself to **Hardhat** too, to take advantage of its rich and updated documentation.

> To learn more about the blockchain and its frameworks you can read my [blockchain](./documentation/pages/blockchain.md) document.

<br/>

  ## **Deployment sheet**

| The Neopuyo42 smart contract address                |
|-------------------------------------------|
| 0xd3bc037d57c93ad8ab1d8519049d52a7510cc5fa|

  
| The network used | |
| -------------------:| ------------|
|     Network name: | BNB Chain
Network URL: | https://bsc-dataseed.binance.org/  
Chain ID: | 56
Currency symbol:| BNB
Block explorer URL:| https://bscscan.com/

  
| The `test` network used | |
| -------------------:| ------------|
|     Network name | BNB Chain Testnet
Network URL | https://data-seed-prebsc-1-s1.binance.org:8545/
Chain ID | 97
Currency symbol| tBNB
Block explorer URL| https://testnet.bscscan.com
tBNB FAUCET| [https://testnet.binance.org/faucet-smart](https://testnet.binance.org/faucet-smart)  
All Bsc RPC| [Follow this link](https://docs.bnbchain.org/docs/BSCtestnet/)  

> Go to [howToDeployNeopuyo42Token](./deploy/howToDeployNeopuyo42Token.md) for further deployment details

<br/>

## **What Neopuyo42Token represents**

> How Neopuyo42Token will be used and what
it will represent

Neopuyo42Token is a blockchain currency created for trainning purpose, it is only deployed in a test blockchain environnement the **Bsc testnet**.  
A **decentralized application** build with ReactJS is here to demonstrate how you can interact with the token. The dapp will retrieve the **contract transactions** on the testnet blockchain and will be able to **read** the token data, or to **write** new transactions on the blockchain.

For exemple you can **stake** some token. Staking is a major part of currency and the staked amount is essentially a **pledge** to support the network. By staking their tokens, users can earn rewards for participating in the validation of transactions on the blockchain. This process helps to secure the network and ensure its integrity, while also providing an opportunity for token holders to earn passive income.

> Has a demonstration about staking and withdrawing Neopuyo42 token, you can read the [overview](#project-overview) part at top of this ReadMe.