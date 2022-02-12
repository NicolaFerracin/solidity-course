const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const run = async () => {
  const buildPath = path.resolve(__dirname, "build");
  fs.removeSync(buildPath);
  fs.ensureDirSync(buildPath);

  const contractName = "Campaign.sol";
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
  const {
    contracts: { [contractName]: contracts },
  } = JSON.parse(solc.compile(JSON.stringify(input)));

  for (let contract in contracts) {
    fs.outputJSONSync(
      path.resolve(buildPath, contract + ".json"),
      contracts[contract]
    );
  }
};

run();
