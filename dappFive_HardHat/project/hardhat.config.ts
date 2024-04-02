import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import {mnemonic, bscscanApiKey} from './secrets.json';

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    // default local network
    // local: {
    //   // url: "http://127.0.0.1:8545", // local but not this way when using dockers
    //   // url: "http://10.249.1.201:8545", // Nuc Home
    //   url: "http://192.168.122.1:8545", // 42 z1r11p5
    // },
    hardhat: {
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: {mnemonic: mnemonic}
    },
  },
  etherscan: {
    apiKey: bscscanApiKey
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify.dev/server",
    browserUrl: "https://repo.sourcify.dev",
  }
};
export default config;