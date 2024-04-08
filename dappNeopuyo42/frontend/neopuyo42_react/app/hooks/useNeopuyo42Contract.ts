import { Contract } from "ethers";
import { useMemo } from "react";
import { IWeb3Context, useWeb3Context } from "../context/Web3Context";
import { getNeopuyo42ContractABI, getNeopuyo42ContractAddress} from "tools/getNeopuyo42ContractDatas";
import { Neopuyo42Handler } from "@/handler/neopuyo42Handler";
import { loglog } from "tools/loglog";

// [N] : a React Custom hook 
// Remember hooks should not be async functions (the async part here should be in useMemo part)
const useNeopuyo42Contract = () => {
  const { web3 } = useWeb3Context() as IWeb3Context;

  return useMemo(
    async () => {
      try {
        const promise = getNeopuyo42ContractABI();
        const address = getNeopuyo42ContractAddress();
        const abi = await promise;
        if (!web3.signer) return null;
        const contract = new Contract(address, abi, web3.signer);
        const neopuyo42Handler = new Neopuyo42Handler(contract);
        return neopuyo42Handler;
      } catch (error) {
        loglog("useNeopuyo42Contract error: ", (error as Error).message);
        return null;
      }
    },[web3.signer]
  );
};

export default useNeopuyo42Contract;