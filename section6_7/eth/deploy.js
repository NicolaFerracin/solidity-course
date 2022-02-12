require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const factoryRaw = require("../eth/build/Factory.json");

const {
  abi: factoryAbi,
  evm: {
    bytecode: { object: factoryBytecode },
  },
} = factoryRaw;

const provider = new HDWalletProvider(process.env.MNEMONIC, process.env.NODE);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const tx = await new web3.eth.Contract(factoryAbi)
    .deploy({ data: factoryBytecode })
    .send({ from: accounts[0], gas: (1_500_000).toString() });

  console.log(tx.options.address);
  provider.engine.stop();
};

deploy();
