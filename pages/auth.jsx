import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { signIn, signUp } from '../lib/firebase/auth';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNavigation = useCallback(async () => {
    try {
      await router.push('/', undefined, { shallow: true });
    } catch (error) {
      // Silently handle navigation cancellations
      if (error instanceof Error && !('cancelled' in error)) {
        console.error('Unexpected navigation error:', error);
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const { user, error: authError } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (authError) {
        setError(authError);
        setLoading(false);
        return;
      }

      if (user) {
        await handleNavigation();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('認証中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper 
        sx={{ 
          p: 4,
          borderTop: '4px solid #FFD700',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{
            color: '#000000',
            fontWeight: 'bold'
          }}
        >
          {isSignUp ? '新規登録' : 'ログイン'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#FFD700',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#FFD700',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                },
              },
            }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ 
              mt: 3,
              bgcolor: '#000000',
              color: '#FFD700',
              '&:hover': {
                bgcolor: '#222222',
              }
            }}
            disabled={loading}
          >
            {loading ? '処理中...' : (isSignUp ? '登録' : 'ログイン')}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={loading}
            sx={{
              color: '#000000',
              '&:hover': {
                color: '#FFD700',
                bgcolor: 'transparent'
              }
            }}
          >
            {isSignUp
              ? 'すでにアカウントをお持ちの方はこちら'
              : '新規登録はこちら'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}