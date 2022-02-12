import web3 from "./web3";
const campaign = require("./build/Campaign.json");

const getCampaignInstance = (address) => new web3.eth.Contract(campaign.abi, address);

export default getCampaignInstance;
