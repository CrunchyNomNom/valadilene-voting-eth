import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { useStoreApi } from "./storeApi";
import Web3 from "web3";
import useStyle from "./styles";

import "./vote.css"
import useStyles from './styles';

function NavBar () {
    const { address, web3, setAddress, setWeb3 } = useStoreApi();
    const classes = useStyles();

    React.useEffect(() => {
      if(web3 === null) {
          setWeb3(window.ethereum ? new Web3(window.ethereum) : null);
      }
    }, []);

  // get user account on button click
  const getUserAccount = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        web3.eth.getAccounts().then(accounts => {
          setAddress(accounts[0]);
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Metamask extensions not detected!");
    }
  };

  return (
    <div>
      <AppBar className={classes.bar}>
        <Toolbar>
            {address ? (
              <>
                <p> Connected to {address} </p>
              </>
            ) : <Button className={classes.btn} onClick={() => getUserAccount()}> Connect your wallet </Button>}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
