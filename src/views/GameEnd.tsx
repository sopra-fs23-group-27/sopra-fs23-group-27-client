import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useSubscription } from "react-stomp-hooks";
import { useState } from "react";

import { Button } from "@mantine/core";
import Player from "../models/Player";
import { RainbowLoader } from "../components/RainbowLoader";

const Application = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
  justify-content: center;
  align-items: center;

  width: 80vw;
  height: 90vh;
  margin: auto;
`;

const Container = styled.div`
  width: 60%;
  display: flex;
`;
const UpperRankContainer = styled(Container)`
  justify-content: center;
`;
const LowerRankContainer = styled(Container)`
  justify-content: space-between;
`;

const Card = styled.div`
  border: 0.0625rem solid #dee2e6;
  border-radius: 0.5rem;
  padding: 16px 28px;
  text-align: center;
  width: 190px;

  box-shadow: blue 0px 0px 0px 2px inset, rgb(255, 255, 255) 10px -10px 0px -3px,
    rgb(31, 193, 27) 10px -10px, rgb(255, 255, 255) 20px -20px 0px -3px,
    rgb(255, 217, 19) 20px -20px, rgb(255, 255, 255) 30px -30px 0px -3px,
    rgb(255, 156, 85) 30px -30px, rgb(255, 255, 255) 40px -40px 0px -3px,
    rgb(255, 85, 85) 40px -40px;
`;
const FirstRankCard = styled(Card)`
  position: relative;
  top: 200px;
`;
const InvisibleCard = styled(Card)`
  color: rgba(0, 0, 0, 0);
  background: rgba(0, 0, 0, 0);
  border: none;
  box-shadow: none;
`;
const ButtonContainer = styled(Container)`
  justify-content: center;
  gap: 32px;
`;

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

type PropsType = {
  player: Player | undefined;
};
export const GameEnd = (props: PropsType) => {
  const { player: currentPlayer } = props;
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [playerScores, setPlayerScores] = useState<number[]>([]);
  const [correctGuesses, setCorrectGuesses] = useState<number[]>([]);
  const [timeUntilCorrectGuess, setTimeUntilCorrectGuess] = useState<number[]>(
    []
  );
  const [wrongGuesses, setWrongGuesses] = useState<number[]>([]);

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/score-board`,
    (message: any) => {
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
      setIsLoading(false);
    }
  );

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
  playerData.sort((a, b) => b.playerScore - a.playerScore);

  const isPlayerInTopThree = () => {
    if (
      currentPlayer?.playerName === playerData[0]?.playerName ||
      currentPlayer?.playerName === playerData[1]?.playerName ||
      currentPlayer?.playerName === playerData[2]?.playerName
    ) {
      return true;
    }
    return false;
  };
  const getCurrentPlayerRank = () => {
    if (playerData[0]) {
      for (let i: number = 0; i < playerData.length; i++) {
        if (playerData[i].playerName === currentPlayer?.playerName) {
          return i + 1;
        }
      }
    }
    return 0;
  };
  const getCurrentPlayerScore = () => {
    if (playerData[0]) {
      const player: any = playerData.find(
        (p) => p.playerName === currentPlayer?.playerName
      );
      return player.playerScore;
    }
    return 0;
  };

  return (
    <Application>
      <UpperRankContainer>
        <FirstRankCard>
          <h2>1.</h2>
          <h1>{playerData[0]?.playerName}</h1>
          <p>{playerData[0]?.playerScore} points</p>
        </FirstRankCard>
      </UpperRankContainer>
      <LowerRankContainer>
        <Card>
          <h2>2.</h2>
          <h1>{playerData[1]?.playerName}</h1>
          <p>{playerData[1]?.playerScore} points</p>
        </Card>

        {playerData[2]?.playerName ? (
          <Card>
            <h2>3.</h2>
            <h1>{playerData[2]?.playerName}</h1>
            <p>{playerData[2]?.playerScore} points</p>
          </Card>
        ) : (
          <InvisibleCard />
        )}
      </LowerRankContainer>

      {!isPlayerInTopThree() && (
        <Container>
          Your Rank: {getCurrentPlayerRank()}, with {getCurrentPlayerScore()}{" "}
          points
        </Container>
      )}

      <ButtonContainer>
        <Button disabled={false} onClick={() => navigate(`/game/${lobbyId}`)}>
          Play again
        </Button>
        <Button disabled={false} onClick={() => navigate("/register")}>
          Register to save your stats
        </Button>
      </ButtonContainer>
    </Application>
  );
};
