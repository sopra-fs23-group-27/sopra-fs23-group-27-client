export type Lobby = {
  lobbyId: number;
  lobbyName: string;
  continent: string[];
  isPublic: boolean;
  numRounds: number;
  numSeconds: number;
  joinedPlayerNames: string[];
  lobbyCreatorPlayerToken: string;
  isJoinable: boolean;
  currentGameId: number;
  privateLobbyKey: string;
  mode: "BASIC" | "ADVANCED";
};
