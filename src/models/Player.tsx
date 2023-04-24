/**
 * Player model
 */
class Player {
    id: number;
    playerName: string;
    isCreator: boolean;
    password: string;
    lobbyId: number;
    headers: any;
    constructor(data = {}) {
      this.id = 1;
      this.playerName = "";
      this.isCreator = true;
      this.password = "";
      this.lobbyId = 1;
      this.headers = {authorization: ""};
      Object.assign(this, data);
    }
  }
  export default Player;