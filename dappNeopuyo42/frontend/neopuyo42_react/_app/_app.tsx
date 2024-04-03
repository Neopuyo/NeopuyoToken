import { ChakraProvider } from "@chakra-ui/react";
import Web3ContextProvider from "../app/context/Web3Context";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {

  console.log("PROVIDER ACTIVATED !!");

  return (
    <ChakraProvider>
      <Web3ContextProvider>
        <Component {...pageProps} />
      </Web3ContextProvider>
    </ChakraProvider>
    );
}