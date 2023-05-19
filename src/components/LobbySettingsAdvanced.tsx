import { createStyles, ThemeIcon, Progress, Text, Group, Badge, Paper, rem } from '@mantine/core';
import { IconLoader } from '@tabler/icons-react';

const ICON_SIZE = rem(60);

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    overflow: 'visible',
    padding: theme.spacing.xl,
    paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE} / 3)`,
  },

  icon: {
    position: 'absolute',
    top: `calc(-${ICON_SIZE} / 3)`,
    left: `calc(50% - ${ICON_SIZE} / 2)`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

interface advancedProps {
  lobbyId: string | undefined;
  lobbyName: string | undefined;
  continent: string | undefined;
  numberOfPlayers: number;
  numberOfRounds: number;
  showFirstHintAfter: number;
  hintsInterval: number;
  timeLimitPerRound: number;
}

export function LobbySettingsAdvanced(props: advancedProps) {
  const { classes } = useStyles();
  const { lobbyId, lobbyName, continent, numberOfPlayers, numberOfRounds, showFirstHintAfter, hintsInterval, timeLimitPerRound } = props;

  return (
    <Paper radius="md" withBorder className={classes.card} mt={`calc(${ICON_SIZE} / 3)`}>
      <ThemeIcon className={classes.icon} size={ICON_SIZE} radius={ICON_SIZE}>
        <IconLoader size="2rem" stroke={1.5} />
      </ThemeIcon>

      <Text ta="center" fw={700} className={classes.title}>
        Game Lobby {lobbyId}: {lobbyName}
      </Text>
      <Text c="dimmed" ta="center" fz="sm">
      {continent} (Advanced Mode)
      </Text>

      <Group position="apart" mt="xs">
        <Text fz="sm" color="dimmed">
          Number of rounds
        </Text>
        <Text fz="sm" color="dimmed">
          {numberOfRounds}
        </Text>
      </Group>

      <Progress value={62} mt={6} />

      <Group position="apart" mt="xs">
        <Text fz="sm" color="dimmed">
          First hint after 
        </Text>
        <Text fz="sm" color="dimmed">
          {showFirstHintAfter}
        </Text>
      </Group>

      <Progress value={62} mt={5} />

      <Group position="apart" mt="xs">
        <Text fz="sm" color="dimmed">
          Hints interval
        </Text>
        <Text fz="sm" color="dimmed">
          {hintsInterval}
        </Text>
      </Group>

      <Progress value={62} mt={5} />

      <Group position="apart" mt="xs">
        <Text fz="sm" color="dimmed">
          Time limit per round
        </Text>
        <Text fz="sm" color="dimmed">
          {timeLimitPerRound}
        </Text>
      </Group>

      <Progress value={62} mt={5} />

      <Group position="apart" mt="md">
        <Text fz="sm">{numberOfPlayers} joined</Text>
        <Badge size="sm">Waiting for players to join...</Badge>
      </Group>
    </Paper>
  );
}