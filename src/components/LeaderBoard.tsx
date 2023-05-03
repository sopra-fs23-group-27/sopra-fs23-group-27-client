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

interface TableReviewsProps {
  data: {
    playerScores: any,
    winner: any,
    winnerScore: any,
    loser: any,
    loserScore: any,
    tie: any,
  }[];
}

export function LeaderBoard({ data }: TableReviewsProps) {
  const { classes, theme } = useStyles();

  const rows = data.map((row) => {
    // TODO: get data by subscribing to endpoint
    const rank = 0; // TODO: calculate rank and answer distribution
    const totalScore = row.playerScores;
    // const positiveReviews = (row.reviews.positive / totalReviews) * 100;
    // const negativeReviews = (row.reviews.negative / totalReviews) * 100;

    return (
      <tr key={row.winner}>
        <td>
          <Anchor component="button" fz="sm">
            {row.winner}
          </Anchor>
        </td>
        <td>{row.winnerScore}</td>
        <td>
          <Anchor component="button" fz="sm">
            {row.loser}
          </Anchor>
        </td>
        <td>{Intl.NumberFormat().format(totalScore)}</td>
        <td>
          <Group position="apart">
            <Text fz="xs" c="teal" weight={700}>
              {row.winnerScore.toFixed(0)}%
            </Text>
            <Text fz="xs" c="red" weight={700}>
              {row.loserScore.toFixed(0)}%
            </Text>
          </Group>
          <Progress
            classNames={{ bar: classes.progressBar }}
            sections={[
              {
                value: row.winnerScore,
                color: theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[6],
              },
              {
                value: row.loserScore,
                color: theme.colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[6],
              },
            ]}
          />
        </td>
      </tr>
    );
  });

  return (
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Points</th>
            <th>Time per Answer</th>
            <th>Reviews distribution</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}