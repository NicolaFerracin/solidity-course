import { useEffect, useState } from "react";
import web3 from "./web3";
import lotteryContract from "./lottery";
import "./App.css";

const connectMetamask = () =>
  window.ethereum.request({ method: "eth_requestAccounts" });

function App() {
  const [manager, setManager] = useState();
  const [players, setPlayers] = useState([]);
  const [pot, setPot] = useState("");
  const [entryAmount, setEntryAmount] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    connectMetamask();

    async function fetchData() {
      const manager = await lotteryContract.methods.manager().call();
      setManager(manager);
      const players = await lotteryContract.methods.getPlayers().call();
      setPlayers(players);
      const pot = await web3.eth.getBalance(lotteryContract.options.address);
      setPot(pot);
    }

    fetchData();
  }, []);

  const onSubmit = async (e) => {
    setMessage("Entering the lottery...");
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();
    await lotteryContract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(entryAmount, "ether"),
    });
    setMessage("You were sucessfully added to the lottery!");
  };

  const pickWinner = async (e) => {
    setMessage("Picking a winner...");
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();
    await lotteryContract.methods.pickWinner().send({ from: accounts[0] });
    setMessage("Winner picked!");
  };

  return (
    <div>
      <h1>Lottery Contract</h1>
      <p>This lottery is managed by {manager}</p>
      <p>There are {players.length} people participating in this lottery.</p>
      <p>The total pot is: {web3.utils.fromWei(pot, "ether")} ethers</p>
      <hr />
      <form onSubmit={onSubmit}>
        <h2>Want to try your luck?</h2>
        <div>
          <label>Amount of ether</label>
          <input
            onChange={(e) => setEntryAmount(e.target.value)}
            value={entryAmount}
          />
        </div>
        <button type="submit">Enter</button>
      </form>
      <hr />
      <h2>Pick a winner!</h2>
      <button onClick={pickWinner}>Pick it!</button>
      <hr />
      {message && <h2>{message}</h2>}
    </div>
  );
}

export default App;
