import { Card, CardContent, Typography, Box } from "@mui/material";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Game } from "../types/firebase";

type GamseCardProps = {
  game: Game;
  onClick: () => void;
};
export default function GameCard({ game, onClick }: GamseCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        mb: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateX(8px)",
        },
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.9rem",
            }}
          >
            {format(new Date(game.date), "yyyy年M月d日(E) HH:mm", {
              locale: ja,
            })}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flex={1}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {game.homeTeam.name}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: game.homeTeam.name.includes("阪神")
                  ? "primary.main"
                  : "text.primary",
              }}
            >
              {game.homeTeam.score}
            </Typography>
          </Box>

          <Typography
            variant="h5"
            sx={{
              mx: 2,
              color: "secondary.main",
              fontWeight: "bold",
            }}
          >
            VS
          </Typography>

          <Box flex={1} textAlign="right">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {game.awayTeam.name}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: game.awayTeam.name.includes("阪神")
                  ? "primary.main"
                  : "text.primary",
              }}
            >
              {game.awayTeam.score}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
