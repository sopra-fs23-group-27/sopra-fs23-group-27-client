import { RingProgress, Text, SimpleGrid, Paper, Center, Group } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight, Icon360, IconClock } from '@tabler/icons-react';

interface UserStatsProps {
  userData: {
    label: string;
    stats: number | string;
    progress: number;
    color: string;
    icon: 'up' | 'down' | '360' | 'clock';
  }[];
}

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
  '360': Icon360,
  clock: IconClock,
};

export function UserStats({ userData }: UserStatsProps) {
  const stats = userData.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label}>
        <Group position="center">
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon size="1.4rem" stroke={1.5} />
              </Center>
            }
          />

          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              {stat.label}
            </Text>
            <Text weight={700} size="xl">
              {stat.stats}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return (
    <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
      {stats}
    </SimpleGrid>
  );
}