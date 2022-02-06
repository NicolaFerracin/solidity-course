const path = require("path");
const fs = require("fs");
const solc = require("solc");
require("dotenv").config();

const contractName = "Inbox.sol";
const inboxPath = path.resolve(__dirname, "contracts", contractName);
const source = fs.readFileSync(inboxPath, "utf8");

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
].Inbox;

module.exports = { abi: contract.abi, bytecode: contract.evm.bytecode.object };
