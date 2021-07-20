import { useParams } from "react-router-dom";
import { useStoreApi } from "./storeApi";
import Web3 from "web3";
import { Button, TextField } from "@material-ui/core";
import { fetchAbi } from "./fetchAbi";

import "./vote.css";
import { useEffect } from "react";

function Vote() {
  const controllingEvents = ["LetTheVoteBegin", "NewMayor", "SayonaraEveryone"];
  const defaultGas = { gas: 4612388, gasPrice: '1000000000' };

  const { address, balance, setBalance, events, setEvents, phase, setPhase, winner, setWinner } = useStoreApi();
  const web3 = new Web3(window.ethereum);
  const params = useParams();
  const contract = new web3.eth.Contract(fetchAbi, params.id);

  useEffect(() => {
    contract.getPastEvents("allEvents")
    .then(res => {
      setEvents(res
        .map(e => e.event)
        .filter(e => controllingEvents.includes(e))
        || []);   // if null then default to an empty array
    })
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

  const balanceOf = async() => {
    await contract
      .methods.balanceOf(address)
      .call({
        from: address.toString(),
      })
      .then(
        value => setBalance(value)
      );
  }
  // useEffect(balanceOf(), [address]);

  const mint = async e => {
    e.preventDefault();
    const target = e.target[0].value.toString();
    const amount = e.target[1].value;

    await contract
      .methods.mint(target, amount)
      .send({
        from: address.toString(), ...defaultGas
      });
  };

  const beginVoting = async() => {
    await contract
      .methods.begin_voting()
      .send({
        from: address.toString(), ...defaultGas
      });
  };

  const checkOutcome = async() => {
    await contract
      .methods.check_outcome()
      .send({
        from: address.toString(), ...defaultGas
      });
  };

  const castEnvelope = async e => {
    e.preventDefault();
    const target = e.target[0].value.toString();
    const amount = e.target[1].value;

    const envelope = await contract
      .methods.compute_envelope(target, amount)
      .call({
        from: address.toString(),
      })
    await contract
      .methods.cast_envelope(envelope)
      .send({
        from: address.toString(), ...defaultGas
      });
  }

  const openEnvelope = async e => {
    e.preventDefault();
    const target = e.target[0].value.toString();
    const amount = e.target[1].value;

    await contract
      .methods.open_envelope(target, amount)
      .send({
        from: address.toString(), ...defaultGas
      });
  }

  return (
    <div className="Vote">
      <header className="Vote-header">
        { address ? ( 
          <>
          <p>Your balance is {balance} SOUL.</p><Button onClick={async() => balanceOf()}>
            Refresh balance
          </Button>
          <div> {
            phase.postVoting && winner ? (
              <p> Long live the {winner}, the new Mayor! </p>
              ) : phase.postVoting ? (
              <p> A draw! All SOUL has been transfered to the escrow. </p>
            ) : phase.voting ? (
              <div>
                <p>Send or open your signed vote here</p>
                <form onSubmit={e => castEnvelope(e)}>
                    <TextField required label="Candidate address" variant="filled" />
                    <TextField required label="SOUL Amount" variant="filled" type="number" />
                    <Button type="submit" variant="outlined" name="cast">CAST</Button>
                </form>
                <form onSubmit={e => openEnvelope(e)}>
                    <TextField required label="Candidate address" variant="filled" />
                    <TextField required label="SOUL Amount" variant="filled" type="number" />
                    <Button type="submit" variant="outlined" name="open">OPEN</Button>
                </form>
                <div className="deployer">
                  <p>
                    Note: the panel below can be used only by the deployer.
                  </p>
                  <Button variant="outlined" onClick={async() => checkOutcome()}>CHECK OUTCOME</Button>
                </div>
              </div>
            ) : (
              <div>
                <p>
                  Please wait for voting to begin.
                </p>
                <div className="deployer">
                  <p>
                    Note: the panel below can be used only by the deployer.
                  </p>
                  <form onSubmit={e => mint(e)}>
                    <TextField required label="Receiver address" variant="filled" />
                    <TextField required label="Amount" variant="filled" type="number" />
                    <Button type="submit" variant="outlined" color="default">MINT</Button>
                  </form>
                  <Button variant="outlined" onClick={async() => beginVoting()}>BEGIN VOTING</Button>
                </div>
              </div>
            )
          } </div>
          </>
        ) : <p> Please connect your wallet to vote. </p>
        }
      </header>
    </div>
  );
}

export default Vote;
