import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";
import { MVPVote } from "../types/firebase";

type State = {
  votes: MVPVote[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: "SET_VOTES"; payload: MVPVote[] }
  | { type: "ADD_VOTE"; payload: MVPVote }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: State = {
  votes: [],
  loading: false,
  error: null,
};

const mvpVotesReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_VOTES":
      return { ...state, votes: action.payload };
    case "ADD_VOTE":
      return { ...state, votes: [...state.votes, action.payload] };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
interface MVPVotesContextType {
  state: State;
  dispatch: Dispatch<Action>;
}
const MVPVotesContext = createContext<MVPVotesContextType | undefined>(
  undefined
);

export function MVPVotesProvider({ children }: { children: ReactNode }) {
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
    throw new Error("useMVPVotes must be used within a MVPVotesProvider");
  }
  return context;
}
