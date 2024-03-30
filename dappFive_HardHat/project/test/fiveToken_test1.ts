import { expect } from "chai";
import { ethers } from "hardhat";


describe("FiveToken", function () {
  let fiveToken: any;
  let deployer: any;
  let addr1: any;
  let addr2: any;
  const zeroAddress = '0x0000000000000000000000000000000000000000'

  beforeEach(async function () {
    const FiveToken = await ethers.getContractFactory("FiveToken");
    fiveToken = await FiveToken.deploy("FiveToken", "FIVE", 18,  5000000000);
    await fiveToken.waitForDeployment();

    [deployer, addr1, addr2] = await ethers.getSigners();

  });

  it("initial supply", async function () {
    const totalSupplyRaw = await fiveToken.totalSupply();
    const totalSupply = ethers.formatEther(totalSupplyRaw);

    expect(parseInt(totalSupply)).to.equal(5000000000, "Initial supply was not the same as in migration");
  });

  it("minting", async function () {
    const initialBalanceRaw = await fiveToken.balanceOf(addr1);
    const initialBalance = parseInt(ethers.formatEther(initialBalanceRaw));

    // Check 0 balance to addr1
    expect(initialBalance).to.equal(0, "initial balance for account 1 should be 0");

    const totalSupplyRaw = await fiveToken.totalSupply();
    const totalSupply = parseInt(ethers.formatEther(totalSupplyRaw));

    // Mint 100 to addr1
    await fiveToken.mint(addr1, ethers.parseEther("100"));
    const afterBalanceRaw = await fiveToken.balanceOf(addr1);
    const afterBalance = parseInt(ethers.formatEther(afterBalanceRaw));

    const afterSupplyRaw = await fiveToken.totalSupply();
    const afterSupply = parseInt(ethers.formatEther(afterSupplyRaw));

    expect(afterBalance).to.equal(100, "The balance after minting 100 should be 100");
    expect(afterSupply).to.equal(totalSupply + 100, "The totalSupply should have been increased");

    // Mint 100 to zeroAddress
    try {
      await fiveToken.mint(zeroAddress, ethers.parseEther("100"));
    } catch(error) {
      expect(error).to.be.an.instanceOf(Error, "catch object is not of type Error");
      const err = error as Error;
      expect(err.message).to.equal("FiveToken: cannot mint to zero address", "Failed to stop minting on zero address");
    }


  });

});