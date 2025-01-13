import { useRouter } from 'next/router';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { signOut } from '../lib/firebase/auth';
import { auth } from '../lib/firebase/init';

export default function Header() {
  const router = useRouter();
  const currentUser = auth.currentUser;

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/auth');
    }
  };

  // Don't show header on auth page
  if (router.pathname === '/auth') {
    return null;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <AppBar position="static" sx={{ mb: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#FFD700',
            transition: 'transform 0.2s ease',
            '&:active': {
              transform: 'scale(0.98)'
            }
          }}
          onClick={() => router.push('/')}
        >
          阪神タイガース ファンアプリ
        </Typography>
        <Box>
          <Typography variant="body2" component="span" sx={{ mr: 2, color: '#FFD700' }}>
            {currentUser.email}
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            sx={{
              color: '#FFD700',
              borderColor: '#FFD700',
              border: '1px solid',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                borderColor: '#FFE55C'
              }
            }}
          >
            ログアウト
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}