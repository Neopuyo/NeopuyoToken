# Deploy neopuyo42Token

[< Table of contents](../tokenizerDocumentation.md)  
[< ReadMe](../README.md)  

## step by step guide

1. install and setup metamask on your browser (i. e. Chrome) following this [official guide](https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain)

2. The token is already deployed on [testnet.bscscan.com](https://testnet.bscscan.com/)  
You can get all informations needed to retreive in the [deployment sheet in teh ReadMe](../README.md#deployment-sheet)

3. Launch the **dapp** and **Hardhat** in two containers.  
In the console go to *./code/dappNeopuyo42* folder and run: `make`  
You can check if the whales are correctly built with: `make logs`

4. Use bash inside the **Hardhat** container with: `make exec`  

5. Hardhat will need a `./secrets.json` file, containing sensitive data

```json
{
  "mnemonic": "the 12-24 word metamask password phrase",
  "bscscanApiKey": "the API key from Binance Smart Chain"
}
```

6. Theses following commands are used to compile and test the solidity written smart contracts.

```bash
npx hardhat clean
npx hardhat compile
npx hardhat test
```
> All the tests are written in the `./code/dappNeopuyo42/project/test` folder

7. It is possible to deploy another time the Neopuyo42 token on [testnet.bscscan.com](https://testnet.bscscan.com/)  
You will need some tBNB on you Bsc account.  
To deploy use this command :

```bash
npx hardhat run --network testnet scripts/deploy.ts
```

> [ `!` ]  Deploying will depend on Bsc network status, i encountered troubles.  
Some day the result is pretty fast, some time the console is waiting infinitely...  
Or the deployment can be done later, don't spam it like i did 🤓.

8. If all worked correctly you can retreive the `contract address`, in the console or on the Bsc website.
To verify the contract, meaning that the source code will be available on the testnet the command is :

```bash
npx hardhat verify --network testnet --constructor-args scripts/arguments.ts CONTRACT_ADDRESS
```

9. To work with the new contract, the frontend container will need these updated **ABI** and **contract address**.  
I think the abi will remain the same if nothing is changed in the contract source code.
Contract address has to be updated in : frontend/neopuyo42_react/app/tools/getNeopuyo42ContractData.ts  
The ABI is located at frontend/neopuyo42_react/app/public/abi/Neopuyo42.json  
(it straightly came from the files compiled with hardhat)  

10. Check this [overview](../README.md#project-overview) part as a demonstration of how use the dapp