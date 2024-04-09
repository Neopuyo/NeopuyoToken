import { ethers } from "hardhat";

async function main() {
  // Récupère l'adresse du compte à utiliser pour le déploiement
  const [deployer] = await ethers.getSigners();
  console.log("Checking ethers.getSigners() : ", deployer.address);

  // defining our contract, need Factory to pass arguments
  const Neopuyo42 = await ethers.getContractFactory("Neopuyo42");

  const neopuyo42 = await Neopuyo42.deploy("Neopuyo42", "NEO", 18,  5000000000);
    
  // For Typescript requirements (Renting.deploymentTransaction() may be null)
  const deploymentTransaction = neopuyo42.deploymentTransaction();
  if (deploymentTransaction) {
    console.log('Neopuyo42 contract deploying by:', deploymentTransaction.from);
    console.log('Neopuyo42 contract deploying with tx hash:', deploymentTransaction.hash);
  } else {
    console.log('Contract deployment transaction not available');
  }

  await neopuyo42.waitForDeployment(); // deploying our contract on network
  console.log('🎉🌟💰🐒🎈 Neopuyo42 contract deployed 🎈🌟💰🐒🎉')
  console.log('Neopuyo42 contract address: ', neopuyo42.target) // writing contract address to the console
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});