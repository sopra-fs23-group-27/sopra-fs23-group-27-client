import { game } from "../types/game";

export const emptyGame: game = {
  lobbyId: -1,
  lobbyName: "",
  mode: "ADVANCED",
  isPublic: true,
  numOptions: 0,
  numSeconds: 0,
  numSecondsUntilHint: 0,
  hintInterval: 0,
  maxNumGuesses: 0,
  joinedPlayerNames: [],
  lobbyCreatorPlayerToken: "",
};
export const games: game[] = [
  {
    lobbyId: 1,
    lobbyName: "d",
    mode: "ADVANCED",
    isPublic: true,
    numOptions: 0,
    numSeconds: 10,
    numSecondsUntilHint: 10,
    hintInterval: 5,
    maxNumGuesses: 1,
    joinedPlayerNames: ["player5"],
    lobbyCreatorPlayerToken: "Basic cGxheWVyNToxMjM0",
  },
  {
    lobbyId: 9,
    lobbyName: "Helloasdf",
    mode: "BASIC",
    isPublic: true,
    numOptions: 3,
    numSeconds: 10,
    numSecondsUntilHint: 0,
    hintInterval: 0,
    maxNumGuesses: 0,
    joinedPlayerNames: ["Domc"],
    lobbyCreatorPlayerToken: "Basic RG9tYzoxMjM0",
  },
];
