/**
 * Lobby model
 */
class Lobby {
    lobbyId: number;
    lobbyName: string;
    isPublic: boolean;
    numSeconds: number;
    joinedPlayerNames: string[];
    lobbyCreatorPlayerToken: string;
    isJoinable: boolean;
    currentGameId: number;
    privateLobbyKey: string;
    constructor(data = {}) {
        this.lobbyId = 0;
        this.lobbyName = "";
        this.isPublic = false;
        this.numSeconds = 0;
        this.joinedPlayerNames = [];
        this.lobbyCreatorPlayerToken = "";
        this.isJoinable = false;
        this.currentGameId = 0;
        this.privateLobbyKey = "";
        Object.assign(this, data);
    }
}
  export default Lobby;