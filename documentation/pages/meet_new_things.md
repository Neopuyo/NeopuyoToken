# **Web3 concepts - Meet New things 📚**

[< Table of contents](../tokenizerDocumentation.md)

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

🔻 **[Contract ABI Specification](https://docs.soliditylang.org/en/v0.8.25/abi-spec.html)**  

The Contract `A`pplication `B`inary `I`nterface is the standard way to interact with contracts in the Ethereum ecosystem, both from outside the blockchain and for contract-to-contract interaction. Data is encoded according to its type, as described in this specification.

> This ABI is a JSON file generated when `truffle compile` or `npx hardhat compile` in `build` folder.

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

> Here [BEP20 token smart contract template](https://github.com/bnb-chain/bsc-genesis-contract/blob/master/contracts/bep20_template/BEP20Token.template) from [BNB Chain Documentation](https://docs.bnbchain.org/docs/truffle-new/)

<br/>

🔻 **[Metamask](https://support.metamask.io/hc/en-us/articles/360015489531-Getting-started-with-MetaMask)**

**MetaMask** is a web browser extension and mobile app that allows you to manage your Ethereum private keys. By doing so, it serves as a **wallet** for Ether and other tokens, and allows you to interact with **decentralized applications**, or **dapps**.

**[RPC](https://support.metamask.io/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC)**  
`R`emote `P`rocedure `C`all, a set of protocols that allow a client (such as MetaMask) to interact with a blockchain.  
[Public RPC Nodes of Bsc](https://docs.bnbchain.org/docs/BSCtestnet/)

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

[< Table of contents](../tokenizerDocumentation.md)
