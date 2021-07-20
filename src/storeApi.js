import { useStore } from "./store";

export const useStoreApi = () => {
  const { state, dispatch } = useStore();

  return {
    address: state.address,
    contractAddress: state.contractAddress,
    contract: state.contract,
    balance: state.balance,
    web3: state.web3,
    events: state.events,
    phase: state.phase,
    winner: state.winner,
    setAddress: newAddress => {
      dispatch({
        type: "NEW-ADDRESS",
        address: newAddress
      });
    },
    setContractAddress: newContractAddress => {
      dispatch({
        type: "NEW-CONTRACT-ADDRESS",
        contractAddress: newContractAddress
      });
    },
    setContract: newContract => {
      dispatch({
        type: "NEW-CONTRACT",
        contract: newContract
      });
    },
    setBalance: newBalance => {
      dispatch({
        type: "SET-BALANCE",
        balance: newBalance
      });
    },
    setWeb3: newWeb3 => {
      dispatch({
        type: "SET-WEB3",
        web3: newWeb3
      });
    },
    setEvents: newEvents => {
      dispatch({
        type: "SET-EVENTS",
        events: newEvents
      });
    },
    setPhase: newPhase => {
      dispatch({
        type: "SET-PHASE",
        phase: newPhase
      });
    },
    setWinner: newWinner => {
      dispatch({
        type: "SET-WINNER",
        winner: newWinner
      });
    },
    
  };
};
