const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { abi, bytecode } = require("../compile");

const web3 = new Web3(ganache.provider());

let accounts;
let inbox;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  inbox = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: ["Hi there!"] })
    .send({ from: accounts[0], gas: (1_000_000).toString() });
});

describe("Inbox", () => {
  it("deployes a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("sets initial message on deploy", async () => {
    const initialMessage = await inbox.methods.getMessage().call();
    assert.equal(initialMessage, "Hi there!");
  });

  it("sets a new message", async () => {
    await inbox.methods
      .setMessage("new message yo!")
      .send({ from: accounts[0] });
    const message = await inbox.methods.getMessage().call();
    assert.equal(message, "new message yo!");
  });
});
