const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const campaignRaw = require("../eth/build/Campaign.json");
const factoryRaw = require("../eth/build/Factory.json");

const { abi: campaignAbi } = campaignRaw;
const {
  abi: factoryAbi,
  evm: {
    bytecode: { object: factoryBytecode },
  },
} = factoryRaw;

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let campaignAddr;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(factoryAbi)
    .deploy({ data: factoryBytecode })
    .send({ from: accounts[0], gas: (1_500_000).toString() });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: (1_500_000).toString() });

  [campaignAddr] = await factory.methods.getAllCampaigns().call();
  campaign = await new web3.eth.Contract(campaignAbi, campaignAddr);
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks the caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute and mark them as approvers", async () => {
    let isContributor = await campaign.methods.approvers(accounts[1]).call();
    let approversCount = await campaign.methods.approversCount().call();
    assert.equal(false, isContributor);
    assert.equal(0, approversCount);

    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });

    isContributor = await campaign.methods.approvers(accounts[1]).call();
    approversCount = await campaign.methods.approversCount().call();
    assert(isContributor);
    assert.equal(1, approversCount);
  });

  it("requires minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[2],
        value: "20",
      });
      assert(false);
    } catch (e) {
      assert.notEqual("ERR_ASSERTION", e.code);
    }
  });

  it("allows the manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy labels", (1_000_000).toString(), accounts[2])
      .send({
        from: accounts[0],
        gas: (1_000_000).toString(),
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy labels", request.description);
    assert.equal((1_000_000).toString(), request.value);
    assert.equal(false, request.complete);
    assert.equal(accounts[2], request.recipient);
  });

  it("processes requests", async () => {
    const initialBalance = await web3.eth.getBalance(accounts[1]);

    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });
    await campaign.methods
      .createRequest("Buy labels", web3.utils.toWei("5", "ether"), accounts[1])
      .send({
        from: accounts[0],
        gas: (1_000_000).toString(),
      });
    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: (1_000_000).toString() });

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: (1_000_000).toString() });

    const finalBalance = await web3.eth.getBalance(accounts[1]);

    assert.equal(web3.utils.toWei("5", "ether"), finalBalance - initialBalance);
  });
});
