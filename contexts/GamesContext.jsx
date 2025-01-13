import { createContext, useContext, useReducer } from 'react';

const initialState = {
  games: [],
  loading: false,
  error: null,
};

const gamesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GAMES':
      return { ...state, games: action.payload };
    case 'ADD_GAME':
      return { ...state, games: [action.payload, ...state.games] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const GamesContext = createContext();

export function GamesProvider({ children }) {
  const [state, dispatch] = useReducer(gamesReducer, initialState);

  return (
    <GamesContext.Provider value={{ state, dispatch }}>
      {children}
    </GamesContext.Provider>
  );
}

export function useGames() {
  const context = useContext(GamesContext);
  if (context === undefined) {
    throw new Error('useGames must be used within a GamesProvider');
  }
  return context;
}