import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  handleError,
  httpGet,
  httpPost,
  httpPut,
} from "../helpers/httpService";
import Player from "../models/Player";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Lobby from "../models/Lobby";
import { useEffectOnce } from "../customHooks/useEffectOnce";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 38px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  justify-content: center;
  align-items: center;
  height: 40vh;
`;

const LoginButton = styled.button<props>`
  cursor: ${(props) => (props.isActive ? "pointer" : "not-allowed")};
  text-align: center;
  border: none;
  padding: 16px 64px;
  margin: 32px 0;
  color: ${(props) => (props.isActive ? "white" : "gray")};

  background-color: ${(props) =>
    props.isActive ? "rgb(34, 139, 230)" : "lightgray"};
  &:hover {
    background-color: ${(props) => (props.isActive ? "#1c7ed6" : "lightgray")};
  }
`;

type props = {
  isActive: boolean;
};

type PropsType = {
  setLobby: Dispatch<SetStateAction<Lobby | undefined>>;
};

export const ExternalGameJoin = (props: PropsType) => {
  const { setLobby } = props;
  const [playerName, setPlayerName] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isFormFilledOut, setIsFormFilledOut] = useState(false);
  const navigate = useNavigate();
  const lobbyId = window.location.pathname.split("/")[2];

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

  useEffectOnce(() => {
    // check if user is already logged in
    if (sessionStorage.getItem("loggedIn") === "true") {
      const playerJoin = async () => {
        // define header and body
        const headers = {
          Authorization: sessionStorage.getItem("FlagManiaToken"),
        };
        // get lobby
        const lobby = await httpGet("/lobbies/" + lobbyId, { headers });
        console.log("set lobby: ", lobby.data);
        setLobby(lobby.data);

        // join game
        joinGame(lobby.data.privateLobbyKey);
      };
      playerJoin();
    }
  });

  const handleUserJoin = async (link: string) => {
    const password = "";
    try {
      const response = await httpPost(
        "/players",
        {
          playerName: playerName,
          password: password,
          permanent: false,
        },
        { headers: {} }
      );
      console.log(response.data);

      // Create a new Player instance from the JSON data in the response
      const player = new Player(response.data);
      console.log(player);

      // Store the token into the session storage.
      sessionStorage.setItem("FlagManiaToken", response.headers.authorization);

      // Store the ID of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayerId", player.id.toString());

      // Store the Name of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayer", player.playerName);

      // define header and body
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };

      // get lobby
      const lobby = await httpGet("/lobbies/" + lobbyId, { headers });
      console.log("set lobby: ", lobby.data);
      setLobby(lobby.data);

      // join game
      joinGame(lobby.data.privateLobbyKey);

      // catch errors
    } catch (error: any) {
      notifications.show({
        title: "Something went wrong",
        message: error.response.data.message,
        color: "red",
      });
    }
  };

  function handleLoginJoin() {
    if (showLogin) {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }

  const loginUserJoin = async () => {
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

      // define header and body
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };

      // get lobby
      const lobby = await httpGet("/lobbies/" + lobbyId, { headers });
      console.log("set lobby: ", lobby.data);
      setLobby(lobby.data);

      // show notification that player has successfully logged in
      notifications.show({
        title: "Success",
        message: "Welcome back, " + res.data.playerName + "!",
        color: "green",
      });

      // join game
      joinGame(lobby.data.privateLobbyKey);
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err.message,
        color: "red",
      });
    }
  };

  async function joinGame(privateLobbyKey: string) {
    const headers = { Authorization: sessionStorage.getItem("FlagManiaToken") };
    const body = {};
    const response = await httpPut(
      "/lobbies/" + lobbyId + "/join?privateLobbyKey=" + privateLobbyKey,
      body,
      { headers }
    );
    if (response.status === 204) {
      navigate("/lobbies/" + lobbyId);
    } else {
      notifications.show({
        title: "Error",
        message: response.status,
        color: "red",
      });
      throw new Error("Error joining game");
    }
  }

  return (
    <Container>
      <h1>FlagMania</h1>
      <p>Welcome to Flagmania, are you ready to join the game?</p>
      <ButtonContainer>
        <Button
          onClick={() => handleLoginJoin()}
          radius="md"
          mt="xl"
          size="md"
          style={{ display: "block", margin: "0 auto" }}
        >
          Toggle Login and Join
        </Button>
        {showLogin ? (
          <Container>
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
            <LoginButton
              isActive={isFormFilledOut}
              onClick={loginUserJoin}
              disabled={!isFormFilledOut}
            >
              Login and Join
            </LoginButton>
          </Container>
        ) : (
          <Container>
            <FloatingTextInput
              label="Name"
              onChange={(newVal: string) => setPlayerName(newVal)}
              value={playerName}
            />
            <Button
              disabled={!playerName}
              onClick={() => handleUserJoin("/lobbies/" + lobbyId)}
            >
              Join Game
            </Button>
          </Container>
        )}
      </ButtonContainer>
    </Container>
  );
};
