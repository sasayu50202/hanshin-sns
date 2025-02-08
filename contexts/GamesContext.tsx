import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";
import { Game } from "../types/firebase";
interface State {
  games: Game[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "SET_GAMES"; payload: Game[] }
  | { type: "ADD_GAME"; payload: Game }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: State = {
  games: [],
  loading: false,
  error: null,
};

const gamesReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_GAMES":
      return { ...state, games: action.payload };
    case "ADD_GAME":
      return { ...state, games: [action.payload, ...state.games] };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
interface GamesContextType {
  state: State;
  dispatch: Dispatch<Action>;
}
const GamesContext = createContext<GamesContextType | undefined>(undefined);

export function GamesProvider({ children }: { children: ReactNode }) {
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
    throw new Error("useGames must be used within a GamesProvider");
  }
  return context;
}
