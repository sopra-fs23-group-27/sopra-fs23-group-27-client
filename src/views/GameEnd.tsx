import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useSubscription } from "react-stomp-hooks";
import { useState } from "react";

import { Button } from "@mantine/core";
import { Player } from "../types/Player";
import { RainbowLoader } from "../components/RainbowLoader";
import { Table } from "@mantine/core";
import "animate.css";

const Application = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
  justify-content: center;
  align-items: center;

  width: 80vw;
  min-height: 100vh;
  margin: auto;
`;

const Container = styled.div`
  display: flex;
  gap: 88px;
`;

const RankContainer = styled(Container)`
  justify-content: space-between;
  margin-top: 150px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  align-items: center;
  border: 0.0625rem solid #dee2e6;
  border-radius: 0.5rem;
  padding: 16px 28px;
  text-align: center;
  width: 250px;
  height: 350px;
  font-size: 1.2rem;
  background-color: white;
  overflow: hidden;

  box-shadow: blue 0px 0px 0px 2px inset, rgb(255, 255, 255) 10px -10px 0px -3px,
    rgb(31, 193, 27) 10px -10px, rgb(255, 255, 255) 20px -20px 0px -3px,
    rgb(255, 217, 19) 20px -20px, rgb(255, 255, 255) 30px -30px 0px -3px,
    rgb(255, 156, 85) 30px -30px, rgb(255, 255, 255) 40px -40px 0px -3px,
    rgb(255, 85, 85) 40px -40px;
`;
const H1 = styled.h1`
  margin: 0;
  padding: 0;
`;
const H2 = styled.h2`
  margin: 0;
  padding: 0;
`;
const P = styled.p`
  margin: 0;
  padding: 0;
`;
const FirstRankCard = styled(Card)`
  position: relative;
  bottom: 80px;
`;
const CurrentPlayerRow = styled.tr`
  border: 2px solid black;
`;
const ButtonContainer = styled(Container)`
  justify-content: center;
  gap: 32px;
  margin-bottom: 100px;
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
  const [playAgainTimer, setPlayAgainTimer] = useState<number>(10);

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/score-board`,
    (message: any) => {
      console.log("scoreboard: ", JSON.parse(message.body));

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
      setIsLoading(false);
    }
  );

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/timer-play-again`,
    (message: any) => {
      const parsedMessage = JSON.parse(message.body);
      const { time } = parsedMessage;
      console.log(time);
      setPlayAgainTimer(time);
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
  console.log(playerData);

  const adjustNameSize = (name: string) => {
    if (name.length <= 10) {
      return name;
    }
    const adjustedName = name.slice(0, 10) + "...";
    return adjustedName;
  };

  return (
    <>
      {isLoading ? (
        <RainbowLoader />
      ) : (
        <Application>
          <RankContainer>
            {playerData.length > 2 ? (
              <>
                <Card>
                  <H2>2.</H2>
                  <H1>{adjustNameSize(playerData[1]?.playerName)}</H1>
                  <P>{playerData[1]?.playerScore} points</P>
                </Card>
                <FirstRankCard className="animate__animated animate__fadeInUp animate__delay-1s">
                  <H2>1.</H2>
                  <H1>{adjustNameSize(playerData[0]?.playerName)}</H1>
                  <P>{playerData[0]?.playerScore} points</P>
                </FirstRankCard>
                <Card>
                  <H2>3.</H2>
                  <H1>{adjustNameSize(playerData[2]?.playerName)}</H1>
                  <P>{playerData[2]?.playerScore} points</P>
                </Card>
              </>
            ) : (
              <>
                <FirstRankCard className="animate__animated animate__fadeInUp animate__delay-1s">
                  <H2>1.</H2>
                  <H1>{adjustNameSize(playerData[0]?.playerName)}</H1>
                  <P>{playerData[0]?.playerScore} points</P>
                </FirstRankCard>

                <Card>
                  <H2>2.</H2>
                  <H1>{adjustNameSize(playerData[1]?.playerName)}</H1>
                  <P>{playerData[1]?.playerScore} points</P>
                </Card>
              </>
            )}
          </RankContainer>

          {playerData.length > 3 && (
            <Table
              fontSize="xl"
              horizontalSpacing="lg"
              withColumnBorders
              style={{ borderRadius: "0.5rem" }}
            >
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {playerData.slice(2).map((p, ind) => {
                  if (p.playerName === currentPlayer?.playerName) {
                    return (
                      <CurrentPlayerRow>
                        <td>{ind + 3 + 1}</td>
                        <td>{p.playerName}</td>
                        <td>{p.playerScore}</td>
                      </CurrentPlayerRow>
                    );
                  }
                  return (
                    <tr>
                      <td>{ind + 3 + 1}</td>
                      <td>{p.playerName}</td>
                      <td>{p.playerScore}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}

          <ButtonContainer>
            <Button
              size="xl"
              disabled={playAgainTimer === 0}
              onClick={() => navigate("/playAgain")}
            >
              Play again {playAgainTimer}
            </Button>
            <Button size="xl" onClick={() => navigate("/")}>
              Home
            </Button>

            {!currentPlayer?.permanent && (
              <Button size="xl" onClick={() => navigate("/saveStatsRegister")}>
                Register to save your stats
              </Button>
            )}
          </ButtonContainer>
        </Application>
      )}
    </>
  );
};
