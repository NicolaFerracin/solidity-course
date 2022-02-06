const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, bytecode } = require("./compile");

const provider = new HDWalletProvider(process.env.MNEMONIC, process.env.NODE);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const tx = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: (1_000_000).toString() });

  console.log(tx.options.address);
  console.log(JSON.stringify(abi));
  provider.engine.stop();
};

deploy();
