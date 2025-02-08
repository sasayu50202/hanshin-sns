export type Game = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  status: "finished" | "upcoming";
  players: string[];
};

export type Team = {
  name: string;
  score: number;
};

export type Comment = {
  id: string;
  gameId: string;
  userId: string;
  userEmail: string;
  content: string;
  timestamp: string;
  likes: number;
};

export type MVPVote = {
  id: string;
  gameId: string;
  userId: string;
  userEmail: string;
  playerId: string;
  timestamp: string;
};

export type AuthError = {
  message: string;
};

export type AuthResponse = {
  user: any | null;
  error: string | null;
};
