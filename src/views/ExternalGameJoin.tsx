import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { httpGet, httpPost, httpPut } from "../helpers/httpService";
import { Player } from "../types/Player";
import {
  Container,
  Button,
  Switch,
  TextInput,
  Title,
  Paper,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Lobby } from "../types/Lobby";
import { useEffectOnce } from "../customHooks/useEffectOnce";

const Application = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: #f5f7f9;
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
  player: Player | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
  setCurrentGameRound: Dispatch<SetStateAction<number>>;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

export const ExternalGameJoin = (props: PropsType) => {
  const { setLobby, player, setPlayer, setCurrentGameRound, setIsLoggedIn } =
    props;
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
    // check if user is logged in
    if (player) {
      const playerJoin = async () => {
        // define header and body
        const headers = {
          Authorization: sessionStorage.getItem("FlagManiaToken"),
        };
        // get lobby
        const response = await httpGet("/lobbies/" + lobbyId, { headers });

        // Set the lobby state variable using the data returned from the API
        const lobby = response.data as Lobby;
        setLobby(lobby);

        // join game
        console.log("set lobby: ", lobby);
        joinGame(response.data.privateLobbyKey);
      };
      playerJoin();
    }
  });

  const handleSetPlayerName = (event: {
    currentTarget: { value: SetStateAction<string> };
  }) => {
    setPlayerName(event.currentTarget.value);
  };

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

      // Set the player state variable using the data returned from the API
      const player = response.data as Player;
      setPlayer(player);
      setIsLoggedIn(false);

      // Store the token into the session storage.
      sessionStorage.setItem("FlagManiaToken", response.headers.authorization);

      // Store the ID of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayerId", player.id.toString());

      // define header and body
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };

      // get lobby
      const res = await httpGet("/lobbies/" + lobbyId, { headers });

      // Set the lobby state variable using the data returned from the API
      const lobby = res.data as Lobby;
      setLobby(lobby);
      console.log("set lobby: ", lobby);

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
      setIsLoggedIn(true);

      // Store the token into the session storage.
      sessionStorage.setItem("FlagManiaToken", res.headers.authorization);

      // Store the ID of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayerId", res.data.id);

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

      // Set the lobby state variable using the data returned from the API
      const lobby = response.data as Lobby;
      setLobby(lobby);

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
    <Application>
      <Container size="xl" my={40}>
        <Title>FlagMania</Title>
        <p>Welcome to Flagmania, are you ready to join the game?</p>
        <Switch
          onClick={() => handleLoginJoin()}
          size="xl"
          label="Toggle Login and Join"
        >
          Toggle Login and Join
        </Switch>
        {showLogin ? (
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              label="Name"
              value={nameInput}
              onChange={handleNameInputChange}
            />
            <TextInput
              label="Password"
              value={passwordInput}
              onChange={handlePasswordInputChange}
            />
            <LoginButton
              isActive={isFormFilledOut}
              disabled={!isFormFilledOut}
              onClick={loginUserJoin}
            >
              Login and Join
            </LoginButton>
          </Paper>
        ) : (
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              label="Name"
              onChange={handleSetPlayerName}
              value={playerName}
            />
            <Button
              disabled={!playerName}
              onClick={() => handleUserJoin("/lobbies/" + lobbyId)}
            >
              Join Game
            </Button>
          </Paper>
        )}
      </Container>
    </Application>
  );
};
