import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import styled from "styled-components";
import { LeaderBoard } from "../components/LeaderBoard";
import { Button, ThemeIcon, createStyles, rem } from "@mantine/core";
import { Player } from "../types/Player";
import { IconInfoCircle } from "@tabler/icons-react";

const ICON_SIZE = rem(60);

const useStyles = createStyles((theme) => ({
  icon: {
    position: "absolute",
    top: `calc(5% - ${ICON_SIZE} / 2)`,
    left: `calc(95% - ${ICON_SIZE} / 2)`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

const Application = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  // background-color: #dba11c;
  padding-top: 100px;
`;
const LeaderBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 38px;
  border: 1px solid black;
  border-radius: 10px;
  background-color: #f5f7f9;
  padding: 0 45px 65px 45px;
`;

type PropsType = {
  player: Player | undefined;
  currentGameRound: number;
};

export const ScoreBoard = (props: PropsType) => {
  const { classes } = useStyles();
  const { player, currentGameRound } = props;
  const { lobbyId } = useParams();
  const stompClient = useStompClient();
  const navigate = useNavigate();
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [playerScores, setPlayerScores] = useState<number[]>([]);
  const [correctGuesses, setCorrectGuesses] = useState<number[]>([]);
  const [timeUntilCorrectGuess, setTimeUntilCorrectGuess] = useState<number[]>(
    []
  );
  const [wrongGuesses, setWrongGuesses] = useState<number[]>([]);
  const [totalCorrectGuessesInARow, setTotalCorrectGuessesInARow] = useState<
    number[]
  >([]);

  // get the player token from session storage
  const playerToken = sessionStorage.getItem("FlagManiaToken");

  const playerName = player?.playerName;

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/score-board`,
    (message: any) => {
      const body = JSON.parse(message.body);
      const playerNames = body.playerNames as string[];
      const totalGameScores = body.totalGameScores as number[];
      const totalCorrectGuesses = body.totalCorrectGuesses as number[];
      const totalTimeUntilCorrectGuess =
        body.totalTimeUntilCorrectGuess as number[];
      const totalWrongGuesses = body.totalWrongGuesses as number[];
      const totalCorrectGuessesInARow =
        body.totalCorrectGuessesInARow as number[];
      console.log(totalCorrectGuessesInARow);

      setPlayerNames(playerNames);
      setPlayerScores(totalGameScores);
      setCorrectGuesses(totalCorrectGuesses);
      setTimeUntilCorrectGuess(totalTimeUntilCorrectGuess);
      setWrongGuesses(totalWrongGuesses);
      setTotalCorrectGuessesInARow(totalCorrectGuessesInARow);
    }
  );

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/round-start`,
    (message: any) => {
      navigate(`/game/${lobbyId}`);
    }
  );

  // publish message to start next round
  const startNextRound = () => {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/games/${lobbyId}/game-ready`,
        body: JSON.stringify({ playerToken }),
      });
    } else {
      console.error("Error: Could not send message");
    }
  };

  interface PlayerData {
    playerName: string;
    playerScore: number;
    correctGuesses: number;
    timeUntilCorrectGuess: number;
    wrongGuesses: number;
    totalCorrectGuessesInARow: number;
  }

  interface GameData {
    playerNames: string[];
    playerScores: number[];
    correctGuesses: number[];
    timeUntilCorrectGuess: number[];
    wrongGuesses: number[];
    totalCorrectGuessesInARow: number[];
  }

  // define data for leaderboard
  const data: GameData[] = [
    {
      playerNames: playerNames,
      playerScores: playerScores,
      correctGuesses: correctGuesses,
      timeUntilCorrectGuess: timeUntilCorrectGuess,
      wrongGuesses: wrongGuesses,
      totalCorrectGuessesInARow: totalCorrectGuessesInARow,
    },
  ];

  const playerData: PlayerData[] = data.flatMap((game) => {
    return game.playerNames.map((name, index) => {
      return {
        playerName: name,
        playerScore: game.playerScores[index],
        correctGuesses: game.correctGuesses[index],
        timeUntilCorrectGuess: game.timeUntilCorrectGuess[index],
        wrongGuesses: game.wrongGuesses[index],
        totalCorrectGuessesInARow: game.totalCorrectGuessesInARow[index],
      };
    });
  });

  return (
    <Application>
      <ThemeIcon className={classes.icon} size={ICON_SIZE} radius={ICON_SIZE}>
        <IconInfoCircle
          size="2rem"
          stroke={1.5}
          onClick={() => navigate("/game/" + lobbyId + "/scoreInfo")}
          style={{ cursor: "pointer" }}
        />
      </ThemeIcon>
      <LeaderBoardContainer>
        <h1>Leaderboard of round {currentGameRound}</h1>
        <LeaderBoard playerData={playerData} />
        {player?.isCreator && (
          <Button
            size="xl"
            onClick={startNextRound}
            style={{ marginTop: "65px" }}
          >
            Start Next Round
          </Button>
        )}

        {/* <Button onClick={anotherGame}>Another Game</Button> */}
      </LeaderBoardContainer>
    </Application>
  );
};
