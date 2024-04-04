import { IWeb3Context, useWeb3Context } from '@/context/Web3Context';
import {Button, HStack, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { BiLogOut } from 'react-icons/bi';
import { FaEthereum } from 'react-icons/fa';

const Header: React.FC = () => {

  const {
    connectWallet,
    disconnect,
    web3: { isAuthenticated, address, chainID, provider },
  } = useWeb3Context() as IWeb3Context;

  const NavButton: React.FC = () => {

    if (!isAuthenticated) {
      return (
      <HStack>
        <Icon as={FaEthereum}/>
        <Button
          onClick={connectWallet}
          variant="solid"
          bg="blue.400"
          colorScheme="blue"
          gap={2}
          color="white"
        >Connect Wallet</Button>
      </HStack>
      );
    } else {
      return (
        <HStack>
        <Icon as={BiLogOut} />
        <Button
          onClick={disconnect}
          variant="solid"
          bg="yellow.400"
          colorScheme="yellow"
          color="white"
          gap={2}
        >Disconnect Wallet</Button>
      </HStack>
      );
    }
  }

  return (
    <HStack width="full" as="header" height="80px" px={4} alignItems="center" bg="gray.100">
        <HStack as="nav" width="full" justifyContent="space-between" paddingLeft="20px" paddingRight="20px">
          <Text fontSize="xl" fontWeight="bold">Neopuyo42 Dapp</Text>
          <NavButton />
        </HStack>
    </HStack>
  );
};

export default Header;