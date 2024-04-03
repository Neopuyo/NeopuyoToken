import { expect, assert } from "chai";
import { ethers } from "hardhat";


describe("FiveToken", function () {
  let fiveToken: any;
  let deployer: any;
  let addr1: any;
  let addr2: any;
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  beforeEach(async function () {
    const FiveToken = await ethers.getContractFactory("FiveToken");
    fiveToken = await FiveToken.deploy("FiveToken", "FIVE", 18,  5000000000);
    await fiveToken.waitForDeployment();

    [deployer, addr1, addr2] = await ethers.getSigners();

  });

  it("initial supply", async function () {
    const totalSupplyRaw = await fiveToken.totalSupply();
    const totalSupply = ethers.formatEther(totalSupplyRaw);

    expect(parseInt(totalSupply)).to.equal(5000000000, "Initial supply is supposed to be 5 billions");
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
    await expect(fiveToken.mint(zeroAddress, ethers.parseEther("100"))).to.be.revertedWith("FiveToken: cannot mint to zero address");

    // Mint 100 to zeroAddress code variant :
    try {
      await fiveToken.mint(zeroAddress, ethers.parseEther("100"));
      expect.fail("Expected an error to be thrown");
    } catch (error: any) {
      expect((error as Error).message).to.include("FiveToken: cannot mint to zero address");
    }
  });

  it ("burning", async () => {
    // mint 100 to addr1
    await fiveToken.mint(addr1, ethers.parseEther("100"));
    const initialBalanceRaw = await fiveToken.balanceOf(addr1);
    const initialBalance = parseInt(ethers.formatEther(initialBalanceRaw));
    expect(initialBalance).to.equal(100, "The balance after minting 100 should be 100");

    // Burn to zeroAddress
    await expect(fiveToken.burn(zeroAddress, ethers.parseEther("100")))
      .to.be.revertedWith("FiveToken: cannot burn from zero address");

    // Burn more than 100 to addr1
    await expect(fiveToken.burn(addr1, ethers.parseEther("101")))
      .to.be.revertedWith("FiveToken: Cannot burn more than the account owns");

    // Burn 50 and check that addr1 + total
    const totalSupplyRaw = await fiveToken.totalSupply();
    const totalSupply = parseInt(ethers.formatEther(totalSupplyRaw));
    try {
      await fiveToken.burn(addr1, ethers.parseEther("50") );
    } catch(error: any) {
      assert.fail((error as Error).message);
    }

    const afterBalanceRaw = await fiveToken.balanceOf(addr1);
    const afterBalance = parseInt(ethers.formatEther(afterBalanceRaw));
    expect(afterBalance).to.equal(50, "The balance after minting 50 should be 50");
    const totalSupply2Raw = await fiveToken.totalSupply();
    const totalSupply2 = parseInt(ethers.formatEther(totalSupply2Raw));
    expect(totalSupply2).to.equal(totalSupply - 50, "Total supply should be decreased of 50");

  });

  it("transfering tokens", async() => {
    // Grab initial balance
    const initialBalanceRaw = await fiveToken.balanceOf(addr1);
    const initialBalance = parseInt(ethers.formatEther(initialBalanceRaw));
    const initialBalance2Raw = await fiveToken.balanceOf(addr2);
    const initial2Balance = parseInt(ethers.formatEther(initialBalance2Raw));


    // transfer tokens from account 0 to 1 
    await fiveToken.transfer(addr1, ethers.parseEther("100"));
    
    const afterBalanceRaw = await fiveToken.balanceOf(addr1);
    const afterBalance = parseInt(ethers.formatEther(afterBalanceRaw))

    expect(afterBalance).to.equal(initialBalance + 100, "Balance should have increased on reciever");

    // We can change the msg.sender using the FROM value in function calls.
    
    // [N] the line above will only works with Web3.js syntax, not ethers.js
    // await fiveToken.transfer(addr2, ethers.parseEther("20"), { from: addr1});

    await fiveToken.connect(addr1).transfer(addr2, ethers.parseEther("20"));
    const finalBalanceRaw = await fiveToken.balanceOf(addr1);
    const finalBalance = parseInt(ethers.formatEther(finalBalanceRaw));
    const finalBalance2Raw = await fiveToken.balanceOf(addr2);
    const final2Balance = parseInt(ethers.formatEther(finalBalance2Raw));

    expect(finalBalance).to.equal(afterBalance - 20, "Balance should have decreased of 20 tokens");
    expect(final2Balance).to.equal(initial2Balance + 20, "Balance should have increased of 20 tokens");

    // over transfering
    await expect(fiveToken.connect(addr1).transfer(addr2, ethers.parseEther("77777777")))
      .to.be.revertedWith("FiveToken: cant transfer more than your account holds");
  })

  it ("allow account some allowance", async () => {
    
    //  No allow on zeroAddress
    await expect(fiveToken.approve(zeroAddress, ethers.parseEther("100")))
      .to.be.revertedWith('FiveToken: approve cannot be to zero address');
    
    // Valid allowance
    await expect(fiveToken.approve(addr1, ethers.parseEther("642")))
      .to.not.be.reverted;

    // Verify by checking allowance
    const allowance = await fiveToken.allowance(deployer, addr1);
    expect(allowance).to.equal(ethers.parseEther("642"), "Allowance was not correctly inserted");
  })

  it("transfering with allowance", async () => {
    // transfer tokens from account 0 to 2 
    await fiveToken.transfer(addr1, ethers.parseEther("800"));
    await fiveToken.approve(addr1, ethers.parseEther("400"));

    // Transfer more than value allowed
    await expect(fiveToken.connect(addr1).transferFrom(deployer, addr2, ethers.parseEther("401")))
      .to.be.revertedWith("FiveToken: You cannot spend that much on this account");

    // Transfer 111 of 400 allowed and chaeck allowance decreased
    await expect(fiveToken.connect(addr1).transferFrom(deployer, addr2, ethers.parseEther("111")))
      .to.not.be.reverted;

    const allowance = await fiveToken.allowance(deployer, addr1);
    expect(allowance).to.equal(ethers.parseEther("289"), "The allowance should have been decreased by 111");
  })
});