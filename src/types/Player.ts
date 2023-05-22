export type Player = {
    id: number;
    playerName: string;
    isCreator: boolean;
    password: string;
    token: string;
    wsConnectionId: string;
    lobbyId: number | null;
    nRoundsPlayed: number;
    numWrongGuesses: number;
    permanent: boolean;
    timeUntilCorrectGuess: number;
    totalCorrectGuesses: number;
  };