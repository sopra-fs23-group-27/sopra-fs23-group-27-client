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
      this.id = 0;
      this.playerName = "";
      this.isCreator = true;
      this.password = "";
      this.lobbyId = 0;
      Object.assign(this, data);
    }
  }
  export default Player;