import Web3 from "web3";

let provider;
if (typeof window !== "undefined" && window.ethereum) {
  window.ethereum.request({ method: "eth_requestAccounts" });
  provider = window.ethereum;
} else {
  provider = new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_NODE);
}
const web3 = new Web3(provider);

export default web3;
