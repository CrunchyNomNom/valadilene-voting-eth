import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useStoreApi } from "./storeApi";
import useWeb3 from "./useWeb3";
import Web3 from "web3";



function NavBar () {
    const { balance, address, web3, setAddress, setBalance, setWeb3 } = useStoreApi();

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
      <AppBar>
        <Toolbar>
            {address ? (
              <>
                <p> Connected to {address} </p>
              </>
            ) : <Button onClick={() => getUserAccount()}> Connect your wallet </Button>}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
