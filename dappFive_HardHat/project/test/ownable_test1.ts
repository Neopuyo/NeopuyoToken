import { expect } from "chai";
import { ethers } from "hardhat";

describe("Ownable", function () {
  let ownable: any;
  let deployer: any;
  let addr1: any;
  let addr2: any;
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  beforeEach(async function () {
    const Ownable = await ethers.getContractFactory("Ownable");
    ownable = await Ownable.deploy();
    await ownable.waitForDeployment();

    [deployer, addr1, addr2] = await ethers.getSigners();
  });

  it("transfer ownership", async function () {
    const owner = await ownable.owner();

    // account0, the deployer, should be the owner at setup
    expect(owner).to.equal(deployer, "The owner should be the deployer");
    expect(owner).to.not.equal(addr1, "The owner should be the deployer");
    expect(owner).to.not.equal(addr2, "The owner should be the deployer");

    // Transfer ownership to addr1
    await ownable.transferOwnership(addr1);
    const newOwner = await ownable.owner();

    expect(newOwner).to.not.equal(deployer, "The ownership should be transfered to addr1");
    expect(newOwner).to.equal(addr1, "The ownership should be transfered to addr1");
    expect(newOwner).to.not.equal(addr2, "The ownership should be transfered to addr1");
  
    // Transfer ownership from addr1 to addr2
    await ownable.connect(addr1).transferOwnership(addr2);
    const finalOwner = await ownable.owner();

    expect(finalOwner).to.not.equal(deployer, "The ownership should be transfered to addr2");
    expect(finalOwner).to.not.equal(addr1, "The ownership should be transfered to addr2");
    expect(finalOwner).to.equal(addr2, "The ownership should be transfered to addr2");
  
  });

  it("onlyOwner modifier", async function () {
    await expect(ownable.connect(addr2).transferOwnership(addr1))
      .to.be.revertedWith("Ownable: only owner can call this function");

    await expect(ownable.transferOwnership(addr1))
      .to.not.be.reverted;
  });

  it("deployer renonce ownership", async function () {
    await ownable.renounceOwnership();
    
    const owner = await ownable.owner();

    expect(owner).to.equal(zeroAddress, "Renouncing owner from deployer was not correctly done");
  });

  it("addr1 renonce ownership", async function () {
    // give ownership to addr1
    await ownable.transferOwnership(addr1);

    // 1. deployer can no longer renonce owner ship
    await expect(ownable.renounceOwnership())
      .to.be.revertedWith("Ownable: only owner can call this function")

    // 2. deployer can't transfer ownership to addr2 instead
    await expect(ownable.transferOwnership(addr2))
     .to.be.revertedWith("Ownable: only owner can call this function")

    // 3. deployer can't transfer ownership to addr1 one time again
    await expect(ownable.transferOwnership(addr1))
     .to.be.revertedWith("Ownable: only owner can call this function")

    await expect(ownable.connect(addr1).renounceOwnership())
      .to.not.be.reverted;
    
    const owner = await ownable.owner();
    expect(owner).to.equal(zeroAddress, "Renouncing owner from addr1 was not correctly done");
  });

});