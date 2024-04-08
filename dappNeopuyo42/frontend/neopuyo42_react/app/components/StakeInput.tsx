import { Tx, TxStatus } from "@/handler/neopuyo42Handler";
import { Button, HStack,  Text, FormControl, FormLabel, 
         IconButton, NumberInputField, NumberInput, 
         NumberIncrementStepper, NumberInputStepper, 
         NumberDecrementStepper } from "@chakra-ui/react";
import { useState } from "react";
import { RiDeleteBack2Line } from "react-icons/ri";
import { NeoColors } from "tools/types/NeoColors";

type Props = {
  stakeNeopuyo42: (stakeAmount: number) => Promise<void>;
  setTx: (tx: Tx) => void;
  userBalance: string;
};

export default function StakeInput({ stakeNeopuyo42, setTx, userBalance }: Props) {

  const [stakeAmount, setStakeAmount] = useState(0);
  const STAKE_MAX = 10000;

  const _handleStakeSubmit = () => {
    if (_isStakeAmountInvalid) {
      setTx({status: TxStatus.ERROR, message: "Please set a correct value for staking"});
      return; 
    }
    if (stakeAmount > Number(userBalance)) {
      setTx({status: TxStatus.ERROR, message: `You can't stake more than ${userBalance}`});
      return; 
    }
    stakeNeopuyo42(stakeAmount);
  };

  const _isStakeAmountInvalid = (stakeAmount <= 0 || isNaN(stakeAmount));

  const _clearInput = () => {
    setStakeAmount(0);
  }

  const _handleStakeAmountChange = (valueAsString: string) => {
    try {
      const value = Number(valueAsString);
      if (isNaN(value)) {
        setStakeAmount(0);
        return;
      }
      if (value < 0) {
        setStakeAmount(0);
        return;
      }
      if (value > STAKE_MAX) {
        setStakeAmount(STAKE_MAX);
        return;
      }
      setStakeAmount(value);
    } catch (error) {
      setTx({status: TxStatus.ERROR, message: "Please enter a correct stake value"});
    }
  };

  return (
    <FormControl onSubmit={() => _handleStakeSubmit} >
      <FormLabel>
      <Text fontSize="xs" color={NeoColors.gray}>Stake some Neopuyo42 token</Text></FormLabel>
      <HStack alignItems="top">
        <FormControl>
          <NumberInput max={STAKE_MAX} min={0}
            onChange={(valueAsString) => _handleStakeAmountChange(valueAsString)} value={stakeAmount !== 0 ? stakeAmount : ""}
            >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <IconButton icon={<RiDeleteBack2Line size={24} style={{ color: 'gray' }}/>} onClick={_clearInput} aria-label={""} />
        <Button onClick={_handleStakeSubmit} variant="solid" bg={_isStakeAmountInvalid ? NeoColors.gray : NeoColors.yellow } color={NeoColors.white} gap={2}  >
          <Text fontSize="xl" fontWeight="bold" paddingTop="4px">Stake</Text>
        </Button>
      </HStack>
    </FormControl>
  );

}