# Deploy neopuyo42Token step by step guide

1. install and setup metamask on your browser (i. e. Chrome) following this [official guide](https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain)
2. open [Remix](https://remix.ethereum.org/) IDE on browser
3. make sure metamask is connected to remix, checking the 🌐 icon
3. create a .sol file and bring into this [BEP20 template code](https://github.com/bnb-chain/bsc-genesis-contract/blob/master/contracts/bep20_template/BEP20Token.template)
4. configure the fields 

```
_name _symbol _decimals _totalSupply
```

5. go to compile tab and compile the token
6. go to deploy tab and deploy the token
7. check the transaction on [testnet.bscscan.com](https://testnet.bscscan.com/)
8. import the Neopuyo42Token into your wallet