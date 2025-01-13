import { createContext, useContext, useReducer } from 'react';

const initialState = {
  votes: [],
  loading: false,
  error: null,
};

const mvpVotesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_VOTES':
      return { ...state, votes: action.payload };
    case 'ADD_VOTE':
      return { ...state, votes: [...state.votes, action.payload] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const MVPVotesContext = createContext();

export function MVPVotesProvider({ children }) {
  const [state, dispatch] = useReducer(mvpVotesReducer, initialState);

  return (
    <MVPVotesContext.Provider value={{ state, dispatch }}>
      {children}
    </MVPVotesContext.Provider>
  );
}

export function useMVPVotes() {
  const context = useContext(MVPVotesContext);
  if (context === undefined) {
    throw new Error('useMVPVotes must be used within a MVPVotesProvider');
  }
  return context;
}