import { createStyles, Table, Progress, Anchor, Text, Group, ScrollArea, rem } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  progressBar: {
    '&:not(:first-of-type)': {
      borderLeft: `${rem(3)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
      }`,
    },
  },
}));

interface PlayerData {
  playerName: string;
  playerScore: number;
  correctGuesses: number;
  timeUntilCorrectGuess: number;
  wrongGuesses: number;
}

interface LeaderBoardProps {
  playerData: PlayerData[];
}

export function LeaderBoard({ playerData }: LeaderBoardProps) {

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

  // calculate time per answer
  const timePerAnswer = playerData.map((row) => {
    const totalTime = row.timeUntilCorrectGuess as unknown as number;
    if (row.correctGuesses === 0) return totalTime;
    const timeUntilCorrectGuess = totalTime / row.correctGuesses;
    return timeUntilCorrectGuess;
  });

    return (
      <ScrollArea>
        <Table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
              <th>Correct Guesses</th>
              <th>Time Until Correct Guess</th>
              <th>Answer Distribution (Correct/Wrong)</th>
            </tr>
          </thead>
          <tbody>
            {playerData.map((row, index) => {
              return (
                <tr key={index}>
                  <td>{rank[index]}</td>
                  <td>
                    <Anchor component="button" fz="sm">
                      {row.playerName}
                    </Anchor>
                  </td>
                  <td>{row.playerScore}</td>
                  <td>{row.correctGuesses}</td>
                  <td>{timePerAnswer[index]} seconds</td>
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
                          color: theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[6],
                        },
                        {
                          value: answerDistribution[index][1],
                          color: theme.colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[6],
                        },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </ScrollArea>
    );
}