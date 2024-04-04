import { Contract } from "ethers";
import { useMemo } from "react";
import { IWeb3Context, useWeb3Context } from "../context/Web3Context";
import { getNeopuyo42ContractABI, getNeopuyo42ContractAddress} from "tools/getNeopuyo42ContractDatas";

const address = getNeopuyo42ContractAddress();

const useNeopuyo42Contract = async () => {
  const { web3 } = useWeb3Context() as IWeb3Context;

  const abi = await getNeopuyo42ContractABI();

  return useMemo(
    () => web3.signer && new Contract(address, abi, web3.signer),
    [web3.signer, abi]
  );
};

export default useNeopuyo42Contract;