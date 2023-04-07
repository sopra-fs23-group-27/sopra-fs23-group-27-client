export type game = {
  id: string;
  name: string;
  joinedPlayers: number;
  gameMode: "ADVANCED" | "BASIC";
  joinLink: string;
};
