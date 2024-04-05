import { Contract } from "ethers";
import { useMemo } from "react";
import { IWeb3Context, useWeb3Context } from "../context/Web3Context";
import { getNeopuyo42ContractABI, getNeopuyo42ContractAddress} from "tools/getNeopuyo42ContractDatas";

const address = getNeopuyo42ContractAddress();

// [N] : a React Custom hook 
// Remember hooks should not be async functions
const useNeopuyo42Contract = () => {
  const { web3 } = useWeb3Context() as IWeb3Context;

  
  return useMemo(
    async () => {
      console.log("useNeopuyo42Contract useMemo hook called"); // [!] debug, check ig memo used is ok
      const promise = getNeopuyo42ContractABI();
      const abi = await promise;
      if (!web3.signer) return null;
      const contract = new Contract(address, abi, web3.signer);
      return contract;
    },[web3.signer]
  );
};

export default useNeopuyo42Contract;