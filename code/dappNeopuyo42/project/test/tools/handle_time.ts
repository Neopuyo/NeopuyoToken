import { ethers } from "hardhat";

/*
  JSON-RPC requests from ethers
  used to interact with Ethereum
*/

async function advanceTime(time: number) {
  // increases the current block time by the `time` value
  await ethers.provider.send("evm_increaseTime", [time]);
}

async function advanceBlock() {
  // mines a new block, which finalizes the time changes
  await ethers.provider.send("evm_mine", []);
}

async function advanceTimeAndBlock(time: number) {
  await advanceTime(time);
  await advanceBlock();
  const block = await ethers.provider.getBlock("latest");
  return block;
}

export { advanceTimeAndBlock };