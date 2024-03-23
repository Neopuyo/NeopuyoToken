# Tokenizer
a Web3 BNB Chain related exercise

## **Meet New things 📚**

🔻 **Web3**  
The web 3.0 is the concept of the next generation of the web, in which most users will be connected via a **decentralized network** and have access to their own data.

<br/>

🔻 **Dapps** & **DeFI**

**DApp** stands for **Decentralized applications**, built on peer-to-peer blockchain networks, open-source code  
**DeFI** stands for **Decentralized Finance**

<br/>


🔻 **Solidity**

Solidity is the **programming language** most commonly used in blockchain and smart contracts. [📑](https://docs.soliditylang.org/en/v0.8.24/)

<br/>

🔻 **Token** ~ *a unique digital asset*  
A digital representation of an **asset** that has been issued on an existing blockchain  
Not **mined**, the quantity is determined by the issuer  
This **asset** doesn't necessarily have to be a unit of cryptocurrency; it could be a right to access a service, loyalty points, and so on  

<br/>


🔻 **Ticker**  
A short combination of letters that is used to represent an asset.
- ETH Ethereum
- BTC Bitcoin

<br/>


🔻 **BlockChain**  
enables **tokens** to be created, stored, transferred, and transacted in a real-time, immutable manneracross a decentralized peer-to-peer network. Anything of value can be tracked/traded virtually.

<br/>


🔻 **Whitepaper**  
The whitepaper is a **key ressource** document. Destined to investors, developers, researchers...  interested in understanding of a specific blockchain project. It Explain its workings, objectives, and underlying architecture, as well as to present potential use cases and benefits.

<br/>


🔻 **Smart contracts**  
> Applications or programs that run on the blockchain

A **self-executing program** on a blockchain. Written in blockchain-specific programming languages, such as **Solidity** for **Ethereum**. They are designed to **automatically execute** transactions or actions **when predefined conditions are met** in a secure and transparent manner. 

<br/>


🔻 **[Ethereum](https://ethereum.org/fr/what-is-ethereum)**  

- Ethereum is a decentralized **blockchain** platform that enables the execution of **smart contracts** and the deployment of **DApps**.  

- Unlike **Bitcoin**, which is primarily designed to be a digital currency, Ethereum aims to provide a platform for the creation of autonomous contracts and decentralized applications through its own cryptocurrency called **Ether** (**ETH**).  

- Its smart contracts, can be utilized in various areas such as decentralized finance (**DeFi**), gaming, digital identities, voting systems.  

- Launched in 2015, it has become one of the most popular and widely used blockchain platforms.

- 1 ETH = 10^18 Wei, Wei is used as the smallest quantity of Ether to handle. 

<br/>

🔻 **[ERC-20](https://academy.binance.com/en/articles/an-introduction-to-erc-20-tokens) & [BEP-20](https://academy.binance.com/en/glossary/bep-20) Tokens**

BEP-20 Interface

```Solidity
function totalSupply() external view returns (uint256);
function decimals() external view returns (uint8);
function symbol() external view returns (string memory);
function name() external view returns (string memory);
function getOwner() external view returns (address);
function balanceOf(address account) external view returns (uint256);
function transfer(address recipient, uint256 amount) external returns (bool);
function allowance(address _owner, address spender) external view returns (uint256);
function approve(address spender, uint256 amount) external returns (bool);
function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
```

<br/>

🔻 **[Metamask](https://support.metamask.io/hc/en-us/articles/360015489531-Getting-started-with-MetaMask)**

**MetaMask** is a web browser extension and mobile app that allows you to manage your Ethereum private keys. By doing so, it serves as a **wallet** for Ether and other tokens, and allows you to interact with **decentralized applications**, or **dapps**.

**[RPC](https://support.metamask.io/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC)**  
`R`emote `P`rocedure `C`all, a set of protocols that allow a client (such as MetaMask) to interact with a blockchain. 




<br/>


🔻 **Stacking**  

To **stake** tokens means locking up coins to maintain the security of a blockchain network and earning rewards in return when selected as validators.  *Binance & Ethereum : Proof-of-stake (PoS) consensus mechanism*

<br/>

## **Token creation**

> Creating and deploying **digital assets** in a **blockchain network**  
`Secure - immutable - efficient` &emsp; *Fungible or Non Fungible*

<br/>

🔻 **Fungible Token** - *interchangeables, unique value, divisible*  

- **Utility** token  
provide access to a product or service  
- **Security** token  
represent the **ownership** of the underlaying asset or company  
*For example, if a security token represents a stake in a company, the company itself is the underlying asset.*

<br/>

🔻 **Non Fungible Token** - *NFT unique, non interchangables*  
&emsp; represent the **ownership** of a **digital file** *art, audio, video ...*

<br/>

## **Blockchain**

> Blockchain is a **trustless**, **immutable**, **distributed** **ledger** of **information**

Component | Meaning
--- | :--
**`Trustless`** | Every party has a complete copy of the **ledger**.  No need trusting a third party.
**`Immutable`** | Data in the ledger is **locked**. Adding more is allowed but not editing/modify.
**`Distributed`** | Data is **decentralized**. Ledger is stored and duplicated across many systems in many places.
**`Information`** | Data + **metadata** of an object or action.

```Javascript
// The BlockChain, a chain composed of locked `blocks`
   [Block]-[Block]-[Block]  ...  <<  [NewBlock]
// They represent a complete record of all transactions
```

<br/>

## **Blockchain IDE and frameworks**

**`ChainIDE`**| IDE
--- | ---
**Cloud-based** | Not installed on developper's machine, used from a browser
**Multi-Chain** | Can work with different blockchains. *Ethereum, BNB Chain, ...*

<br/>

**`Remix`**| IDE
--- | ---
**Cloud-based** | Not installed on developper's machine, used from a browser
**single chain** | Ethereum / compatible BNB Chain

<br/>

**`Truffle`**| Framework
--- | ---
**npm** | Need a node environment
**Ethereum** | Ethereum development environment
**What's for ?** | building/testing/developing smart contracts
**Basics** | `truffle init` &emsp; `truffle compile` <br/> `truffle console` &emsp; `truffle test` &emsp; <br/>  `truffle migrate --reset --network bscTestnet`

**`Ganache`**| Framework linked to **Truffle**
--- | ---
**npm** | Need a node environment
**Ethereum** | Ethereum development environment
**What's for ?** | Simulate an Ethereum node locally for tests
**Basics** | `ganache --port 7545` *default 8545*


```bash
npm install -g truffle  
npm install -g ganache
```

<br/>

**`HardHat`**| Framework
--- | ---
**npm** | Need a node environment
**Ethereum** | Ethereum development environment

<br/>

**`Replit`**| IDE
--- | ---
**Cloud-based** | Not installed on developper's machine, used from a browser
**Coding plateform** |  supports **Solidity** programming language and Web3 things 

## BlockChain Related pluggins, frameworks and tools

<br/>

🔻 **Metamask** *Web browser extension & mobile app*

Access decentralized applications *`DApps`* on the **Ethereum** blockchain on browser (*Chrome often*).Users can manage their Ethereum accounts, send and receive Ether, as well as interact with **smart contracts** and **Dapps** directly from their browser. An easy access to the Ethereum ecosystem.  

- using a **secrete recovery phrase** to login aka **seed phrase** (12-24 words)
- Can connect to blockchains **networks**, started **Ethereum**, added then switched to **BNB chain**
- **BNB Smart Chain Testnet network**.  
Play around with fake money and get familiar with the wallet.

<br/>

## **How to Tokenizer ?**

1. Read provided links and documentation, note keyword and their meaning in this README.md
2. Lets try to code something, using this BNB Chain tutorial  
[Develop Full Stack dApp on BNB Smart Chain in 5 minutes](https://docs.bnbchain.org/docs/dapp-dev/Hello-World/) "😮 5 minutes"
   - including [Connecting MetaMask to BNB Smart Chain](https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain)
3. [Issue BEP20 Tokens](https://docs.bnbchain.org/docs/issue-BEP20/) +  [Let’s create your own BEP20 Token on Binance Smart Chain(Step-by-Step by using BEP20-Token Template)](https://misterfocusth.medium.com/lets-create-your-own-bep20-token-on-binance-smart-chain-step-by-step-by-using-bep20-token-c41eacd1a5da)  
4. [ce tuto va plus dans le code en detail](https://blog.logrocket.com/how-to-create-deploy-bep-20-token-binance-smart-chain/)
5. How deploy the token through something like a dApp ? following this **tutorial serie** should be interesting :  
   - [Building a Decentralized Application with BEP-20 contract in Solidity](https://programmingpercy.tech/blog/building-a-decentralized-application-with-bep-20-contract-in-solidity/)
   - [Creating a Inheritable Staking contract in Solidity](https://programmingpercy.tech/blog/creating-a-inheritable-staking-contract-in-solidity/)
   - [Using a Smart contract in an Web Application](https://programmingpercy.tech/blog/using-a-smart-contract-in-an-web-application/)  
     - [How to add a custom network RPC Metamask doc](https://support.metamask.io/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC)  




FIXES NOTES

GANACHE DESKTOP RPC with dockerized contract  

---

apres truffle migrate/test vers ganache desktop : "Invalid opcode in smart contract"  
to fix:  
    `pragma solidity >0.4.0 <= 0.8.19;`  
and in *truffle-config.js* :
```
 compilers: {
    solc: {
      version: "0.8.19",  
```

---

En passant pas docker le localhost 127.0.0.1 classique n'est plus utilisable
trouver l'adresse ip de la machine hote avec `ifconfig` et update le *truffle-config.js*

```
development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
     host: "192.168.122.1", // 42 host outside docker
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
```


<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
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

<br/>

## **Vocabulary memo 🇫🇷**

| English                              | French                             |
| :----------------------------------- | :--------------------------------- |
| **to issue**                         | émettre                            |
| **an asset**                         | un actif                           |
| **fungible**                         | fongible                           |
| **ownership**                        | propriété                          |
| **underlying**                       | sous-jacent                        |
| **a stake in a company**             | une part dans une entreprise       |
| **recipient**                        | destinataire                       |
| **stake**                            | un enjeu / mettre en jeu           |


---
---
---

<br/>

## **Sources**

*Sources - Maybe usefull links*  
- [Defining Blockchain & digital assets](https://www2.deloitte.com/us/en/pages/about-deloitte/solutions/blockchain-digital-assets-definition.html)  
- [Top 10 Blockchain Platforms to Elevate Your Token Creation at Ease](https://www.coinsclone.com/top-10-blockchain-platforms/)  
- [What is a Blockchain platform?](https://blogs.opentext.com/blockchain-platform/) *article from Mark Morley 02/2020*
- [What is **ChainIDE** ? And how is it any different from other IDEs?](https://paschal.hashnode.dev/what-is-chainide-and-how-is-it-any-different-from-other-ides#heading-key-features-of-chainide)  
- [Let’s create your own BEP20 Token on Binance Smart Chain(Step-by-Step by using BEP20-Token Template)](https://misterfocusth.medium.com/lets-create-your-own-bep20-token-on-binance-smart-chain-step-by-step-by-using-bep20-token-c41eacd1a5da) 

*Kept things*  
- [How To Create and Mint a Token (ERC-20 Token) in JavaScript](https://betterprogramming.pub/how-to-create-and-mint-a-crypto-coin-erc-20-token-in-javascript-ef39ecc74e27)  
- [How to Create and Deploy an ERC20 Token – In 20 minutes](https://vitto.cc/how-to-create-and-deploy-an-erc20-token-in-20-minutes/)  
- [How to create and deploy a BEP-20 token to the Binance smart chain](https://blog.logrocket.com/how-to-create-deploy-bep-20-token-binance-smart-chain/)
[A Guide to Running Ganache in a Browser](https://hackernoon.com/a-guide-to-running-ganache-in-a-browser)
- [A puzzle game set in blockChain](https://github.com/upstateinteractive/blockchain-puzzle)

*Knowledge*
- [mapping in solidity](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e)
- [Time Travelling Truffle Tests](https://medium.com/edgefund/time-travelling-truffle-tests-f581c1964687) custom time for ganache/truffle test

***Official documentations***
- [Solidity](https://docs.soliditylang.org/en/v0.8.24/)
- [BNB Chain](https://docs.bnbchain.org/docs/overview)
- [Ethereum](https://ethereum.org/fr/what-is-ethereum)

*Subject given links BNB Chain Documentation*  
- **Using ChainIDE** ~ [Using ChainIDE](https://docs.bnbchain.org/docs/chainide/)  
- **Remix** ~ [Using Remix IDE for Deploying Smart Contracts on BSC](https://docs.bnbchain.org/docs/remix-new/)  
- **Truffle** [Using Truffle for Deploying Smart Contracts on BSC](https://docs.bnbchain.org/docs/truffle-new/)  
- **Hardhat** [Using Hardhat for Deploying Smart Contracts on BSC](https://docs.bnbchain.org/docs/hardhat-new/)  
- **Replit** [Using Replit IDE for Deploying Smart Contracts on BSC](https://docs.bnbchain.org/docs/replit/)