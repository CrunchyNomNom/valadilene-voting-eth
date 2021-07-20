import { useStoreApi } from "./storeApi";
import { TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import useStyles from "./styles"

import "./vote.css";

function App() {
  const { contractAddress, setContractAddress } = useStoreApi();
  const classes = useStyles();

  const handleContractAddressChange = (event) => {
    setContractAddress(event.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome in voting system dapp</p>
        <p>Go to your voting smart contract page</p>

          <TextField required label="Address" variant="outlined" onChange={handleContractAddressChange} InputProps={{className: classes.tf}} InputLabelProps={{className: classes.tf}}  />
          <Link to={"/" + contractAddress} className={classes.btn}>GO</Link>
        <p>or deploy your own <Link to="/deploy" className="App-link">here.</Link></p>
      </header>
    </div>
  );
}

export default App;
