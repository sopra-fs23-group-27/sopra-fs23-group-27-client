import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { useEffectOnce } from "../customHooks/useEffectOnce";
import styled from "styled-components";
import { LeaderBoard } from "../components/LeaderBoard";
import { Button } from "@mantine/core";
import Logo from "../icons/DALL-E_FlagMania_Logo.png";

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
  const playerToken = sessionStorage.getItem("FlagManiaToken");

  // get the player name from local storage
  const playerName = sessionStorage.getItem("playerName");

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

  // define mock data for leaderboard
  const data: GameData[] = [
    {
      playerNames: ["Player 1", "Player 2", "Player 3"],
      playerScores: [100, 200, 300],
      correctGuesses: [1, 2, 3],
      timeUntilCorrectGuess: [10, 20, 30],
      wrongGuesses: [1, 2, 3],
      totalCorrectGuessesInARow: [1, 2, 3],
    },
    {
      playerNames: ["Player 23", "Player 2", "Player 3"],
      playerScores: [100, 200, 300],
      correctGuesses: [1, 2, 3],
      timeUntilCorrectGuess: [10, 20, 30],
      wrongGuesses: [1, 2, 3],
      totalCorrectGuessesInARow: [1, 2, 3],
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
    <div>
      <img
        src={Logo}
        alt="FlagMania Logo"
        onClick={() => navigate("/")}
        style={{
          top: "10px",
          left: "10px",
          padding: "10px",
          width: "5%",
          height: "auto",
          position: "absolute",
          cursor: "pointer",
        }}
      />
      <LeaderBoardContainer>
        <h1>ScoreBoardTest</h1>
        <LeaderBoard playerData={playerData} />
        <Button onClick={goToLobby}>Go to Lobby</Button>
        {/* <Button onClick={anotherGame}>Another Game</Button> */}
      </LeaderBoardContainer>
    </div>
  );
};
