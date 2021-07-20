import React, { useReducer, useContext, createContext } from "react";

const StoreContext = createContext();
const initialState = {
  address: null,
  contractAddress: null,
  contract: null,
  balance: 0,
  soul: null,
  web3: null,
  events: [],
  candidates: [],
  phase: {
    voting: false,
    quorumReached: false,
    postVoting: false,
    postVotingSayonara: false,
  },
  winner: null,
  candidate: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "NEW-ADDRESS": return { ...state, address: action.address };
    case "NEW-CONTRACT-ADDRESS": return { ...state, contractAddress: action.contractAddress };
    case "NEW-CONTRACT": return { ...state, contract: action.contract };
    case "SET-BALANCE": return { ...state, balance: action.balance };
    case "SET-SOUL": return { ...state, soul: action.soul };
    case "SET-WEB3": return { ...state, web3: action.web3 };
    case "SET-EVENTS": return { ...state, events: action.events };
    case "SET-PHASE": return { ...state, phase: action.phase };
    case "SET-WINNER": return { ...state, winner: action.winner };
    case "SET-CANDIDATE": return { ...state, candidate: action.candidate };
    case "SET-CANDIDATES": return { ...state, candidates: action.candidates };
    default:
      throw new Error(`Unknown type of action: ${action.type}`);
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
