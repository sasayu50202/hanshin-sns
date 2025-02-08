import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";
type State = {
  comments: Comment[];
  loading: boolean;
  error: string | null;
};
type Action =
  | { type: "SET_COMMENTS"; payload: Comment[] }
  | { type: "ADD_COMMENT"; payload: Comment }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };
const initialState: State = {
  comments: [],
  loading: false,
  error: null,
};

const commentsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_COMMENTS":
      return { ...state, comments: action.payload };
    case "ADD_COMMENT":
      return { ...state, comments: [action.payload, ...state.comments] };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
type CommentsContextType = {
  state: State;
  dispatch: Dispatch<Action>;
};

const CommentsContext = createContext<CommentsContextType | undefined>(
  undefined
);

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(commentsReducer, initialState);

  return (
    <CommentsContext.Provider value={{ state, dispatch }}>
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentsContext);
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentsProvider");
  }
  return context;
}
