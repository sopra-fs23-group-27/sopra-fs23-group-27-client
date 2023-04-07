import { game } from "../types/databaseTypes";

export const emptyGame: game = {
  id: "",
  name: "",
  joinedPlayers: 0,
  gameMode: "BASIC",
  joinLink: "",
};
export const games: game[] = [
  {
    id: "12fg56",
    name: "BestGame",
    joinedPlayers: 6,
    gameMode: "BASIC",
    joinLink: "",
  },
  {
    id: "56849kl",
    name: "FlagmaniaGame",
    joinedPlayers: 10,
    gameMode: "ADVANCED",
    joinLink: "",
  },
  {
    id: "89fdsbop",
    name: "Game1",
    joinedPlayers: 2,
    gameMode: "BASIC",
    joinLink: "",
  },
];
