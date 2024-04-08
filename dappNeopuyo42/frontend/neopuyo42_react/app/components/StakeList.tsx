import { Box, Text,  } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { Stake } from "tools/types/StakingSummary";

type Props = {
  stakes: Stake[];
};

export default function StakeList({ stakes }: Props) {


  const StakeItem = ({ stake }: { stake: Stake }) => {

    if (!isValidUser(stake.user)) {
      return null;
    }

    const amountF= ethers.formatEther(stake.amount);
    const claimableF= ethers.formatEther(stake.claimable);
    
    // [N] In Blocks the timestamp is in second, inside a BigNumber
    // Date object need milliseconds
    const timetampString = stake.since.toString();
    const timestampNumber = parseInt(timetampString) * 1000;
    const now = new Date().getTime();
    const diffMs = now - timestampNumber;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const diffHoursRemaining = diffHours % 24;

    return (
      <Box borderWidth="1px" borderRadius="lg" p={4}>
        <Text>User: {stake.user}</Text>
        <Text>Amount: {amountF}</Text>
        <Text>Since: {diffHours} hours</Text>
        <Text>Claimable: {claimableF}</Text>
      </Box>
    );
  };

  const isValidUser = (user: string) => {
    return user !== "" && user !== "0x0000000000000000000000000000000000000000";
  };


  return (
    <div>
      {stakes.map((stake, index) => (
        <StakeItem key={index} stake={stake} />
      ))}
    </div>
  );
}
