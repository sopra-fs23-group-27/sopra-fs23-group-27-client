import {
  Button,
  Text,
  Title,
  Group,
  Paper,
  TextInput,
  PasswordInput,
  createStyles,
  rem,
} from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { httpPut } from "../helpers/httpService";
import { notifications } from "@mantine/notifications";
import { Player } from "../types/Player";

const Application = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 38px;
  color: black;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 64px;
  align-items: center;
  background-color: transparent;
`;

type props = {
  isActive: boolean;
};

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
  wrapper: {
    position: "relative",
    boxSizing: "border-box",
  },

  inner: {
    position: "relative",
    paddingTop: rem(200),
    paddingBottom: rem(120),

    [theme.fn.smallerThan("sm")]: {
      paddingBottom: rem(80),
      paddingTop: rem(80),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(62),
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(42),
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: rem(24),

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(18),
    },
  },

  controls: {
    marginTop: `calc(${theme.spacing.xl} * 2)`,

    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: rem(54),
    paddingLeft: rem(38),
    paddingRight: rem(38),

    [theme.fn.smallerThan("sm")]: {
      height: rem(54),
      paddingLeft: rem(18),
      paddingRight: rem(18),
      flex: 1,
    },
  },
}));

interface UserCardImageProps {
  player: Player | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
}

export function UserCardImage({ player, setPlayer }: UserCardImageProps) {
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordRepetitionInput, setPasswordRepetitionInput] = useState("");
  const [isFormFilledOut, setIsFormFilledOut] = useState(false);
  const { classes } = useStyles();
  const navigate = useNavigate();

  const handleNameInputChange = (event: {
    currentTarget: { value: SetStateAction<string> };
  }) => {
    setNameInput(event.currentTarget.value);
  };

  const handlePasswordInputChange = (event: {
    currentTarget: { value: SetStateAction<string> };
  }) => {
    setPasswordInput(event.currentTarget.value);
  };

  const handlePasswordRepetitionInputChange = (event: {
    currentTarget: { value: SetStateAction<string> };
  }) => {
    setPasswordRepetitionInput(event.currentTarget.value);
  };

  useEffect(() => {
    const formCheck = () => {
      if (!nameInput && !passwordInput && !passwordRepetitionInput) {
        return false;
      }

      if (passwordInput && passwordInput.length < 6) {
        return false;
      }
      if (passwordInput && passwordInput !== passwordRepetitionInput) {
        return false;
      }

      return true;
    };

    setIsFormFilledOut(formCheck());
  }, [nameInput, passwordInput, passwordRepetitionInput]);

  const updateUser = async () => {
    try {
      const res = await httpPut(
        "/players/" + sessionStorage.getItem("currentPlayerId"),
        {
          playerName: nameInput,
          password: passwordInput,
        },
        { headers: { Authorization: sessionStorage.getItem("FlagManiaToken") } }
      );

      // store the new token in sessionStorage
      sessionStorage.setItem("FlagManiaToken", res.headers.authorization);

      // Store the new name (if applicable) of the currently logged-in user in sessionStorage
      if (nameInput) {
        setPlayer(res.data);
      }

      // use the new name (if applicable) of the currently logged-in user
      const currentName = nameInput ? nameInput : player?.playerName;

      // show notification that player has been registered
      notifications.show({
        title: "Success",
        message: "Looking good, " + currentName + "!",
        color: "green",
      });
      navigate("/login");
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err.response.data.message,
        color: "red",
      });
    }
  };

  return (
    <Application>
      <Container>
        <Title order={1}>Update current user: {player?.playerName}</Title>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Username"
            placeholder="Username"
            value={nameInput}
            onChange={handleNameInputChange}
            size="xl"
          />
          <Text color="dimmed" size="md" align="center" mt={5}>
            Minimum password length: 6 characters
          </Text>
          <PasswordInput
            label="Password"
            placeholder="Password"
            value={passwordInput}
            onChange={handlePasswordInputChange}
            size="xl"
            mt="md"
          />
          <PasswordInput
            label="Password"
            placeholder="repeat Password"
            value={passwordRepetitionInput}
            onChange={handlePasswordRepetitionInputChange}
            size="xl"
            mt="md"
          />
          <Group position="apart" mt="lg"></Group>
          <Text color="dimmed" size="md" align="center" mt={5}>
            Update at least one field to update your profile
          </Text>
          <Button
            onClick={updateUser}
            disabled={!isFormFilledOut}
            fullWidth
            size="xl"
          >
            Update profile
          </Button>
        </Paper>
        <Group className={classes.controls}>
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            onClick={() => navigate("/")}
          >
            Back to dashboard
          </Button>
        </Group>
      </Container>
    </Application>
  );
}
