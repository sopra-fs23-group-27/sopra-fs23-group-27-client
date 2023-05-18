import { RingProgress, Text, SimpleGrid, Paper, Center, Group } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface UserStatsProps {
  userData: {
    link: string;
    label: string;
    stats: number | string;
    progress: number;
    color: string;
    icon: 'up' | 'down';
  }[];
}

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};

export function UserStats({ userData }: UserStatsProps) {
  const navigate = useNavigate();
  const stats = userData.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label}>
        <Group onClick={() => navigate(stat.link)} position="center" style={{ cursor: 'pointer' }}>
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
    <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
      {stats}
    </SimpleGrid>
  );
}