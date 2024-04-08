import { Tx, TxStatus } from "@/handler/neopuyo42Handler";
import { Button, HStack,  Text, FormControl, FormLabel, 
         IconButton, NumberInputField, NumberInput, 
         NumberIncrementStepper, NumberInputStepper, 
         NumberDecrementStepper, 
         VStack,
         Spacer,
         Box} from "@chakra-ui/react";
import { useState } from "react";
import { RiDeleteBack2Line } from "react-icons/ri";
import { NeoColors } from "tools/types/NeoColors";

type Props = {
  stakeAmount: string;
  setTx: (tx: Tx) => void;
  withdrawStake: (amount: number, index: number) => Promise<void>;
  index: number;
};

export default function WithdrawInput({ stakeAmount, setTx, withdrawStake, index, }: Props) {

  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const stakeNum = (index + 1).toString(); 

  const _isWithdrawAmountInvalid = (withdrawAmount <= 0 || isNaN(withdrawAmount));

  const _clearInput = () => {
    setWithdrawAmount(0);
  }

  const _handleSubmit = () => {
    if (_isWithdrawAmountInvalid) {
      setTx({status: TxStatus.ERROR, message: "Please set a correct value for staking"});
      return; 
    }
    if (withdrawAmount > Number(stakeAmount)) {
      setTx({status: TxStatus.ERROR, message: `You can't withdraw more than ${stakeAmount} in stake${index}`});
      return; 
    }
    loglog(`Withdraw of ${withdrawAmount} from stake${index} asked`);
    withdrawStake(withdrawAmount, index);
  };

  const _handleChange = (valueAsString: string) => {
    try {
      const value = Number(valueAsString);
      const max = Number(stakeAmount);
      if (isNaN(value)) {
        setWithdrawAmount(0);
        return;
      }
      if (value < 0) {
        setWithdrawAmount(0);
        return;
      }
      if (value > max) {
        setWithdrawAmount(max);
        return;
      }
      setWithdrawAmount(value);
    } catch (error) {
      setTx({status: TxStatus.ERROR, message: "Please enter a correct withdraw value"});
    }
  };

  return (
    <FormControl>
      <FormLabel>
        <Text fontSize="xs" color={NeoColors.gray}>Withraw from stake {stakeNum}</Text>
      </FormLabel>
      <HStack alignItems="top">
        <FormControl>
          <NumberInput max={Number(stakeAmount)} min={0}
            onChange={(valueAsString) => _handleChange(valueAsString)} value={withdrawAmount !== 0 ? withdrawAmount : ""}
            >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <IconButton icon={<RiDeleteBack2Line size={24} style={{ color: 'gray' }}/>} onClick={_clearInput} aria-label={""} />
        <Button onClick={_handleSubmit} variant="solid" paddingLeft={4} paddingRight={4}
          bg={_isWithdrawAmountInvalid ? NeoColors.gray : NeoColors.blue } color={NeoColors.white} gap={2}  >
          <Text fontSize="xl" fontWeight="bold" paddingTop="4px">Withdraw</Text>
        </Button>
      </HStack>
    </FormControl>
  );

}