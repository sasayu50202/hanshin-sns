import { ChangeEventHandler, FormEventHandler, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useGames } from "../contexts/GamesContext";
import { addGameToFirestore } from "../lib/firebase/games";
import { Game } from "../types/firebase";

const HANSHIN_TIGERS = "阪神タイガース";
const OPPOSING_TEAMS = [
  "読売ジャイアンツ",
  "横浜DeNAベイスターズ",
  "中日ドラゴンズ",
  "広島東洋カープ",
  "ヤクルトスワローズ",
  "オリックス・バファローズ",
  "福岡ソフトバンクホークス",
  "東北楽天ゴールデンイーグルス",
  "千葉ロッテマリーンズ",
  "北海道日本ハムファイターズ",
  "埼玉西武ライオンズ",
];

export default function GameForm() {
  const { dispatch } = useGames();
  const [opposingTeam, setOpposingTeam] = useState<string>("");
  const [tigersScore, setTigersScore] = useState<string>("");
  const [opposingScore, setOpposingScore] = useState<string>("");
  const [gameDate, setGameDate] = useState<string>("");
  const [gameTime, setGameTime] = useState<string>("");
  const [players, setPlayers] = useState<string[]>(["", "", ""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      if (
        !opposingTeam ||
        !tigersScore ||
        !opposingScore ||
        !gameDate ||
        !gameTime
      ) {
        throw new Error("すべての試合情報を入力してください");
      }

      if (players.some((player) => !player)) {
        throw new Error("3名のMVP候補選手を入力してください");
      }

      const dateTime = new Date(`${gameDate}T${gameTime}`);
      if (isNaN(dateTime.getTime())) {
        throw new Error("無効な日時です");
      }

      const newGame: Omit<Game, "id"> = {
        homeTeam: {
          name: HANSHIN_TIGERS,
          score: parseInt(tigersScore),
        },
        awayTeam: {
          name: opposingTeam,
          score: parseInt(opposingScore),
        },
        date: dateTime.toISOString(),
        status: "finished",
        players,
      };

      const savedGame = await addGameToFirestore(newGame);
      if (!savedGame) {
        throw new Error("試合の登録に失敗しました");
      }

      dispatch({ type: "ADD_GAME", payload: savedGame });

      setOpposingTeam("");
      setTigersScore("");
      setOpposingScore("");
      setPlayers(["", "", ""]);
      setGameDate("");
      setGameTime("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "試合の登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderTop: "4px solid #FFD700" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        新規試合結果登録
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          試合結果を登録しました
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>対戦相手</InputLabel>
              <Select
                value={opposingTeam}
                onChange={(e) => setOpposingTeam(e.target.value)}
                label="対戦相手"
                disabled={loading}
              >
                {OPPOSING_TEAMS.map((team) => (
                  <MenuItem key={team} value={team}>
                    {team}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="阪神タイガース スコア"
              type="number"
              value={tigersScore}
              onChange={(e) => setTigersScore(e.target.value)}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="対戦相手 スコア"
              type="number"
              value={opposingScore}
              onChange={(e) => setOpposingScore(e.target.value)}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="試合日"
              type="date"
              value={gameDate}
              onChange={(e) => setGameDate(e.target.value)}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="試合開始時刻"
              type="time"
              value={gameTime}
              onChange={(e) => setGameTime(e.target.value)}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {[0, 1, 2].map((index) => (
            <Grid item xs={12} key={index}>
              <TextField
                fullWidth
                label={`MVP候補選手 ${index + 1}`}
                value={players[index]}
                onChange={(e) => handlePlayerChange(index, e.target.value)}
                disabled={loading}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                bgcolor: "#000000",
                color: "#FFD700",
                "&:hover": {
                  bgcolor: "#222222",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#FFD700" }} />
              ) : (
                "試合結果を登録"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
