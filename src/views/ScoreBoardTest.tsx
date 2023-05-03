import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { useEffectOnce } from "../customHooks/useEffectOnce";
import styled from "styled-components";
import { LeaderBoard } from "../components/LeaderBoard";
import { Button } from "@mantine/core";

const LeaderBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 38px;
`;

export const ScoreBoardTest = () => {
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
  const playerToken = localStorage.getItem("token");

  // get the player name from local storage
  const playerName = localStorage.getItem("playerName");

  // // define data for leaderboard
  // const data = [
  //     {
  //         playerNames: playerNames,
  //         playerScores: playerScores,
  //         correctGuesses: correctGuesses,
  //         timeUntilCorrectGuess: timeUntilCorrectGuess,
  //         wrongGuesses: wrongGuesses
  //     }
  // ];

  useEffectOnce(() => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/authentication",
        body: JSON.stringify({ playerToken }),
      });
    } else {
      console.error("Error: Could not send message");
    }
  });
  useEffectOnce(() => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/authentication",
        body: JSON.stringify({ playerToken }),
      });
    } else {
      console.error("Error: Could not send message");
    }
  });

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
      console.log("Message from server: ", playerNames);
      console.log("Message from server: ", totalGameScores);
      console.log("Message from server: ", totalCorrectGuesses);
      console.log("Message from server: ", totalTimeUntilCorrectGuess);
      console.log("Message from server: ", totalWrongGuesses);
      setPlayerNames(playerNames);
      setPlayerScores(totalGameScores);
      setCorrectGuesses(totalCorrectGuesses);
      setTimeUntilCorrectGuess(totalTimeUntilCorrectGuess);
      setWrongGuesses(totalWrongGuesses);
    }
  );

  const goToLobby = () => {
    navigate("/lobbies/" + lobbyId);
  };

  const anotherGame = () => {
    navigate("/lobbies/" + lobbyId);
  };

  interface PlayerData {
    playerName: string;
    playerScore: string;
    correctGuesses: string;
    timeUntilCorrectGuess: string;
    wrongGuesses: string;
  }

  interface GameData {
    playerNames: string[];
    playerScores: string[];
    correctGuesses: string[];
    timeUntilCorrectGuess: string[];
    wrongGuesses: string[];
  }

  const data: GameData[] = [
    {
      playerNames: ["Alice", "Bob", "Charlie"],
      playerScores: ["10", "20", "30"],
      correctGuesses: ["1", "2", "3"],
      timeUntilCorrectGuess: ["10", "20", "30"],
      wrongGuesses: ["5", "3", "2"],
    },
    {
      playerNames: ["David", "Eve", "Frank"],
      playerScores: ["30", "20", "10"],
      correctGuesses: ["3", "2", "1"],
      timeUntilCorrectGuess: ["15", "25", "35"],
      wrongGuesses: ["4", "6", "8"],
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

  interface LeaderBoardProps {
    playerData: PlayerData[];
  }

  return (
    <div>
      <LeaderBoardContainer>
        <h1>ScoreBoardTest</h1>
        <LeaderBoard playerData={playerData} />
        <Button onClick={goToLobby}>Go to Lobby</Button>
        {/* <Button onClick={anotherGame}>Another Game</Button> */}
      </LeaderBoardContainer>
    </div>
  );
};
