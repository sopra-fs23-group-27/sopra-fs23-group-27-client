import {
  Button,
  Text,
  Title,
  Group,
  Paper,
  TextInput,
  PasswordInput,
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

interface UserCardImageProps {
  player: Player | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
}

export function UserCardImage({ player, setPlayer }: UserCardImageProps) {
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordRepetitionInput, setPasswordRepetitionInput] = useState("");
  const [isFormFilledOut, setIsFormFilledOut] = useState(false);
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
      </Container>
    </Application>
  );
}
