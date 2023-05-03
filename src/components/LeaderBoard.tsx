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
    wrongGuesses: ["5", "3", "2"]
  },
  {
    playerNames: ["David", "Eve", "Frank"],
    playerScores: ["30", "20", "10"],
    correctGuesses: ["3", "2", "1"],
    timeUntilCorrectGuess: ["15", "25", "35"],
    wrongGuesses: ["4", "6", "8"]
  }
];

const playerData: PlayerData[] = data.flatMap((game) => {
  return game.playerNames.map((name, index) => {
    return {
      playerName: name,
      playerScore: game.playerScores[index],
      correctGuesses: game.correctGuesses[index],
      timeUntilCorrectGuess: game.timeUntilCorrectGuess[index],
      wrongGuesses: game.wrongGuesses[index]
    };
  });
});

interface LeaderBoardProps {
  playerData: PlayerData[];
}

export function LeaderBoard({ playerData }: LeaderBoardProps) {

  const { classes, theme } = useStyles();

  // calculate rank by score and sort players by rank
  playerData.sort((a, b) => {
    return parseInt(b.playerScore) - parseInt(a.playerScore);
  });

  const rank = playerData.map((row) => {
    return playerData.indexOf(row) + 1;
  });

  // calculate answer distribution
  const answerDistribution = playerData.map((row) => {
    const correctGuesses = parseInt(row.correctGuesses);
    const wrongGuesses = parseInt(row.wrongGuesses);
    const totalGuesses = correctGuesses + wrongGuesses;
    const correctGuessesPercentage = (correctGuesses / totalGuesses) * 100;
    const wrongGuessesPercentage = (wrongGuesses / totalGuesses) * 100;
    return [correctGuessesPercentage, wrongGuessesPercentage, totalGuesses];
  });

  // calculate time per answer
  const timePerAnswer = playerData.map((row) => {
    const totalTime = row.timeUntilCorrectGuess as unknown as number;
    const timeUntilCorrectGuess = totalTime / parseInt(row.correctGuesses);
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



// export function LeaderBoard({ data }: GameData) {
//   const { classes, theme } = useStyles();

  // const rows = data.map((row) => {
  //   const totalScore = row.playerScores;
  //   const positiveReviews = (0.8) * 100;
  //   const negativeReviews = (0.2) * 100;

//     return (
//       <tr key={row.winner}>
//         <td>
//           <Anchor component="button" fz="sm">
//             {row.winner}
//           </Anchor>
//         </td>
//         <td>{row.winnerScore}</td>
//         <td>
//           <Anchor component="button" fz="sm">
//             {row.loser}
//           </Anchor>
//         </td>
//         <td>{Intl.NumberFormat().format(totalScore)}</td>
//         <td>
//           <Group position="apart">
//             <Text fz="xs" c="teal" weight={700}>
//               {positiveReviews.toFixed(0)}%
//             </Text>
//             <Text fz="xs" c="red" weight={700}>
//               {negativeReviews.toFixed(0)}%
//             </Text>
//           </Group>
//           <Progress
//             classNames={{ bar: classes.progressBar }}
//             sections={[
//               {
//                 value: positiveReviews,
//                 color: theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[6],
//               },
//               {
//                 value: negativeReviews,
//                 color: theme.colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[6],
//               },
//             ]}
//           />
//         </td>
//       </tr>
//     );
//   });

//   return (
//     <ScrollArea>
//       <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
//         <thead>
//           <tr>
//             <th>Rank</th>
//             <th>Player</th>
//             <th>Points</th>
//             <th>Time per Answer</th>
//             <th>Answer distribution</th>
//           </tr>
//         </thead>
//         <tbody>{rows}</tbody>
//       </Table>
//     </ScrollArea>
//   );
// }