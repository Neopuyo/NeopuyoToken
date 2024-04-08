import { ethers } from 'ethers';
import { loglog } from 'tools/loglog';

export enum TxStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface Tx {
  status: TxStatus;
  message: string;
}

export type TxCallback = (state: Tx) => void;

export class Neopuyo42Handler {
  private _neoContract: ethers.Contract;

  constructor(contract: ethers.Contract) {
    this._neoContract = contract;
  }

  get neoContract(): ethers.Contract { return this._neoContract; }

  public async stakeNeopuyo42(amount: number, updateTransaction: TxCallback, updateUI: () => Promise<void>) {
    let tx: Tx = {
      status : TxStatus.IDLE,
      message: "",
    }

    try {
      const amountParsed = ethers.parseEther(amount.toString());
      tx = this._txPending(tx, `Staking ${amount} Neo asked, valid transaction in Metamask to continue`);
      updateTransaction({...tx, status:tx.status, message:tx.message});
      loglog("[Stake debug]", tx.message); // [!] debug

      const transaction = await this._neoContract.stake(amountParsed);
      
      tx = this._txPending(tx, `Staking ${amount} Neo, transaction validated, waiting for blockchain confirmation...`)
      updateTransaction({...tx, status:tx.status, message:tx.message});
      loglog("[Stake debug]", tx.message); // [!] debug


      const receipt = await transaction.wait();
      loglog("Stake transaction Done receipt : ", receipt); // [!] debug

      tx = this._txSuccess(tx, `Staking ${amount} Neo, transaction confirmed, your wallet should be updated soon`)
      updateTransaction({...tx, status:tx.status, message:tx.message});
      loglog("[Stake debug]", tx.message); // [!] debug

      await updateUI();
      tx = this._txIdle(tx, "Ready for next transaction");
      updateTransaction({...tx, status:tx.status, message:tx.message});
      loglog("[Stake debug]", tx.message); // [!] debug

    } catch (error) {
      loglog("stakeNeopuyo42 Error : ", (error as Error).message); // [!] debug
      tx = this._txError(tx,`stakeNeopuyo42 Error: ${(error as Error).message}`);
      updateTransaction({...tx, status:tx.status, message:tx.message});
      loglog("[Stake debug]", tx.message); // [!] debug
    }
  }

  public async withdrawStake(amount: number, index: number, updateTransaction: TxCallback, updateUI: () => Promise<void>) {
    let tx: Tx = {
      status : TxStatus.IDLE,
      message: "",
    }

    try {

      const amountParsed = ethers.parseEther(amount.toString());
      tx = this._txPending(tx, `Withdrawing ${amount} Neo from stake_${index + 1} asked, valid transaction in Metamask to continue`);
      updateTransaction({...tx, status:tx.status, message:tx.message});
      loglog("[Withdraw debug]", tx.message); // [!] debug

      const transaction = await this._neoContract.withdrawStake(amountParsed, index);

      tx = this._txPending(tx, `Withdrawing ${amount} Neo from stake_${index + 1}, transaction validated, waiting for blockchain confirmation...`)
      updateTransaction({...tx, status:tx.status, message:tx.message});
      loglog("[Withdraw debug]", tx.message); // [!] debug]

      const receipt = await transaction.wait();
      loglog("Withdraw transaction Done receipt : ", receipt); // [!] debug

      tx = this._txSuccess(tx, `Withdrawing ${amount} Neo from stake_${index + 1}, your wallet should be updated soon`)
      updateTransaction({...tx, status:tx.status, message:tx.message});
      loglog("[Withdraw debug]", tx.message); // [!] debug

      await updateUI();
      tx = this._txIdle(tx, "Ready for next transaction");
      updateTransaction({...tx, status:tx.status, message:tx.message});
      loglog("[Withdraw debug]", tx.message); // [!] debug


    } catch (error) {
      loglog("withdrawStake Error : ", (error as Error).message); // [!] debug
      tx = this._txError(tx,`withdrawStake Error: ${(error as Error).message}`);
      updateTransaction({...tx, status:tx.status, message:tx.message});
      loglog("[Withdraw debug]", tx.message); // [!] debug
    }


  }


  private _txPending(tx: Tx, message?: string) {
    tx.status = TxStatus.PENDING;
    tx.message = message ? message : "Transaction in progress...";
    return tx;
  }

  private _txSuccess(tx: Tx, message?: string) {
    tx.status = TxStatus.SUCCESS
    tx.message = message ? message : "Transaction success."
    return tx;
  }

  private _txError(tx: Tx, message?: string) {
    tx.status = TxStatus.ERROR
    tx.message = message ? message : "Transaction error."
    return tx;
  }

  private _txIdle(tx: Tx, message?: string) {
    tx.status = TxStatus.IDLE
    tx.message = message ? message : "No transaction in progress";
    return tx;
  }
}