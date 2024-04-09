import { Box, Card, CardBody, CardHeader, HStack, Heading, Spacer, Stack, StackDivider, Text, VStack,  } from "@chakra-ui/react";
import { ethers } from "ethers";
import { NeoColors } from "tools/types/NeoColors";
import { Stake } from "tools/types/StakingSummary";
import WithdrawInput from "./WithDrawInput";
import { Tx } from "@/handler/neopuyo42Handler";

type Props = {
  stakes: Stake[];
  setTx: (tx: Tx) => void;
  withdrawStake: (amount: number, index: number) => Promise<void>;
};

export default function StakeList({ stakes, setTx, withdrawStake }: Props) {


  const StakeItem = ({ stake, index }: { stake: Stake, index: number }) => {

    if (!isValidUser(stake.user)) {
      return null;
    }
    const stakeNum = (index + 1).toString();
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
      if (diffDays > 1) {
        return `from ${diffDays} days ago`;
      } else {
        return `from ${diffHoursRemaining} hours ago`;
      }
    }

    return (
        <Card borderWidth="1px" borderRadius="lg" borderColor={NeoColors.grayLight} width={"100%"} padding={0} marginBottom={8}>

          <CardHeader  bg={NeoColors.grayLight} color={NeoColors.white} borderTopRadius={"lg"} borderBottomRadius={0} p={2}>
            <HStack color={NeoColors.gray}>
              <Heading size='md'>Stake</Heading>
              <Text size='md'>{stakeNum}</Text>
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
                <WithdrawInput stakeAmount={amountF} index={index} setTx={setTx} withdrawStake={withdrawStake}/>
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
        <StakeItem key={index} stake={stake} index={index} />
      ))}
    </div>
  );
}
