// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  let config: any = {
    contracts_address: {},
    owner_address: null,
  };
  // We get the contract to deploy
  let filenames = fs
    .readdirSync(`${__dirname}/../contracts/`)
    .map((name) => name.split(".")[0])
    .filter((name) => !["Migrations"].includes(name));
  for (let name of filenames) {
    const cntrc = await ethers.getContractFactory(name);
    const contract = await cntrc.deploy();
    config.contracts_address[name] = contract.address;

    if (!config.owner_address)
      config.owner_address = await contract.signer.getAddress();
  }
  console.log("\n\n RUNNING ===> ", config, "  \n\n");
  fs.writeFileSync("./config.json", JSON.stringify(config));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
