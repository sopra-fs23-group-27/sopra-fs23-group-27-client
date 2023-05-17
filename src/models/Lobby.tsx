/**
 * Lobby model
 */
class Lobby {
  lobbyId: number;
  lobbyName: string;
  isPublic: boolean;
  numRounds: number;
  numSeconds: number;
  joinedPlayerNames: string[];
  lobbyCreatorPlayerToken: string;
  isJoinable: boolean;
  currentGameId: number;
  privateLobbyKey: string;
  mode: "BASIC" | "ADVANCED";
  constructor(data = {}) {
    this.lobbyId = 0;
    this.lobbyName = "";
    this.isPublic = false;
    this.numRounds = 5;
    this.numSeconds = 0;
    this.joinedPlayerNames = [];
    this.lobbyCreatorPlayerToken = "";
    this.isJoinable = false;
    this.currentGameId = 0;
    this.privateLobbyKey = "";
    this.mode = "BASIC";
    Object.assign(this, data);
  }
}
export default Lobby;
