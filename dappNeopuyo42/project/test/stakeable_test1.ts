import { expect } from "chai";
import { ethers } from "hardhat";

describe("Stakeable_1", () => {
  let neopuyo42: any;
  let deployer: any;
  let addr1: any;
  let addr2: any;
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  beforeEach(async function () {
    const Neopuyo42 = await ethers.getContractFactory("Neopuyo42");
    neopuyo42 = await Neopuyo42.deploy("Neopuyo42", "NEO", 18,  5000000000);
    await neopuyo42.waitForDeployment();

    [deployer, addr1, addr2] = await ethers.getSigners();
  });

  it("stacking 400x2", async function () {
    const stakeAmount = ethers.parseEther("400");

    // mint 5000 token to addr1
    await neopuyo42.mint(addr1, ethers.parseEther("5000"));
    const initialBalanceRaw = await neopuyo42.balanceOf(addr1);
    const initialBalance = parseInt(ethers.formatEther(initialBalanceRaw));
    expect(initialBalance).to.equal(5000, "The balance initial minting 5000 should be 100");

    // stack 400 (twice)
    const stakeFuncID = await neopuyo42.connect(addr1).stake(stakeAmount);
    await expect(stakeFuncID)
      .to.emit(neopuyo42, "Staked")
      .withArgs(addr1.address, stakeAmount, 1, (await ethers.provider.getBlock("latest"))?.timestamp);

    const stakeFuncID2 = await neopuyo42.connect(addr1).stake(stakeAmount);
    await expect(stakeFuncID2)
      .to.emit(neopuyo42, "Staked")
      .withArgs(addr1.address, stakeAmount, 1, (await ethers.provider.getBlock("latest"))?.timestamp);


    const addr1BalanceRaw = await neopuyo42.balanceOf(addr1);
    const addr1Balance = parseInt(ethers.formatEther(addr1BalanceRaw));
    const balanceDeployerRaw = await neopuyo42.balanceOf(deployer);
    const balanceDeployer = parseInt(ethers.formatEther(balanceDeployerRaw));

    expect(balanceDeployer).to.equal(5000000000, "Owner should have his 5 billion initial");
    expect(addr1Balance).to.equal(4200, "User1 should have 5000 - 400*2 = 4200 token");
  });

  it("cannot stake more than owning", async() => {
    // Stake too much on account1 which as empy balance
    await expect(neopuyo42.connect(addr1).stake(ethers.parseEther("1")))
      .to.be.revertedWith("Neopuyo42: Cannot stake more than you own");
  });

  it("new stakeholder should increased index (1/2)", async() => {
    const stakeAmount = ethers.parseEther("400");

    // mint 5000 token to addr1 + addr2
    await neopuyo42.mint(addr1, ethers.parseEther("5000"));
    await neopuyo42.mint(addr2, ethers.parseEther("5000"));

    // stack on both owner/deployer, addr1, addr2 and check index
    const stakeFuncID1 = await neopuyo42.stake(stakeAmount);
    await expect(stakeFuncID1)
    .to.emit(neopuyo42, "Staked")
    .withArgs(deployer, stakeAmount, 1, (await ethers.provider.getBlock("latest"))?.timestamp);
    
    const stakeFuncID2 = await neopuyo42.connect(addr1).stake(stakeAmount);
    await expect(stakeFuncID2)
      .to.emit(neopuyo42, "Staked")
      .withArgs(addr1, stakeAmount, 2, (await ethers.provider.getBlock("latest"))?.timestamp);

    const stakeFuncID3 = await neopuyo42.connect(addr2).stake(stakeAmount);
    await expect(stakeFuncID3)
      .to.emit(neopuyo42, "Staked")
      .withArgs(addr2, stakeAmount, 3, (await ethers.provider.getBlock("latest"))?.timestamp);

    // index should remain after another stack
    const stakeFuncID4 = await neopuyo42.stake(stakeAmount);
    await expect(stakeFuncID4)
    .to.emit(neopuyo42, "Staked")
    .withArgs(deployer, stakeAmount, 1, (await ethers.provider.getBlock("latest"))?.timestamp);
    
    const stakeFuncID5 = await neopuyo42.connect(addr1).stake(stakeAmount);
    await expect(stakeFuncID5)
      .to.emit(neopuyo42, "Staked")
      .withArgs(addr1, stakeAmount, 2, (await ethers.provider.getBlock("latest"))?.timestamp);

    const stakeFuncID6 = await neopuyo42.connect(addr2).stake(stakeAmount);
    await expect(stakeFuncID6)
      .to.emit(neopuyo42, "Staked")
      .withArgs(addr2, stakeAmount, 3, (await ethers.provider.getBlock("latest"))?.timestamp);
  });
});