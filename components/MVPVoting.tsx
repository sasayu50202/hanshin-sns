import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useMVPVotes } from "../contexts/MVPVotesContext";
import { addVote, getGameVotes } from "../lib/firebase/mvpVotes";
import { auth } from "../lib/firebase/init";
type MVPVotingProps = {
  gameId: string;
  players: string[];
};
export default function MVPVoting({ gameId, players }: MVPVotingProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { state, dispatch } = useMVPVotes();
  const currentUser = auth.currentUser;

  useEffect(() => {
    let mounted = true;

    const fetchVotes = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const votes = await getGameVotes(gameId);
        if (mounted) {
          dispatch({ type: "SET_VOTES", payload: votes });
        }
      } catch (error) {
        if (mounted) {
          dispatch({
            type: "SET_ERROR",
            payload: "投票データの取得に失敗しました",
          });
        }
      } finally {
        if (mounted) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    fetchVotes();

    return () => {
      mounted = false;
    };
  }, [gameId, dispatch]);

  const userVote = currentUser
    ? state.votes.find((vote) => vote.userId === currentUser.uid)
    : null;

  const handleVote = async () => {
    if (!selectedPlayer || !currentUser || userVote || submitting) return;

    setSubmitting(true);
    try {
      const vote = await addVote({
        gameId,
        userId: currentUser.uid,
        userEmail: currentUser.email || "不明なユーザー",
        playerId: selectedPlayer,
        timestamp: new Date().toISOString(),
      });

      if (vote) {
        dispatch({ type: "ADD_VOTE", payload: vote });
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "投票に失敗しました",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getVoteCount = (playerId: string) => {
    return state.votes.filter((vote) => vote.playerId === playerId).length;
  };

  if (state.loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        MVP投票
      </Typography>

      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}

      {userVote ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          あなたは{players[parseInt(userVote.playerId)]}に投票しました
        </Alert>
      ) : (
        <Typography sx={{ mb: 2, color: "text.secondary" }}>
          1試合につき1回のみ投票できます
        </Typography>
      )}

      <FormControl component="fieldset" sx={{ width: "100%" }}>
        <RadioGroup
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
        >
          {players.map((player, index) => (
            <FormControlLabel
              key={index}
              value={index.toString()}
              control={<Radio />}
              label={`${player} (${getVoteCount(index.toString())}票)`}
              disabled={!!userVote || submitting}
              sx={{
                mb: 1,
                p: 1,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                width: "100%",
                "&:hover": {
                  bgcolor: "rgba(255, 215, 0, 0.05)",
                },
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Button
        variant="contained"
        onClick={handleVote}
        disabled={!selectedPlayer || !!userVote || submitting}
        sx={{
          mt: 2,
          bgcolor: "#000000",
          color: "#FFD700",
          "&:hover": {
            bgcolor: "#222222",
          },
        }}
      >
        {submitting ? (
          <CircularProgress size={24} sx={{ color: "#FFD700" }} />
        ) : (
          "投票する"
        )}
      </Button>
    </Box>
  );
}
