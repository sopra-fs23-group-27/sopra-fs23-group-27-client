export type game = {
  lobbyId: number;
  lobbyName: string;
  mode: "BASIC" | "ADVANCED";
  isPublic: boolean;
  numOptions: number;
  numSeconds: number;
  numSecondsUntilHint: number;
  hintInterval: number;
  maxNumGuesses: number;
  joinedPlayerNames: Array<string>;
  lobbyCreatorPlayerToken: string;
  //privateLobbyKey: type?,
};
