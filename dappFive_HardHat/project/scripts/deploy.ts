import { ethers } from "hardhat";

async function main() {

  // Récupère l'adresse du compte à utiliser pour le déploiement
  const [deployer] = await ethers.getSigners();
  console.log("Checking ethers.getSigners() : ", deployer.address);

  //defining our contract, need Factory to pass arguments
  const FiveToken = await ethers.getContractFactory("FiveToken");
  const fiveToken = await FiveToken.deploy("FiveToken", "FIVE", 18,  5000000000); 

  // For Typescript requirements (Renting.deploymentTransaction() may be null)
  const deploymentTransaction = fiveToken.deploymentTransaction();
  if (deploymentTransaction) {
    console.log('FiveToken contract deploying by:', deploymentTransaction.from);
    console.log('FiveToken contract deploying with tx hash:', deploymentTransaction.hash);
  } else {
    console.log('Contract deployment transaction not available');
  }

  await fiveToken.waitForDeployment(); // deploying our contract on network
  console.log('🎉🌟💰🐒🎈 FiveToken contract deployed 🎈🌟💰🐒🎉')
  console.log('FiveToken contract address: ', fiveToken.target) // writing contract address to the console
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});