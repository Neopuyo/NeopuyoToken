import { createContext, FC, ReactNode, useContext } from "react";
import { useWeb3Provider, IWeb3Props} from "@/hooks/useWeb3Provider";
import { ToastId } from "@chakra-ui/react";

export interface IWeb3Context {
  connectWallet: () => Promise<ToastId | undefined>;
  disconnect: () => void;
  web3: IWeb3Props;
}

const Web3Context = createContext<IWeb3Context | null>(null);

type Props = {
  children: ReactNode;
};

const Web3ContextProvider: FC<Props> = ({ children }) => {
  const { connectWallet, disconnect, web3 } = useWeb3Provider();

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        disconnect,
        web3,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3ContextProvider;

export const useWeb3Context = () => useContext(Web3Context);