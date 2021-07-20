import { useStoreApi } from "./storeApi";
// import useWeb3 from "./useWeb3";
import Web3 from "web3";
import { Button, TextField } from "@material-ui/core";
import {fetchAbi, fetchBytecode} from "./fetchAbi";

function Deploy() {
  const { address, contractAddress, setContractAddress } = useStoreApi();
  const web3 = new Web3(window.ethereum);

  const deployContract = async e => {
    e.preventDefault();
    const quorum = e.target[0].value;
    const escrow = e.target[1].value;
    const candidates = e.target[2].value.replace(" ", "").split(",");

    const contract = new web3.eth.Contract(fetchAbi);
    await contract
      .deploy({
        data: fetchBytecode,
        arguments: [quorum, escrow, candidates],
      })
      .send({
        from: address.toString(),
        gas: 4612388,
        gasPrice: '1000000000',
      })
      .then(
      value => setContractAddress(value.options.address)
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>You can deploy a voting contract here</p>
        
        <form onSubmit={e => deployContract(e)}>
          <TextField required label="quorum" variant="filled" type="number" />
          <TextField required label="Escrow Address" variant="filled" />
          <TextField required label="Candidates Addresses" variant="filled" />
          <Button
            style={{ margin: "10px" }}
            type="submit"
            variant="outlined"
            color="default"
          >
            DEPLOY
          </Button>
        </form>
        <p>{contractAddress && 
          "The address of deployed contract: " + contractAddress
        }</p>
      </header>
    </div>
  );
}

export default Deploy;
