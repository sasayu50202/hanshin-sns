import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AuthGuard from '../components/AuthGuard';
import Header from '../components/Header';
import { GamesProvider } from '../contexts/GamesContext';
import { CommentsProvider } from '../contexts/CommentsContext';
import { MVPVotesProvider } from '../contexts/MVPVotesContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFD700',
      contrastText: '#000000',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          color: '#FFD700',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderLeft: '4px solid #FFD700',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(255, 215, 0, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#000000',
          color: '#FFD700',
          '&:hover': {
            backgroundColor: '#222222',
          },
        },
      },
    },
  },
  typography: {
    h4: {
      color: '#000000',
      fontWeight: 700,
    },
    h6: {
      color: '#000000',
      fontWeight: 600,
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <GamesProvider>
      <CommentsProvider>
        <MVPVotesProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthGuard>
              <Header />
              <Component {...pageProps} />
            </AuthGuard>
          </ThemeProvider>
        </MVPVotesProvider>
      </CommentsProvider>
    </GamesProvider>
  );
}