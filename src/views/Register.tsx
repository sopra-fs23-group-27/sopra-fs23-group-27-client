import styled from "styled-components";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { httpPost } from "../helpers/httpService";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { Player } from "../types/Player";

import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Group,
} from "@mantine/core";

const Application = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  //background-color: #f5f7f9;
  // background-color: #dba11c;
`;

type PropsType = {
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};
export const Register = (props: PropsType) => {
  const { setPlayer, setIsLoggedIn } = props;
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
      if (!nameInput) {
        return false;
      }

      if (passwordInput.length < 6) {
        return false;
      }
      if (passwordInput !== passwordRepetitionInput) {
        return false;
      }

      return true;
    };

    setIsFormFilledOut(formCheck());
  }, [nameInput, passwordInput, passwordRepetitionInput]);

  const registerUser = async () => {
    try {
      const res = await httpPost(
        "/registration",
        {
          playerName: nameInput,
          password: passwordInput,
          permanent: true,
        },
        { headers: {} }
      );
      setPlayer(res.data);
      setIsLoggedIn(true);
      console.log("new permanent player created: ", res.data);

      // Store the token into the session storage.
      sessionStorage.setItem("FlagManiaToken", res.headers.authorization);

      // Store the ID of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayerId", res.data.id);

      // show notification that player has been registered
      notifications.show({
        title: "Success",
        message: "Welcome to the party, " + res.data.playerName + "!",
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
      <Container size="xl" my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Register to join the party!
        </Title>
        <Text color="dimmed" size="xl" align="center" mt={5}>
          Already have an account?{" "}
          <Anchor
            size="xl"
            component="button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Username"
            placeholder="Username"
            value={nameInput}
            onChange={handleNameInputChange}
            size="xl"
            required
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
            required
            mt="md"
          />
          <PasswordInput
            label="Password"
            placeholder="repeat Password"
            value={passwordRepetitionInput}
            onChange={handlePasswordRepetitionInputChange}
            size="xl"
            required
            mt="md"
          />
          <Group position="apart" mt="lg"></Group>
          <Button
            onClick={registerUser}
            disabled={!isFormFilledOut}
            fullWidth
            size="xl"
          >
            Register
          </Button>
        </Paper>
      </Container>
    </Application>
  );
};
