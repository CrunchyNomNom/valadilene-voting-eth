import React, { useReducer, useContext, createContext } from "react";

const StoreContext = createContext();
const initialState = {
  address: null,
  contractAddress: null,
  contract: null,
  balance: 0,
  web3: null,
  events: [],
  phase: {
    voting: false,
    postVoting: false,
    postVotingSayonara: false,
  },
  winner: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "NEW-ADDRESS":
      return {
        ...state,
        address: action.address
      };
    case "NEW-CONTRACT-ADDRESS":
      return {
        ...state,
        contractAddress: action.contractAddress
      };
    case "NEW-CONTRACT":
      return {
        ...state,
        contract: action.contract
      };
    case "SET-BALANCE":
      return {
        ...state,
        balance: action.balance
      };
    case "SET-WEB3":
      return {
        ...state,
        web3 : action.web3
      };
    case "SET-EVENTS":
      return {
        ...state,
        events : action.events
      };
    case "SET-PHASE":
      return {
        ...state,
        phase : action.phase
      };
    case "SET-WINNER":
      return {
        ...state,
        winner : action.winner
      };
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
