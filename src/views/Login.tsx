import { useState, useEffect, SetStateAction } from "react";
import styled from "styled-components";
import { httpPost } from "../helpers/httpService";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import Player from "../models/Player";
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
} from '@mantine/core';

const Application = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7f9;
`;

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;

//   border: 2px solid rgb(216, 216, 216);
//   border-radius: 10px;
//   padding: 16px 32px;
// `;

type props = {
  isActive: boolean;
};
// const Button = styled.button<props>`
// display: flex;
// width: 100%;  
// cursor: ${(props) => (props.isActive ? "pointer" : "not-allowed")};
//   text-align: center;
//   border: none;
//   padding: 16px 64px;
//   margin: 32px 0;
//   color: ${(props) => (props.isActive ? "white" : "gray")};

//   background-color: ${(props) =>
//     props.isActive ? "rgb(34, 139, 230)" : "lightgray"};
//   &:hover {
//     background-color: ${(props) => (props.isActive ? "#1c7ed6" : "lightgray")};
//   }
// `;

type PropsType = {
  setPlayer: React.Dispatch<React.SetStateAction<Player | undefined>>;
};

export const Login = (props: PropsType) => {
  const { setPlayer } = props;
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isFormFilledOut, setIsFormFilledOut] = useState(false);
  const navigate = useNavigate();

  const handleNameInputChange = (event: { currentTarget: { value: SetStateAction<string>; }; }) => {
    setNameInput(event.currentTarget.value);
  };

  const handlePasswordInputChange = (event: { currentTarget: { value: SetStateAction<string>; }; }) => {
    setPasswordInput(event.currentTarget.value);
  };

  useEffect(() => {
    const formCheck = () => {
      if (!nameInput) {
        return false;
      }
      if (!passwordInput) {
        return false;
      }
      return true;
    };
    setIsFormFilledOut(formCheck());
  }, [nameInput, passwordInput]);

  const loginUser = async () => {
    try {
      const res = await httpPost(
        "/login",
        {
          playerName: nameInput,
          password: passwordInput,
        },
        { headers: {} }
      );

      // Store the token into the session storage.
      sessionStorage.setItem("FlagManiaToken", res.headers.authorization);

      // Store the ID of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayerId", res.data.id);

      // Store the Name of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayer", res.data.playerName);

      // Store login status of the current user
      sessionStorage.setItem("loggedIn", "true");

      // show notification that player has successfully logged in
      notifications.show({
        title: "Success",
        message: "Welcome back, " + res.data.playerName + "!",
        color: "green",
      });
      setPlayer(res.data);
      navigate("/");
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err.message,
        color: "red",
      });
    }
  };

  return (
    <Application>
      <Container size="xl" my={40}>
        <Title
          align="center"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
        >
          Welcome back!
        </Title>
        <Text color="dimmed" size="xl" align="center" mt={5}>
          Do not have an account yet?{' '}
          <Anchor size="xl" component="button" onClick={() => navigate("/register")}>
            Create account
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
          <PasswordInput
            label="Password"
            placeholder="Password"
            value={passwordInput}
            onChange={handlePasswordInputChange}
            size="xl"
            required
            mt="md"
          />
          <Group position="apart" mt="lg">
            {/* <Anchor component="button" size="sm">
              Forgot password?
            </Anchor> */}
          </Group>
          <Button
            onClick={loginUser}
            disabled={!isFormFilledOut}
            fullWidth
            size="xl"
          >
            Sign in
          </Button>
        </Paper>
      </Container>
    </Application>
  );
};