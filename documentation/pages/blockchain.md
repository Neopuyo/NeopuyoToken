# **Blockchain**

[< Table of contents](../tokenizerDocumentation.md)

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

## BlockChain related pluggins, frameworks and tools

**🔻 `ChainIDE`**| IDE
--- | ---
**Cloud-based** | Not installed on developper's machine, used from a browser
**Multi-Chain** | Can work with different blockchains. *Ethereum, BNB Chain, ...*

<br/>

**🔻 `Remix`**| IDE
--- | ---
**Cloud-based** | Not installed on developper's machine, used from a browser
**single chain** | Ethereum / compatible BNB Chain

<br/>

**🔻 `Truffle`**| Framework
--- | ---
**npm** | Need a node environment
**Ethereum** | Ethereum development environment
**What's for ?** | building/testing/developing smart contracts
**Basics** | `truffle init` &emsp; `truffle compile` <br/> `truffle console` &emsp; `truffle test` &emsp; <br/>  `truffle migrate --reset --network bscTestnet`

**🔻 `Ganache`**| Framework linked to **Truffle**
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

**🔻 `Replit`**| IDE
--- | ---
**Cloud-based** | Not installed on developper's machine, used from a browser
**Coding plateform** |  supports **Solidity** programming language and Web3 things 

<br/>

**🔻 `HardHat` ✅**| Framework
--- | ---
**npm** | Need a node environment
**Ethereum** | Ethereum development environment
**Fresh updated Doc** | last updated march 2024
**Basics** | `npx hardhat clean` &emsp; `npx hardhat compile`  <br/> `npx hardhat test` &emsp; `npx hardhat run --network testnet scripts/deploy.ts`  <br/> `npx hardhat verify --network testnet 0xDEPLOYED_CONTRACT_ADDRESS` <br/> `npx hardhat node` &emsp; `npx hardhat ignition deploy ./ignition/modules/Lock.ts`

> Note : **Truffle** and **Ganache** will not be supported anymore, their teams are migrating to **Hardhat**  
[Consensys Announces the Sunset of Truffle and Ganache and New Hardhat Partnership](https://consensys.io/blog/consensys-announces-the-sunset-of-truffle-and-ganache-and-new-hardhat) *september 2023*

#### **HARDHAT local Deployement**  

---

\- 🔳 **A** > `npx hardhat node`  
&emsp; *launch hardhat local network*  
\- 🔳 **B** > `npx hardhat run --network localhost scripts/deploy.js`  
&emsp; *will see logs on other console A*  
&emsp; *check contract with npx hardhat [clean/compile/test] sequence before*  
\- **Frontend** -> `provider = new ethers.JsonRpcProvider('http://localhost:8545');`  
&emsp; *Don't forget open port 8545 in Docker*  
&emsp; *go check http://localhost:8545 will see : Parse error: Unexpected end of JSON input*  


## 🔻 **Metamask** *Web browser extension & mobile app*

Access decentralized applications *`DApps`* on the **Ethereum** blockchain on browser (*Chrome often*).Users can manage their Ethereum accounts, send and receive Ether, as well as interact with **smart contracts** and **Dapps** directly from their browser. An easy access to the Ethereum ecosystem.  

- using a **secrete recovery phrase** to login aka **seed phrase** (12-24 words)
- Can connect to blockchains **networks**, started **Ethereum**, added then switched to **BNB chain**
- **BNB Smart Chain Testnet network**.  
Play around with fake money and get familiar with the wallet.

<br/>

[< Table of contents](../tokenizerDocumentation.md)