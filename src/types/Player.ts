export type Player = {
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
  };