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
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Lobby } from "../types/Lobby";
import { Player } from "../types/Player";
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
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
  setCurrentGameRound: Dispatch<SetStateAction<number>>;
};

export const ExternalGameJoin = (props: PropsType) => {
  const { setLobby, setPlayer, setCurrentGameRound } = props;
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
        const response = await httpGet("/lobbies/" + lobbyId, { headers });

        // Create a new Lobby instance from the JSON data in the response
        const lobby = response.data;
        setLobby(lobby);

        // Store the name of the lobby into the local storage.
        sessionStorage.setItem("lobbyName", lobby.lobbyName);

        // Store the ID of the current game in sessionStorage
        sessionStorage.setItem("lobbyId", lobby.lobbyId.toString());

        // join game
        console.log("set lobby: ", lobby);
        joinGame(response.data.privateLobbyKey);
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

      // Create a new Player instance from the JSON data in the response
      const player = response.data;
      setPlayer(player);

      // Store the token into the session storage.
      sessionStorage.setItem("FlagManiaToken", response.headers.authorization);

      // Store the ID of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayerId", player.id.toString());

      // Store the Name of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayer", player.playerName);

      // Store login status of the current user
      sessionStorage.setItem("loggedIn", "false");

      // define header and body
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };

      // get lobby
      const res = await httpGet("/lobbies/" + lobbyId, { headers });

      // Create a new Lobby instance from the JSON data in the response
      const lobby = res.data;
      setLobby(lobby);
      console.log("set lobby: ", lobby);

      // Store the name of the lobby into the local storage.
      sessionStorage.setItem("lobbyName", lobby.lobbyName);

      // Store the ID of the current game in sessionStorage
      sessionStorage.setItem("lobbyId", lobby.lobbyId.toString());

      // join game

      joinGame(lobby.privateLobbyKey);

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

      setPlayer(res.data);

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
      const response = await httpGet("/lobbies/" + lobbyId, { headers });

      // show notification that player has successfully logged in
      notifications.show({
        title: "Success",
        message: "Welcome back, " + res.data.playerName + "!",
        color: "green",
      });

      // Create a new Lobby instance from the JSON data in the response
      const lobby = response.data;
      setLobby(lobby);
      console.log("set lobby: ", lobby);
      // Store the name of the lobby into the local storage.
      sessionStorage.setItem("lobbyName", lobby.lobbyName);

      // Store the ID of the current game in sessionStorage
      sessionStorage.setItem("lobbyId", lobby.lobbyId.toString());

      // join game

      joinGame(lobby.privateLobbyKey);
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err.response.data.message,
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
    console.log("put response: ", response);
    if (response.status === 204) {
      setCurrentGameRound(0);
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
