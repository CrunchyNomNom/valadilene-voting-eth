import { useStore } from "./store";

export const useStoreApi = () => {
  const { state, dispatch } = useStore();

  return {
    address: state.address,
    contractAddress: state.contractAddress,
    contract: state.contract,
    balance: state.balance,
    soul: state.soul,
    web3: state.web3,
    events: state.events,
    phase: state.phase,
    winner: state.winner,
    candidate: state.candidate,
    candidates: state.candidates,
    setAddress: newAddress => {
      dispatch({ type: "NEW-ADDRESS", address: newAddress });
    },
    setContractAddress: newContractAddress => {
      dispatch({ type: "NEW-CONTRACT-ADDRESS", contractAddress: newContractAddress });
    },
    setContract: newContract => {
      dispatch({ type: "NEW-CONTRACT", contract: newContract });
    },
    setBalance: newBalance => {
      dispatch({ type: "SET-BALANCE", balance: newBalance });
    },
    setSoul: newSoul => {
      dispatch({ type: "SET-SOUL", soul: newSoul });
    },
    setWeb3: newWeb3 => {
      dispatch({ type: "SET-WEB3", web3: newWeb3 });
    },
    setEvents: newEvents => {
      dispatch({ type: "SET-EVENTS", events: newEvents });
    },
    setPhase: newPhase => {
      dispatch({ type: "SET-PHASE", phase: newPhase });
    },
    setWinner: newWinner => {
      dispatch({ type: "SET-WINNER", winner: newWinner });
    },
    setCandidate: newCandidate => {
      dispatch({ type: "SET-CANDIDATE", candidate: newCandidate });
    },
    setCandidates: newCandidates => {
      dispatch({ type: "SET-CANDIDATES", candidates: newCandidates });
    },
    
  };
};
