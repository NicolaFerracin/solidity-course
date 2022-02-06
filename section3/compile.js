const path = require("path");
const fs = require("fs");
const solc = require("solc");
require("dotenv").config();

const contractName = "Lottery.sol";
const contractPath = path.resolve(__dirname, "contracts", contractName);
const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    [contractName]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const contract = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  contractName
].Lottery;

module.exports = { abi: contract.abi, bytecode: contract.evm.bytecode.object };
