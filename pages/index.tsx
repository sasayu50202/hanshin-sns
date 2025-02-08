import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import GameCard from "../components/GameCard";
import GameForm from "../components/GameForm";
import { useRouter } from "next/router";
import { useGames } from "../contexts/GamesContext";
import { getGames } from "../lib/firebase/games";

export default function Home() {
  const router = useRouter();
  const { state, dispatch } = useGames();
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const loadGames = async () => {
      if (!mounted) return;

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const gamesData = await getGames();
        if (mounted) {
          dispatch({ type: "SET_GAMES", payload: gamesData });
        }
      } catch (error) {
        if (mounted) {
          dispatch({
            type: "SET_ERROR",
            payload: "試合データの取得に失敗しました",
          });
        }
      } finally {
        if (mounted) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    loadGames();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const handleGameClick = async (gameId: string) => {
    if (isNavigating) return;

    try {
      setIsNavigating(true);
      await router.push(`/games/${gameId}`);
    } catch (error) {
      // ナビゲーションのキャンセルは無視
      if (error && !error.cancelled) {
        console.error("Navigation error:", error);
      }
    } finally {
      setIsNavigating(false);
    }
  };

  if (state.loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="calc(100vh - 64px)"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#000000",
          mb: 4,
        }}
      >
        試合結果
      </Typography>

      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}

      {state.games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onClick={() => handleGameClick(game.id)}
        />
      ))}

      {!state.loading && state.games.length === 0 && (
        <Typography color="textSecondary" align="center">
          試合データがありません
        </Typography>
      )}

      <Box sx={{ mt: 6 }}>
        <GameForm />
      </Box>
    </Container>
  );
}
