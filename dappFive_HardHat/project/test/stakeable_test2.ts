import { expect } from "chai";
import { ethers } from "hardhat";

describe("Stakeable_2", () => {
  let fiveToken: any;
  let deployer: any;
  let addr1: any;
  let addr2: any;
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const stakeAmount = ethers.parseEther("400");
  const withdrawAmount = ethers.parseEther("200");

  beforeEach(async function () {
    const FiveToken = await ethers.getContractFactory("FiveToken");
    fiveToken = await FiveToken.deploy("FiveToken", "FIVE", 18,  5000000000);
    await fiveToken.waitForDeployment();

    [deployer, addr1, addr2] = await ethers.getSigners();

    // mint 5000 token to addr1
    await fiveToken.mint(addr1, ethers.parseEther("5000"));
    
    // stack 400 (twice) on deployer
    const stakeFuncID = await fiveToken.stake(stakeAmount);
    await expect(stakeFuncID)
      .to.emit(fiveToken, "Staked")
      .withArgs(deployer, stakeAmount, 1, (await ethers.provider.getBlock("latest"))?.timestamp);

    const stakeFuncID2 = await fiveToken.stake(stakeAmount);
    await expect(stakeFuncID2)
      .to.emit(fiveToken, "Staked")
      .withArgs(deployer, stakeAmount, 1, (await ethers.provider.getBlock("latest"))?.timestamp);
  });

  it("check the setup (1/2)", async function () {
    const initialBalanceRaw = await fiveToken.balanceOf(addr1);
    const initialBalance = parseInt(ethers.formatEther(initialBalanceRaw));
    expect(initialBalance).to.equal(5000, "The balance after minting should be 5000");
    const balanceDeployerRaw = await fiveToken.balanceOf(deployer);
    const balanceDeployer = parseInt(ethers.formatEther(balanceDeployerRaw));
    expect(balanceDeployer).to.equal(5000000000 - 800, "Owner should have his 5 billion initial - 2 x 400");
  });

  it("check the setup (2/2)", async function () {
    const stakes = await fiveToken.hasStake(deployer);
    const totalStake = parseInt(ethers.formatEther(stakes[0]));
    expect(totalStake).to.equal(800, "The total staking should be 800");
    
    const stake1 = stakes[1][0];
    const stake1Amount = parseInt(ethers.formatEther(stake1.amount));
    expect(stake1Amount).to.equal(400, "The first staking should be 400");

    const stake2 = stakes[1][1];
    const stake2Amount = parseInt(ethers.formatEther(stake2.amount));
    expect(stake2Amount).to.equal(400, "The second staking should be 400");
  });

  it("new stakeholder should increased index (2/2)", async () => {
    // stake index 1 is taken by deployer, next index should be for next staker
    const stakeFuncID = await fiveToken.connect(addr1).stake(stakeAmount);
    await expect(stakeFuncID)
      .to.emit(fiveToken, "Staked")
      .withArgs(addr1, stakeAmount, 2, (await ethers.provider.getBlock("latest"))?.timestamp);
  });

  it("cannot stake a 0 amount", async () => {
    // addr2 has balance of 5000
    await expect(fiveToken.connect(addr1).stake(ethers.parseEther("0")))
      .to.be.revertedWith("Staking: Cannot stake a 0 amount");
  });

  it("cannot stake more than you own (1/2)", async () => {
    // addr2 has balance of 5000
    await expect(fiveToken.connect(addr1).stake(ethers.parseEther("5001")))
      .to.be.revertedWith("FiveToken: Cannot stake more than you own");
  });

  it("cannot stake more than you own (2/2)", async () => {
    // addr2 has empty balance
    await expect(fiveToken.connect(addr2).stake(stakeAmount))
      .to.be.revertedWith("FiveToken: Cannot stake more than you own");
  });

  it("withdraw twice time in the two stakes", async () => {
    // deployer has staked 800 total tokens (400 for both index 0 and 1)
    await expect(fiveToken.withdrawStake(ethers.parseEther("200"), 0))
      .to.not.be.reverted;

    await expect(fiveToken.withdrawStake(ethers.parseEther("200"), 1))
      .to.not.be.reverted;

    const stakes = await fiveToken.hasStake(deployer);
    const totalStake = parseInt(ethers.formatEther(stakes[0]));
    expect(totalStake).to.equal(400, "The total staking should be 400 after withdrawing 200 x 2");

    await expect(fiveToken.withdrawStake(ethers.parseEther("200"), 0))
      .to.not.be.reverted;

    await expect(fiveToken.withdrawStake(ethers.parseEther("200"), 1))
      .to.not.be.reverted;

    const stakesF = await fiveToken.hasStake(deployer);
    const totalStakeF = parseInt(ethers.formatEther(stakesF[0]));
    expect(totalStakeF).to.equal(0, "The total staking should be 0 after withdrawing 200 x 2 + 200 x 2");
  });

  it("can't withdraw more than stake has", async () => {
    await expect(fiveToken.withdrawStake(ethers.parseEther("400"), 0))
      .to.not.be.reverted;
    
    await expect(fiveToken.withdrawStake(ethers.parseEther("1"), 0))
      .to.be.revertedWith("Staking: Cannot withdraw more than you have staked");
  });

  it("can only withdraw in indexed stakes", async () => {
    await expect(fiveToken.withdrawStake(ethers.parseEther("1"), 0))
      .to.not.be.reverted;
    
    await expect(fiveToken.withdrawStake(ethers.parseEther("1"), 1))
      .to.not.be.reverted;

    await expect(fiveToken.withdrawStake(ethers.parseEther("1"), 2))
      .to.be.reverted;
  });

  it("remove stake if empty", async () => {
   // go on there
  });





});