import { useStoreApi } from "./storeApi";
import useWeb3 from "./useWeb3";
import { Button, TextField } from "@material-ui/core";
import NavBar from "./NavBar";
import { fetchAbi } from "./fetchAbi";

import "./App.css";


function App() {
  const { balance, address, web3, setAddress, setBalance } = useStoreApi();
  const abi = fetchAbi;

  const updateBalance = async fromAddress => {
    await web3.eth.getBalance(fromAddress).then(value => {
      setBalance(web3.utils.fromWei(value, "ether"));
    });
  };

  const sendTransaction = async e => {
    e.preventDefault();
    const amount = e.target[0].value;
    const recipient = e.target[1].value;
    await web3.eth.sendTransaction({
      from: address,
      to: recipient,
      value: web3.utils.toWei(amount, "ether")
    });
    updateBalance(address);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome in voting system dapp</p>
        
        <form onSubmit={e => sendTransaction(e)}>
          <TextField
            required
            label="Amount"
            inputProps={{ step: "any" }}
            type="number"
            variant="filled"
          />
          <TextField required label="Recipient Address" variant="filled" />
          <Button
            style={{ margin: "10px" }}
            type="submit"
            variant="outlined"
            color="default"
          >
            Send Crypto
          </Button>
        </form>
      </header>
    </div>
  );
}

export default App;
