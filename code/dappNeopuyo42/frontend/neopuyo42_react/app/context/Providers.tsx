"use client";

import { ChakraProvider } from "@chakra-ui/react";
import Web3ContextProvider from "./Web3Context";

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <ChakraProvider>
      <Web3ContextProvider>
        {children}
      </Web3ContextProvider>
    </ChakraProvider>
  );
}