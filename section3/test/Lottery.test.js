const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { abi, bytecode } = require("../compile");

const web3 = new Web3(ganache.provider());

let accounts;
let lottery;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: (1_000_000).toString() });
});

describe("Lottery", () => {
  it("deployes a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows entering the lottery", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("0.02", "ether") });
    let players = await lottery.methods.getPlayers().call();
    assert.equal(1, players.length);
    assert.equal(accounts[1], players[0]);

    await lottery.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei("0.02", "ether") });
    players = await lottery.methods.getPlayers().call();
    assert.equal(2, players.length);
    assert.equal(accounts[2], players[1]);

    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("0.02", "ether") });
    players = await lottery.methods.getPlayers().call();
    assert.equal(3, players.length);
    assert.equal(accounts[0], players[2]);
  });

  it("requires more than .01 Ether for entering", async () => {
    try {
      await lottery.methods
        .enter()
        .send({ from: accounts[1], value: web3.utils.toWei("0.01", "ether") });
      assert(false);
    } catch (e) {
      assert.notEqual("ERR_ASSERTION", e.code);
    }
  });

  it("allows only the manager", async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (e) {
      assert.notEqual("ERR_ASSERTION", e.code);
    }
  });

  it("sends prize to the winner", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("2", "ether") });

    const balanceBefore = await web3.eth.getBalance(accounts[1]);

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    const balanceAfter = await web3.eth.getBalance(accounts[1]);

    const diff = balanceAfter - balanceBefore;
    assert.equal(web3.utils.toWei("2", "ether"), diff);
  });

  it("resets the players after picking a winner", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("2", "ether") });

    let players = await lottery.methods.getPlayers().call();
    assert.equal(1, players.length);

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    players = await lottery.methods.getPlayers().call();
    assert.equal(0, players.length);
  });

  it("should have an empty balance after picking a winner", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("2", "ether") });

    const balanceBefore = await web3.eth.getBalance(lottery.options.address);
    assert.equal(web3.utils.toWei("2", "ether"), balanceBefore);

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    const balanceAfter = await web3.eth.getBalance(lottery.options.address);
    assert.equal(web3.utils.toWei("0", "ether"), balanceAfter);
  });
});
