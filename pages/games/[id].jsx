import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, Paper, CircularProgress, Alert } from '@mui/material';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getGame } from '../../lib/firebase/games';
import { useGames } from '../../contexts/GamesContext';
import CommentSection from '../../components/CommentSection';
import MVPVoting from '../../components/MVPVoting';

export default function GameDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { state: { games } } = useGames();

  useEffect(() => {
    let mounted = true;

    const fetchGame = async () => {
      if (!id) return;
      
      try {
        // まずContextから試合を探す
        const storeGame = games.find(g => g.id === id);
        
        if (storeGame) {
          if (mounted) {
            setGame(storeGame);
            setLoading(false);
          }
          return;
        }

        // ContextになければFirebaseから取得
        const gameData = await getGame(id);
        if (mounted) {
          if (gameData) {
            setGame(gameData);
          } else {
            setError('試合が見つかりません');
          }
        }
      } catch (error) {
        if (mounted) {
          console.error('Error fetching game:', error);
          setError('試合データの取得に失敗しました');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchGame();

    return () => {
      mounted = false;
    };
  }, [id, games]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !game) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || '試合が見つかりません'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3, borderLeft: '4px solid #FFD700' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#000000' }}>
          {game.homeTeam.name} vs {game.awayTeam.name}
        </Typography>
        
        <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
          {format(new Date(game.date), 'yyyy年M月d日(E) HH:mm', { locale: ja })}
        </Typography>
        
        <Box display="flex" justifyContent="center" alignItems="center" my={3}>
          <Box textAlign="center" flex={1}>
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold',
              color: game.homeTeam.name.includes('阪神') ? '#FFD700' : '#000000'
            }}>
              {game.homeTeam.score}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {game.homeTeam.name}
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ mx: 3, color: '#000000' }}>-</Typography>
          <Box textAlign="center" flex={1}>
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold',
              color: game.awayTeam.name.includes('阪神') ? '#FFD700' : '#000000'
            }}>
              {game.awayTeam.score}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {game.awayTeam.name}
            </Typography>
          </Box>
        </Box>

        {game.players && game.players.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              MVP候補選手
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {game.players.map((player, index) => (
                <Paper
                  key={index}
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor: '#f5f5f5',
                    border: '1px solid #FFD700'
                  }}
                >
                  <Typography>{player}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {game.status === 'finished' && game.players && game.players.length > 0 && (
        <Paper sx={{ p: 3, mb: 3, borderLeft: '4px solid #FFD700' }}>
          <MVPVoting gameId={game.id} players={game.players} />
        </Paper>
      )}

      <Paper sx={{ p: 3, borderLeft: '4px solid #FFD700' }}>
        <CommentSection gameId={game.id} />
      </Paper>
    </Container>
  );
}