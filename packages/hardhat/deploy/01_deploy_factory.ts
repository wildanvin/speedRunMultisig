import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a "FactoryMultiSig" contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployFactoryMultiSig: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("FactoryMultiSig", {
    from: deployer,
    // Contract constructor arguments
    args: [31337], // change this variable  to your favorite chain id
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract
  // const FactoryMultiSig = await hre.ethers.getContract("FactoryMultiSig", deployer);
};

export default deployFactoryMultiSig;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags FactoryMultiSig
deployFactoryMultiSig.tags = ["FactoryMultiSig"];
