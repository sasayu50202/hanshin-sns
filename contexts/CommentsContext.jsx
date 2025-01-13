import { createContext, useContext, useReducer } from 'react';

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COMMENTS':
      return { ...state, comments: action.payload };
    case 'ADD_COMMENT':
      return { ...state, comments: [action.payload, ...state.comments] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const CommentsContext = createContext();

export function CommentsProvider({ children }) {
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
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
}