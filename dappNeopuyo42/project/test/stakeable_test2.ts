import { expect } from "chai";
import { ethers } from "hardhat";
import { advanceTimeAndBlock } from "./tools/handle_time";

describe("Stakeable_2", () => {
  let neopuyo42: any;
  let deployer: any;
  let addr1: any;
  let addr2: any;
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const stakeAmount = ethers.parseEther("400");

  beforeEach(async function () {
    const Neopuyo42 = await ethers.getContractFactory("Neopuyo42");
    neopuyo42 = await Neopuyo42.deploy("Neopuyo42", "NEO", 18,  5000000000);
    await neopuyo42.waitForDeployment();

    [deployer, addr1, addr2] = await ethers.getSigners();

    // mint 5000 token to addr1
    await neopuyo42.mint(addr1, ethers.parseEther("5000"));
    
    // stack 400 (twice) on deployer
    const stakeFuncID = await neopuyo42.stake(stakeAmount);
    await expect(stakeFuncID)
      .to.emit(neopuyo42, "Staked")
      .withArgs(deployer, stakeAmount, 1, (await ethers.provider.getBlock("latest"))?.timestamp);

    const stakeFuncID2 = await neopuyo42.stake(stakeAmount);
    await expect(stakeFuncID2)
      .to.emit(neopuyo42, "Staked")
      .withArgs(deployer, stakeAmount, 1, (await ethers.provider.getBlock("latest"))?.timestamp);
  });

  it("check the setup (1/2)", async function () {
    const initialBalanceRaw = await neopuyo42.balanceOf(addr1);
    const initialBalance = parseInt(ethers.formatEther(initialBalanceRaw));
    expect(initialBalance).to.equal(5000, "The balance after minting should be 5000");
    const balanceDeployerRaw = await neopuyo42.balanceOf(deployer);
    const balanceDeployer = parseInt(ethers.formatEther(balanceDeployerRaw));
    expect(balanceDeployer).to.equal(5000000000 - 800, "Owner should have his 5 billion initial - 2 x 400");
  });

  it("check the setup (2/2)", async function () {
    const summary = await neopuyo42.hasStake(deployer);
    const totalStake = parseInt(ethers.formatEther(summary.total_amount));
    expect(totalStake).to.equal(800, "The total staking should be 800");
    
    const stake1 = summary.stakes[0];
    const stake1Amount = parseInt(ethers.formatEther(stake1.amount));
    expect(stake1Amount).to.equal(400, "The first staking should be 400");

    const stake2 = summary.stakes[1];
    const stake2Amount = parseInt(ethers.formatEther(stake2.amount));
    expect(stake2Amount).to.equal(400, "The second staking should be 400");
  });

  it("new stakeholder should increased index (2/2)", async () => {
    // stake index 1 is taken by deployer, next index should be for next staker
    const stakeFuncID = await neopuyo42.connect(addr1).stake(stakeAmount);
    await expect(stakeFuncID)
      .to.emit(neopuyo42, "Staked")
      .withArgs(addr1, stakeAmount, 2, (await ethers.provider.getBlock("latest"))?.timestamp);
  });

  it("cannot stake a 0 amount", async () => {
    // addr2 has balance of 5000
    await expect(neopuyo42.connect(addr1).stake(ethers.parseEther("0")))
      .to.be.revertedWith("Staking: Cannot stake a 0 amount");
  });

  it("cannot stake more than you own (1/2)", async () => {
    // addr2 has balance of 5000
    await expect(neopuyo42.connect(addr1).stake(ethers.parseEther("5001")))
      .to.be.revertedWith("Neopuyo42: Cannot stake more than you own");
  });

  it("cannot stake more than you own (2/2)", async () => {
    // addr2 has empty balance
    await expect(neopuyo42.connect(addr2).stake(stakeAmount))
      .to.be.revertedWith("Neopuyo42: Cannot stake more than you own");
  });

  it("withdraw twice time in the two stakes", async () => {
    // deployer has staked 800 total tokens (400 for both index 0 and 1)
    await expect(neopuyo42.withdrawStake(ethers.parseEther("200"), 0))
      .to.not.be.reverted;

    await expect(neopuyo42.withdrawStake(ethers.parseEther("200"), 1))
      .to.not.be.reverted;

    const stakes = await neopuyo42.hasStake(deployer);
    const totalStake = parseInt(ethers.formatEther(stakes[0]));
    expect(totalStake).to.equal(400, "The total staking should be 400 after withdrawing 200 x 2");

    await expect(neopuyo42.withdrawStake(ethers.parseEther("200"), 0))
      .to.not.be.reverted;

    await expect(neopuyo42.withdrawStake(ethers.parseEther("200"), 1))
      .to.not.be.reverted;

    const stakesF = await neopuyo42.hasStake(deployer);
    const totalStakeF = parseInt(ethers.formatEther(stakesF[0]));
    expect(totalStakeF).to.equal(0, "The total staking should be 0 after withdrawing 200 x 2 + 200 x 2");
  });

  it("can't withdraw more than stake has", async () => {
    await expect(neopuyo42.withdrawStake(ethers.parseEther("400"), 0))
      .to.not.be.reverted;
    
    await expect(neopuyo42.withdrawStake(ethers.parseEther("1"), 0))
      .to.be.revertedWith("Staking: Cannot withdraw more than you have staked");
  });

  it("can only withdraw in indexed stakes", async () => {
    await expect(neopuyo42.withdrawStake(ethers.parseEther("1"), 0))
      .to.not.be.reverted;
    
    await expect(neopuyo42.withdrawStake(ethers.parseEther("1"), 1))
      .to.not.be.reverted;

    await expect(neopuyo42.withdrawStake(ethers.parseEther("1"), 2))
      .to.be.reverted;
  });

  it("remove stake if empty", async () => {
    // empty the first stake 
    await neopuyo42.withdrawStake(ethers.parseEther("400"), 0);
    const summary = await neopuyo42.hasStake(deployer);
    const totalStake = parseInt(ethers.formatEther(summary.total_amount));
    expect(totalStake).to.equal(400, "The total staking should be 400");
    expect(summary.stakes[0].user).to.equal(zeroAddress, "Failed to remove stake when it was empty")
  });

  // [N] some test has an offset of 1 second, adding a 2 seconds tolerance 
  it("check advanceTimeAndBlock function", async () => {
    const blok = await ethers.provider.getBlock("latest");
    const blokPlus20 = await advanceTimeAndBlock(3600*20);

    expect(blok).to.not.be.null;
    expect(blokPlus20).to.not.be.null;
    expect(blokPlus20!.timestamp).to.be.closeTo(blok!.timestamp + 3600*20, 2, "advanceTimeAndBlock function failed");
  });

  it("calculate claimable rewards", async () => {
    // wait 20 hours
    const blokPlus20 = await advanceTimeAndBlock(3600*20);
    expect(blokPlus20).to.not.be.null;

    let summary = await neopuyo42.hasStake(deployer);
    let stake0 = summary.stakes[0];
    let claimable0 = parseFloat(ethers.formatEther(stake0.claimable));
    expect(claimable0).to.equal(400 * 0.01 * 2, "Claimable Reward should be 8 after staking for twenty hours with 400");

    // new stack of 10000, then wait 20 more hours
    await neopuyo42.stake(ethers.parseEther("10000"));
    await advanceTimeAndBlock(3600*20);

    summary = await neopuyo42.hasStake(deployer);
    stake0 = summary.stakes[0];
    claimable0 = parseFloat(ethers.formatEther(stake0.claimable));
    const stake2 = summary.stakes[2];
    const claimable2 = parseFloat(ethers.formatEther(stake2.claimable));

    expect(claimable0).to.equal(400 * 0.01 * 4, "Claimable Reward should be 16 after staking for fourty hours with 400");
    expect(claimable2).to.equal(10000 * 0.01 * 2, "Claimable Reward should be 200 after staking for twenty hours with 10 000");
  });

  it("withdraw the claimable reward", async () => {
    // start with balance of 5000, stack 1000
    let balance1 = parseInt(ethers.formatEther(await neopuyo42.balanceOf(addr1)));
    expect(balance1).to.equal(5000, "Addr1 must start this test with a balance of 5000");

    await neopuyo42.connect(addr1).stake(ethers.parseEther("1000"));
    let summary = await neopuyo42.hasStake(addr1);
    let summaryAmount = parseInt(ethers.formatEther(summary.total_amount))
    let stake0 = summary.stakes[0];
    let claimable0 = parseFloat(ethers.formatEther(stake0.claimable));
    balance1 = parseInt(ethers.formatEther(await neopuyo42.balanceOf(addr1)));
    expect(summaryAmount).to.equal(1000, "Staked value should be 1000");
    expect(balance1).to.equal(4000, "balance should be 4000 after staking 1000");
    expect(claimable0).to.equal(0, "claimable reward should be 0 after at stake time");

    // wait 20 hours
    await advanceTimeAndBlock(3600*20);

    summary = await neopuyo42.hasStake(addr1);
    summaryAmount = parseInt(ethers.formatEther(summary.total_amount))
    stake0 = summary.stakes[0];
    claimable0 = parseFloat(ethers.formatEther(stake0.claimable));
    balance1 = parseInt(ethers.formatEther(await neopuyo42.balanceOf(addr1)));
    expect(summaryAmount).to.equal(1000, "Staked value should be still 1000");
    expect(balance1).to.equal(4000, "balance should still be 4000");
    expect(claimable0).to.equal(1000 * 0.01 * 2, "claimable reward should be 20 after 20h");

    // withdraw 200 from stack (automatically withdraw the claimable with)
    await neopuyo42.connect(addr1).withdrawStake(ethers.parseEther("200"), 0);

    summary = await neopuyo42.hasStake(addr1);
    summaryAmount = parseInt(ethers.formatEther(summary.total_amount))
    stake0 = summary.stakes[0];
    claimable0 = parseFloat(ethers.formatEther(stake0.claimable));
    balance1 = parseInt(ethers.formatEther(await neopuyo42.balanceOf(addr1)));

    const expectedBalance = 4000 + 200 + 20; // balance + withdraw + claimable
    expect(balance1).to.equal(expectedBalance, "balance should be 4220 after withdraw stake");
    expect(claimable0).to.equal(0, "claimable value should be reset after the withdraw");

    // withdraw 200 again should not add claimable 
    await expect(neopuyo42.connect(addr1).withdrawStake(ethers.parseEther("200"), 0))
      .to.not.be.reverted;

    summary = await neopuyo42.hasStake(addr1);
    summaryAmount = parseInt(ethers.formatEther(summary.total_amount))
    stake0 = summary.stakes[0];
    claimable0 = parseFloat(ethers.formatEther(stake0.claimable));
    balance1 = parseInt(ethers.formatEther(await neopuyo42.balanceOf(addr1)));
    expect(summaryAmount).to.equal(1000 - 200 * 2, "Staked value should be now 600");
    expect(balance1).to.equal(4000 + 200 + 20 +200, "balance should be 4440");
    expect(claimable0).to.equal(0, "claimable value should be reset after the withdraw");
  });

});