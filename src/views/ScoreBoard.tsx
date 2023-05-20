import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { useEffectOnce } from "../customHooks/useEffectOnce";
import styled from "styled-components";
import { LeaderBoard } from "../components/LeaderBoard";
import { Button } from "@mantine/core";
import Player from "../models/Player";
import Logo from "../icons/DALL-E_FlagMania_Logo.png";

const LeaderBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 38px;
`;

type PropsType = {
  player: Player | undefined;
};

export const ScoreBoard = (props: PropsType) => {
  const { player } = props;
  const { lobbyId } = useParams();
  const stompClient = useStompClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [playerScores, setPlayerScores] = useState<number[]>([]);
  const [correctGuesses, setCorrectGuesses] = useState<number[]>([]);
  const [timeUntilCorrectGuess, setTimeUntilCorrectGuess] = useState<number[]>(
    []
  );
  const [wrongGuesses, setWrongGuesses] = useState<number[]>([]);
  const [winner, setWinner] = useState("");

  // get the player token from local storage
  const playerToken = sessionStorage.getItem("FlagManiaToken");

  // get the player name from local storage
  const playerName = sessionStorage.getItem("playerName");

  // useEffectOnce(() => {
  //   if (stompClient) {
  //     stompClient.publish({
  //       destination: "/app/authentication",
  //       body: JSON.stringify({ playerToken }),
  //     });
  //   } else {
  //     console.error("Error: Could not send message");
  //   }
  // });

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/score-board`,
    (message: any) => {
      setIsLoading(false);
      const playerNames = JSON.parse(message.body).playerNames as string[];
      const totalGameScores = JSON.parse(message.body)
        .totalGameScores as number[];
      const totalCorrectGuesses = JSON.parse(message.body)
        .totalCorrectGuesses as number[];
      const totalTimeUntilCorrectGuess = JSON.parse(message.body)
        .totalTimeUntilCorrectGuess as number[];
      const totalWrongGuesses = JSON.parse(message.body)
        .totalWrongGuesses as number[];

      setPlayerNames(playerNames);
      setPlayerScores(totalGameScores);
      setCorrectGuesses(totalCorrectGuesses);
      setTimeUntilCorrectGuess(totalTimeUntilCorrectGuess);
      setWrongGuesses(totalWrongGuesses);
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
  }

  interface GameData {
    playerNames: string[];
    playerScores: number[];
    correctGuesses: number[];
    timeUntilCorrectGuess: number[];
    wrongGuesses: number[];
  }

  // define data for leaderboard
  const data: GameData[] = [
    {
      playerNames: playerNames,
      playerScores: playerScores,
      correctGuesses: correctGuesses,
      timeUntilCorrectGuess: timeUntilCorrectGuess,
      wrongGuesses: wrongGuesses,
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
      };
    });
  });

  return (
    <div>
      <LeaderBoardContainer>
        <h1>ScoreBoard</h1>
        <LeaderBoard playerData={playerData} />
        {player?.isCreator && (
          <Button onClick={startNextRound}>Start Next Round</Button>
        )}

        {/* <Button onClick={anotherGame}>Another Game</Button> */}
      </LeaderBoardContainer>
    </div>
  );
};
