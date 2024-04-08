import { Badge, Box, Card, CardBody, CardHeader, HStack, Heading, Spacer, Stack, StackDivider, Text, VStack,  } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { NeoColors } from "tools/types/NeoColors";
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

    const dateText = () => {
      if (diffDays > 0) {
        return `from ${diffDays} days`;
      } else {
        return `from ${diffHoursRemaining} hours`;
      }
    }

    return (
        <Card borderWidth="1px" borderRadius="lg" borderColor={NeoColors.grayLight} width={"100%"} padding={0} marginBottom={8}>

          <CardHeader  bg={NeoColors.grayLight} color={NeoColors.white} borderTopRadius={"lg"} borderBottomRadius={0} p={2}>
            <HStack color={NeoColors.gray}>
              <Heading size='md'>Stake</Heading>
              <Spacer />
              <Text size='md' fontWeight={"bold"} color={NeoColors.teal}>{amountF}</Text>
              <Text size='md' fontWeight={"bold"} color={NeoColors.teal}>Neo</Text>
            </HStack>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
              <Box>
                <HStack>
                    <Text fontSize="xs" color={NeoColors.teal}>{claimableF} Neo</Text>
                    <Text fontSize="xs" color={NeoColors.gray}>{dateText()}</Text>
                </HStack>
              </Box>

              <Box>
                
              </Box>
            </Stack>
          </CardBody>

        </Card>
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
