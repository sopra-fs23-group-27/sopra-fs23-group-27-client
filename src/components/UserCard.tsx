import {
  createStyles,
  Card,
  Avatar,
  Text,
  Group,
  Button,
  rem,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  avatar: {
    border: `${rem(2)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
    }`,
  },
}));

interface UserCardImageProps {
  name: string;
  stats: { label: string; value: string }[];
}

export function UserCardImage({ name, stats }: UserCardImageProps) {
  const { classes, theme } = useStyles();
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const navigate = useNavigate();

  function handleUpdateProfile() {
    if (showUpdateProfile) {
      setShowUpdateProfile(false);
    } else {
      setShowUpdateProfile(true);
    }
  }

  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text ta="center" fz="lg" fw={500}>
        {stat.value}
      </Text>
      <Text ta="center" fz="sm" c="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder padding="xl" radius="md" className={classes.card}>
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {name}
      </Text>
      <Group mt="md" position="center" spacing={30}>
        {items}
      </Group>
      <Button
        onClick={() => handleUpdateProfile()}
        fullWidth
        radius="md"
        mt="xl"
        size="md"
        color={theme.colorScheme === "dark" ? undefined : "dark"}
      >
        Update Profile
      </Button>
      {showUpdateProfile ? <div> Hello </div> : <div> Bye </div>}
    </Card>
  );
}
