import { useToast } from "@chakra-ui/react";
import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";


export interface IWeb3Props {
  address: string | null;
  chainID: number | null;
  accounts: string[];
  signer: JsonRpcSigner | null;
  provider: BrowserProvider | null;
  isAuthenticated: boolean;
}

export const useWeb3Provider = () => {

  const BSC_CHAIN_ID = '97';

  const initialWeb3Props = {
    address: null,
    chainID: null,
    accounts: [],
    signer: null,
    provider: null,
    isAuthenticated: false,
  }

  const toast = useToast();
  const [web3, setWeb3] = useState<IWeb3Props>(initialWeb3Props);

  const connectWallet = useCallback(async () => {
    if (web3.isAuthenticated) return;

    try {
      if (!window.ethereum) {
        return toast({
          status: "error",
          position: "top-right",
          title: "Error",
          description: "No ethereum wallet found",
        });
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts: string[] = await provider.send("eth_requestAccounts", []);

      // [N] may ask switching to Bsc testnet
      await _checkNetwork();

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const chain = Number((await provider.getNetwork()).chainId);

        console.log("[into connectWallet] accounts = ", accounts); // [!] Debug

        setWeb3({
          ...web3,
          address: accounts[0],
          signer,
          chainID: chain,
          accounts: accounts,
          provider,
          isAuthenticated: true,
        });

        localStorage.setItem("isAuthenticated", "true");
        console.log("connectWallet : User connected to metamask with :", accounts[0]);
      }
    } catch(error) {
      console.log("connectWallet : ", (error as Error).message);
      return toast({
        status: "error",
        position: "bottom-right",
        title: "Error",
        description: (error as Error).message,
      });
    }
  }, [web3, toast]);

  const disconnect = () => {
    console.log(`User ${web3.address} Disconnected from metamask`);
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
      if (accounts.length === 0) {
        disconnect();
      } else {
        setWeb3({ ...web3, address: accounts[0], accounts: accounts});
      }
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


  async function _checkNetwork() {
    if (window.ethereum.networkVersion !== BSC_CHAIN_ID) {
      _switchChain();
    }
  }

  async function _switchChain() {
    const chainIdHex = `0x${parseInt(BSC_CHAIN_ID).toString(16)}`;
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  }

}