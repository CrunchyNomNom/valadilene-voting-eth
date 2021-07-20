import { useParams } from "react-router-dom";
import { Button, TextField, FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";
import { useEffect } from "react";
import Web3 from "web3";
import { useStoreApi } from "./storeApi";
import { fetchAbi } from "./fetchAbi";
import useStyles from "./styles";

import "./vote.css";

function Vote() {
  const controllingEvents = ["LetTheVoteBegin", "NewMayor", "SayonaraEveryone"];
  const defaultGas = { gas: 4612388, gasPrice: '1000000000' };
  
  const { address, balance, setBalance, events, setEvents, phase, setPhase, winner, setWinner, candidates, setCandidates, candidate, setCandidate, soul, setSoul } = useStoreApi();
  const params = useParams();
  const classes = useStyles();
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(fetchAbi, params.id);


  const mint = async e => {
    e.preventDefault();
    const target = e.target[0].value.toString();
    const amount = e.target[1].value;

    await contract
      .methods.mint(target, amount)
      .send({ from: address.toString(), ...defaultGas });
  };

  const beginVoting = async() => {
    await contract
      .methods.begin_voting()
      .send({ from: address.toString(), ...defaultGas });
  };

  const checkOutcome = async() => {
    await contract
      .methods.check_outcome()
      .send({ from: address.toString(), ...defaultGas });
  };

  const castEnvelope = async() => {
    const envelope = await contract
      .methods.compute_envelope(candidate, soul)
      .call({ from: address.toString(), })
    await contract
      .methods.cast_envelope(envelope)
      .send({ from: address.toString(), ...defaultGas });
  }

  const openEnvelope = async() => {
    await contract
      .methods.open_envelope(candidate, soul)
      .send({ from: address.toString(), ...defaultGas });
  }

  const balanceOf = async() => {
    await contract
      .methods.balanceOf(address)
      .call({ from: address.toString(), })
      .then(value =>
        setBalance(value)
      );
  }


  const handleCandidateChange = (event) => {
    setCandidate(event.target.value);
  }

  const handleSoulChange = (event) => {
    setSoul(event.target.value);
  }


  useEffect(() => {
    contract.getPastEvents("allEvents", { fromBlock: 0, toBlock: 'latest' })
    .then(res => {
      setEvents(res
        .map(e => e.event)
        .filter(e => controllingEvents.includes(e))
        || []);   // if null then default to an empty array
    });
  }, []);

  useEffect(() => setPhase({
    voting: events.includes("LetTheVoteBegin"),
    postVoting: events.includes("NewMayor") || events.includes("SayonaraEveryone"),
    postVotingSayonara: events.includes("SayonaraEveryone"),
  }), [events]);

  useEffect(() => 
    contract.getPastEvents("NewMayor")
    .then(res => 
      setWinner(res && res.length > 0 ? res[0].returnValues.candidate : null)
  ), [events]);

  useEffect(() => {
    if(address) {
      contract
        .methods.candidates_list()
        .call({ from: address.toString() })
        .then(res =>
          setCandidates(res)
        );
      contract
        .methods.is_quorum_reached()
        .call({ from: address.toString() })
        .then(res =>
          setPhase({...phase, quorumReached: res})
        );
      balanceOf();
    }
  }, [address]);

  useEffect(() => {
    if(address) {
      balanceOf();
    }
  }, [balance]);


  return (
    <div>
      { address ? ( 
        <>
        <p> Your balance is {balance} SOUL. </p>
        <Button className={classes.btn} variant="outlined" onClick={async() => balanceOf()}> Refresh balance </Button>
        {events.map(e => <li>{e}</li>)}
        <div> {
          phase.postVoting && winner ? (
            <p> Long live {winner}, the new Mayor! </p>
            ) : phase.postVoting ? (
            <p> A draw! All SOUL has been transfered to the escrow. </p>
          ) : phase.voting ? (
            <div>
              <p> Send or open your signed vote here </p>
              <FormControl variant="outlined" >
                <InputLabel className={classes.tf}>Candidate</InputLabel>
                <Select className={classes.select} value={candidate} onChange={handleCandidateChange} required autoWidth>
                  {candidates.map(x => 
                    <MenuItem value={x}>{x}</MenuItem>
                  )}
                </Select>
              </FormControl>
              <TextField InputProps={{className: classes.tf}} InputLabelProps={{className: classes.tf}} label="Soul" variant="outlined" onChange={handleSoulChange} required />
              { phase.quorumReached ? (
                <div>
                  {!candidate || !soul ?
                    <Button className={classes.btn} variant="outlined" disabled>OPEN</Button>
                    : <Button className={classes.btn} variant="outlined" onClick={openEnvelope}>OPEN</Button>
                  }
                  <div className="deployer">
                    <p> Note: the panel below can be used only by the deployer. </p>
                    <Button className={classes.btn} variant="outlined" onClick={async() => checkOutcome()}>CHECK OUTCOME</Button>
                  </div>
                </div>
              ) : (
                <div>
                  {!candidate || !soul ?
                    <Button className={classes.btn} variant="outlined" disabled>CAST</Button>
                    : <Button className={classes.btn} variant="outlined" onClick={castEnvelope}>CAST</Button>
                  }
                </div>
              )}
            </div>
          ) : (
            <div>
              <p> Please wait for voting to begin. </p>
              <div className="deployer">
                <p> Note: the panel below can be used only by the deployer. </p>
                <form onSubmit={e => mint(e)}>
                  <TextField InputProps={{className: classes.tf}} InputLabelProps={{className: classes.tf}} required label="Receiver address" />
                  <TextField InputProps={{className: classes.tf}} InputLabelProps={{className: classes.tf}} required label="Amount" type="number" />
                  <Button className={classes.btn} type="submit" variant="outlined">MINT</Button>
                </form>
                <Button className={classes.btn} variant="outlined" onClick={async() => beginVoting()}>BEGIN VOTING</Button>
              </div>
            </div>
          )
        } </div>
        </>
      ) : <p> Please connect your wallet to vote. </p>
      }
    </div>
  );
}

export default Vote;
