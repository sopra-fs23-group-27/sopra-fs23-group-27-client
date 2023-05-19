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
  nRoundsPlayed: number;
  numWrongGuesses: number;
  permanent: boolean;
  timeUntilCorrectGuess: number;
  totalCorrectGuesses: number;

  constructor(data = {}) {
    this.id = 0;
    this.playerName = "";
    this.isCreator = false;
    this.password = "";
    this.lobbyId = 0;
    this.nRoundsPlayed = 0;
    this.numWrongGuesses = 0;
    this.permanent = false;
    this.timeUntilCorrectGuess = 0;
    this.totalCorrectGuesses = 0;
    Object.assign(this, data);
  }
}
export default Player;
