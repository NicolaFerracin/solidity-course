import web3 from "./web3";
const factory = require("./build/Factory.json");

const instance = new web3.eth.Contract(
  factory.abi,
  "0xcA022819c7B3eB10F270a11B1C064CE15Ea47EE9"
);

export default instance;
