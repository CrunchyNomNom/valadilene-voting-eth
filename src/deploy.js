import { useStoreApi } from "./storeApi";
import Web3 from "web3";
import { Button, TextField } from "@material-ui/core";
import { fetchAbi, fetchBytecode } from "./fetchAbi";
import { Link } from "react-router-dom";
import useStyles from "./styles"

import "./vote.css";


function Deploy() {
  const { address, contractAddress, setContractAddress } = useStoreApi();
  const web3 = new Web3(window.ethereum);
  const classes = useStyles();

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
    <div>
      <p>You can deploy a voting contract here</p>
      
      <form onSubmit={e => deployContract(e)}>
        <TextField required label="Quorum" type="number" InputProps={{className: classes.tf}} InputLabelProps={{className: classes.tf}} />
        <TextField required label="Escrow Address" InputProps={{className: classes.tf}} InputLabelProps={{className: classes.tf}} />
        <TextField required label="Candidates Addresses" InputProps={{className: classes.tf}} InputLabelProps={{className: classes.tf}} />
        <Button className={classes.btn} type="submit" variant="outlined" >DEPLOY</Button>
      </form>
      {contractAddress && <div>
        <p>The address of deployed contract:  </p> <Link to={"/" + contractAddress} className={classes.link}>{contractAddress}</Link>
      </div>
      }
    </div>
  );
}

export default Deploy;
