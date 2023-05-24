import {
  createStyles,
  Table,
  Progress,
  Text,
  Group,
  ScrollArea,
  rem,
} from "@mantine/core";
import { Player } from "../types/Player";
import styled from "styled-components";

const useStyles = createStyles((theme) => ({
  progressBar: {
    "&:not(:first-of-type)": {
      borderLeft: `${rem(3)} solid ${
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
      }`,
    },
  },
}));

const CurrentPlayerRow = styled.tr`
  border: 2px solid black;
`;

interface PlayerData {
  playerName: string;
  playerScore: number;
  correctGuesses: number;
  timeUntilCorrectGuess: number;
  wrongGuesses: number;
  totalCorrectGuessesInARow: number;
  playerHasGuessed: number;
}

interface LeaderBoardProps {
  playerData: PlayerData[];
  currentPlayer: Player | undefined;
}

export function LeaderBoard({ playerData, currentPlayer }: LeaderBoardProps) {
  const { classes, theme } = useStyles();

  // calculate rank by score and sort players by rank
  playerData.sort((a, b) => {
    return b.playerScore - a.playerScore;
  });

  const rank = playerData.map((row) => {
    return playerData.indexOf(row) + 1;
  });

  // calculate answer distribution
  const answerDistribution = playerData.map((row) => {
    const correctGuesses = row.correctGuesses;
    const wrongGuesses = row.wrongGuesses;
    const totalGuesses = correctGuesses + wrongGuesses;
    if (correctGuesses === 0) return [0, 100, totalGuesses];
    const correctGuessesPercentage = (correctGuesses / totalGuesses) * 100;
    const wrongGuessesPercentage = (wrongGuesses / totalGuesses) * 100;
    return [correctGuessesPercentage, wrongGuessesPercentage, totalGuesses];
  });

  // time per answer for player with correct guess
  const timePerAnswer = playerData.map((row) => {
    if (row.timeUntilCorrectGuess === null) {
      return "";
    } else {
      return row.timeUntilCorrectGuess;
    }
  });

  return (
    <ScrollArea>
      <Table fontSize="lg" horizontalSpacing="lg">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Total Score</th>
            <th>Correct Guesses</th>
            <th>Time Until Guess</th>
            <th>Answer Distribution (Correct/Wrong)</th>
            <th>Bonus</th>
          </tr>
        </thead>
        <tbody>
          {playerData.map((row, index) => {
            if (row.playerName === currentPlayer?.playerName) {
              return (
                <CurrentPlayerRow key={index}>
                  <td>{rank[index]}</td>
                  <td>{row.playerName}</td>
                  <td>{row.playerScore}</td>
                  <td>{row.correctGuesses}</td>
                  {row.playerHasGuessed && timePerAnswer[index] ? (
                    <td>{timePerAnswer[index]} seconds</td>
                  ) : (
                    <td></td>
                  )}

                  <td>
                    <Group position="apart">
                      <Text fz="xs" c="teal" weight={700}>
                        {answerDistribution[index][0].toFixed(0)}%
                      </Text>
                      <Text fz="xs" c="red" weight={700}>
                        {answerDistribution[index][1].toFixed(0)}%
                      </Text>
                    </Group>
                    <Progress
                      classNames={{ bar: classes.progressBar }}
                      sections={[
                        {
                          value: answerDistribution[index][0],
                          color:
                            theme.colorScheme === "dark"
                              ? theme.colors.teal[9]
                              : theme.colors.teal[6],
                        },
                        {
                          value: answerDistribution[index][1],
                          color:
                            theme.colorScheme === "dark"
                              ? theme.colors.red[9]
                              : theme.colors.red[6],
                        },
                      ]}
                    />
                  </td>
                  <td>
                    {row.totalCorrectGuessesInARow >= 2 &&
                      `🔥 ${row.totalCorrectGuessesInARow} 🔥`}
                  </td>
                </CurrentPlayerRow>
              );
            }
            return (
              <tr key={index}>
                <td>{rank[index]}</td>
                <td>{row.playerName}</td>
                <td>{row.playerScore}</td>
                <td>{row.correctGuesses}</td>
                {row.playerHasGuessed && timePerAnswer[index] ? (
                  <td>{timePerAnswer[index]} seconds</td>
                ) : (
                  <td></td>
                )}

                <td>
                  <Group position="apart">
                    <Text fz="xs" c="teal" weight={700}>
                      {answerDistribution[index][0].toFixed(0)}%
                    </Text>
                    <Text fz="xs" c="red" weight={700}>
                      {answerDistribution[index][1].toFixed(0)}%
                    </Text>
                  </Group>
                  <Progress
                    classNames={{ bar: classes.progressBar }}
                    sections={[
                      {
                        value: answerDistribution[index][0],
                        color:
                          theme.colorScheme === "dark"
                            ? theme.colors.teal[9]
                            : theme.colors.teal[6],
                      },
                      {
                        value: answerDistribution[index][1],
                        color:
                          theme.colorScheme === "dark"
                            ? theme.colors.red[9]
                            : theme.colors.red[6],
                      },
                    ]}
                  />
                </td>
                <td>
                  {row.totalCorrectGuessesInARow >= 2 &&
                    `🔥 ${row.totalCorrectGuessesInARow} 🔥`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
