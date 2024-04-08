const FiveToken = artifacts.require("FiveToken");

// THis is an async function, it will accept the Deployer account, the network, and eventual accounts.
module.exports = async function (deployer, network, accounts) {
  
    await deployer.deploy(FiveToken, "FiveToken", "FIVE", 18,  5000000000); // 5 000 000 000
  
    await FiveToken.deployed()

};
