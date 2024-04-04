import { useToast } from "@chakra-ui/react";
import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";


export interface IWeb3Props {
  address: string | null;
  chainID: number | null;
  signer: JsonRpcSigner | null;
  provider: BrowserProvider | null;
  isAuthenticated: boolean;
}

export const useWeb3Provider = () => {
  const initialWeb3Props = {
    address: null,
    chainID: null,
    signer: null,
    provider: null,
    isAuthenticated: false,
  }

  const toast = useToast();
  const [web3, setWeb3] = useState<IWeb3Props>(initialWeb3Props);

  const connectWallet = useCallback(async () => {
    if (web3.isAuthenticated) return;

    try {
      const { ethereum } = window;

      if (!ethereum) {
        return toast({
          status: "error",
          position: "top-right",
          title: "Error",
          description: "No ethereum wallet found",
        });
      }
      const provider = new ethers.BrowserProvider(ethereum);
      const accounts: string[] = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const chain = Number(await (await provider.getNetwork()).chainId);

        setWeb3({
          ...web3,
          address: accounts[0],
          signer,
          chainID: chain,
          provider,
          isAuthenticated: true,
        });

        localStorage.setItem("isAuthenticated", "true");
      }
    } catch(error) {
      console.log("connectWallet : ", (error as Error).message);
      return toast({
        status: "error",
        position: "top-right",
        title: "Error",
        description: (error as Error).message,
      });
    }
  }, [web3, toast]);

  const disconnect = () => {
    setWeb3(initialWeb3Props);
    localStorage.removeItem("isAuthenticated");
  };

  useEffect(() => {
    if (window.ethereum == null || typeof window.ethereum === "undefined") return;

    if (localStorage.hasOwnProperty("isAuthenticated")) {
      connectWallet();
    }

  }, [connectWallet]);

  useEffect(() => {
    if (window.ethereum == null || typeof window.ethereum === "undefined") return;

    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      console.log("[Event] accountsChanged => accounts = ", accounts); // [!] Debug
      setWeb3({ ...web3, address: accounts[0] });
    });
    
    // [N] MetaMask warning: The event 'networkChanged' is deprecated and may be removed in the future.
    // Use 'chainChanged' instead.
    // For more information, see: https://eips.ethereum.org/EIPS/eip-1193#chainchanged
    window.ethereum.on("chainChanged", (network: string) => {
      console.log("[Event] chainChanged => chainId :", Number(network)); // [!] Debug
      setWeb3({ ...web3, chainID: Number(network) });
    });

    return () => {
      window.ethereum.removeAllListeners();
    };
  }, [web3]);

  return {
    connectWallet,
    disconnect,
    web3,
  };

}