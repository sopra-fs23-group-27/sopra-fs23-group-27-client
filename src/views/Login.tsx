import { useState, useEffect } from "react";
import styled from "styled-components";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { httpPost } from "../helpers/httpService";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { Button as MantineButton } from "@mantine/core";
import Player from "../models/Player";

const Application = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #dba11c;
  //background-color: #f5f7f9;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;

  border: 2px solid black;
  border-radius: 10px;
  padding: 16px 32px;
  background-color: #f5f7f9;
`;

type props = {
  isActive: boolean;
};
const Button = styled.button<props>`
  cursor: ${(props) => (props.isActive ? "pointer" : "not-allowed")};
  text-align: center;
  border: none;
  padding: 16px 64px;
  margin: 32px 0;
  color: ${(props) => (props.isActive ? "white" : "gray")};
  font-size: 32px;
  background-color: ${(props) =>
    props.isActive ? "rgb(34, 139, 230)" : "lightgray"};
  &:hover {
    background-color: ${(props) => (props.isActive ? "#1c7ed6" : "lightgray")};
  }
`;

type PropsType = {
  setPlayer: React.Dispatch<React.SetStateAction<Player | undefined>>;
};

export const Login = (props: PropsType) => {
  const { setPlayer } = props;
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isFormFilledOut, setIsFormFilledOut] = useState(false);
  const navigate = useNavigate();

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
      <Container>
        <h1>Login</h1>
        <FloatingTextInput
          label="Name"
          value={nameInput}
          onChange={setNameInput}
        />
        <FloatingTextInput
          label="Password"
          value={passwordInput}
          onChange={setPasswordInput}
        />
        <Button
          isActive={isFormFilledOut}
          onClick={loginUser}
          disabled={!isFormFilledOut}
        >
          Login
        </Button>
        <p>Not an account yet?</p>
        <MantineButton size="lg" onClick={() => navigate("/register")}>
          Register
        </MantineButton>
      </Container>
    </Application>
  );
};
