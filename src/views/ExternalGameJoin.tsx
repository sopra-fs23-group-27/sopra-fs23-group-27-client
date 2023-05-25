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
  PasswordInput,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Lobby } from "../types/Lobby";

const Application = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: #f5f7f9;
`;

type PropsType = {
  setLobby: Dispatch<SetStateAction<Lobby | undefined>>;
  player: Player | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
  setCurrentGameRound: Dispatch<SetStateAction<number>>;
};

export const ExternalGameJoin = (props: PropsType) => {
  const { setLobby, player, setPlayer, setCurrentGameRound } = props;
  const [playerName, setPlayerName] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isFormFilledOut, setIsFormFilledOut] = useState(false);
  const navigate = useNavigate();
  const lobbyId = window.location.pathname.split("/")[2];

  // privateLobbyKey, string after question mark in url, otherwise empty string
  const privateLobbyKey = window.location.search.split("?key=")[1] || "";

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

  useEffect(() => {
    const delay = 20; // 20 milliseconds

    const timer = setTimeout(() => {
      // check if user is logged in
      if (player) {
        const playerJoin = async () => {
          // define header and body
          const headers = {
            Authorization: sessionStorage.getItem("FlagManiaToken"),
          };
          try {
            // get lobby
            const response = await httpGet("/lobbies/" + lobbyId, { headers });

            // Set the lobby state variable using the data returned from the API
            const lobby = response.data as Lobby;
            setLobby(lobby);

            // join game
            console.log("set lobby: ", lobby);
            console.log(window.location);
            console.log(privateLobbyKey);
            joinGame(privateLobbyKey, player.playerName);
          } catch (error: any) {
            notifications.show({
              title: "Something went wrong",
              message: error.response.data.message,
              color: "red",
            });
            console.error(error);
          }
        };
        playerJoin();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [player, lobbyId, privateLobbyKey]);

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

      // Store the token into the session storage.
      sessionStorage.setItem("FlagManiaToken", response.headers.authorization);

      // Store the ID of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayerId", player.id.toString());

      // define header and body
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };

      // get lobby
      try {
        const res = await httpGet("/lobbies/" + lobbyId, { headers });
        const lobby = res.data as Lobby;
        if (!lobby.isPublic && lobby.privateLobbyKey !== privateLobbyKey) {
          setPlayer(undefined);
          setLobby(undefined);
          sessionStorage.clear();
          navigate("/");

          notifications.show({
            title: "Invalid URL!",
            message: "Please use the correct link to join a game",
            color: "red",
          });

          return;
        }
        setLobby(lobby);
        console.log("set lobby: ", lobby);

        // join game
        joinGame(privateLobbyKey, player.playerName);
      } catch (error: any) {
        notifications.show({
          title: "Something went wrong",
          message: error.response.data.message,
          color: "red",
        });
      }

      // Set the lobby state variable using the data returned from the API

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

  const handleLogout = async () => {
    // get player id from session storage
    const playerId = sessionStorage.getItem("currentPlayerId");
    console.log("playerId when logging out: ", playerId);
    try {
      await httpPost(
        `/players/${playerId}/logout?playerId=${playerId}`,
        {},
        {
          headers: {
            Authorization: sessionStorage.getItem("FlagManiaToken"),
          },
        }
      );
      notifications.show({
        title: "Invalid key!",
        message:
          "You just got kicked from the game for trying to join a private lobby without the correct key!",
        color: "red",
      });

      // set player to undefined
      setPlayer(undefined);

      // reset the session storage
      sessionStorage.clear();
      navigate("/");
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.response.data.message,
        color: "red",
      });
      console.error();
    }
  };

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

      // Set the player state variable using the data returned from the API
      setPlayer(res.data);

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

      // Set the lobby state variable using the data returned from the API
      const lobby = response.data as Lobby;
      setLobby(lobby);

      // join game
      joinGame(privateLobbyKey, res.data.playerName);
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err.response.data.message,
        color: "red",
      });
    }
  };

  async function joinGame(privateLobbyKey: string, playerName: string) {
    const headers = { Authorization: sessionStorage.getItem("FlagManiaToken") };
    const body = {};
    try {
      console.log("lobbyId: ", lobbyId);
      console.log("");
      const response = await httpPut(
        "/lobbies/" + lobbyId + "/join?privateLobbyKey=" + privateLobbyKey,
        body,
        { headers }
      );
      console.log("put response: ", response);

      console.log("player: ", player);

      // show notification that player has successfully logged in and joined the game
      notifications.show({
        title: "Success",
        message:
          "Great to see you " +
          playerName +
          "! You have successfully joined the game.",
        color: "green",
      });

      // navigate to game
      setCurrentGameRound(0);
      navigate("/lobbies/" + lobbyId);
    } catch (error: any) {
      if (error.response.status === 403) {
        notifications.show({
          title: "Something went wrong",
          message: error.response.data.message,
          color: "red",
        });
        handleLogout();
      } else {
        notifications.show({
          title: "Something went wrong",
          message: error.response.data.message,
          color: "red",
        });
        console.error("Error joining game: ", error);
      }
    }
  }

  return (
    <Application>
      <Container size="xl" my={40}>
        <Title>FlagMania</Title>
        <Text size="lg" style={{ margin: "24px 0" }}>
          Welcome to Flagmania, are you ready to join the game?
        </Text>
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
            <Button
              onClick={loginUserJoin}
              disabled={!isFormFilledOut}
              fullWidth
              size="xl"
              style={{ marginTop: "24px" }}
            >
              Sign in
            </Button>
          </Paper>
        ) : (
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              label="Name"
              placeholder="Name"
              onChange={handleSetPlayerName}
              value={playerName}
            />
            <Button
              disabled={!playerName}
              onClick={() => handleUserJoin("/lobbies/" + lobbyId)}
              style={{ marginTop: "24px" }}
            >
              Join Game
            </Button>
          </Paper>
        )}
      </Container>
    </Application>
  );
};
