// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const TEACHER_ADDRESS = '0x808cE8deC9E10beD8d0892aCEEf9F1B8ec2F52Bd';

  const [deployer] = await ethers.getSigners();

  console.log( "Deploying contracts with the account:", 
    deployer.address
  );

  console.log("Account balance:", 
    (await deployer.getBalance()).toString()
  );

  /// @notice Deploy 'Hot' and 'Cold' 'Peas', 2000 premint each.
  const Peas = await hre.ethers.getContractFactory("Peas");
  const hot = await Peas.deploy('Hot','HOT', 2000);  
  console.log("'Hot' deployed to: ", hot.address);
  const cold = await Peas.deploy('Cold','COLD',2000);
  console.log("'Cold' deployed to:" , cold.address);

  /// @notice Deploy 'Porridge'.
  const Porridge= await hre.ethers.getContractFactory("Porridge");
  const porridge = await Porridge.deploy();
  console.log("'Porridge' deployed to:" , porridge.address);

  /// @notice Deploy 'Wrapper' with addresses of 'Hot','Cold', and 'Porridge'.
  const Wrapper = await hre.ethers.getContractFactory('Wrapper');
  const wrapper = await Wrapper.deploy(hot.address,cold.address,porridge.address);
  console.log("'Wrapper' deployed to:" , wrapper.address);

  /// @notice Grant 'Wrapper' address MINTER_ROLE in 'Porridge'.
  await porridge.setMinter(wrapper.address);
  console.log("'Wrapper' set to 'Porridge' minter.")

  /// @notice Swap 500 each of 'Hot' and 'Cold' 'Peas' for 1000 'Porridge'.
  await wrapper.swap(hot.address,5000);
  console.log("500 'Hot' converted to 500 'Porridge'");
  await wrapper.swap(cold.address,500);
  console.log("500 'Cold' converted to 500 'Porridge'");

  /// @notice Transfer 10000 'Porridge' to TEACHER_ADDRESS.
  await porridge.transfer(TEACHER_ADDRESS,1000);
  console.log("1000 'Porridge' transfered to TEACHER_ADDRESS.");
  console.log('TEACHER_ADDRESS:' + TEACHER_ADDRESS);

  /// @notice End of challenge.
  console.log('End of challenge.');
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
