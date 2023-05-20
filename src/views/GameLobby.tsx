import QRCode from "react-qr-code";
import { useParams, useNavigate } from "react-router-dom";
import { useSubscription, useStompClient } from "react-stomp-hooks";
import { useEffectOnce } from "../customHooks/useEffectOnce";
import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { UsersRolesTable } from "../components/UserTable";
import { httpGet, httpPut } from "../helpers/httpService";
import { RainbowLoader } from "../components/RainbowLoader";
import { Button, CloseButton } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Player from "../models/Player";
import { ButtonCopy } from "../components/ClipboardButton";
import { LobbySettingsAdvanced } from "../components/LobbySettingsAdvanced";
import { LobbySettingsBasic } from "../components/LobbySettingsBasic";

const QrBox = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background-color: white;
  z-index: 1;
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 38px;
`;

type PropsType = {
  player: Player | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
};
export const GameLobby = (props: PropsType) => {
  const { player, setPlayer } = props;

  const [currentAdmin, setCurrentAdmin] = useState("");

  const [showQrCodeBig, setShowQrCodeBig] = useState(false);
  const [gameUrl, setGameUrl] = useState("");

  const { lobbyId } = useParams();
  const navigate = useNavigate();

  // get the player token from local storage
  const playerToken = sessionStorage.getItem("FlagManiaToken");

  const stompClient = useStompClient();

  // get the player and lobby information from session storage
  const [lobbyName, setLobbyname] = useState("");
  const [joinedPlayerNames, setJoinedPlayerNames] = useState<string[]>([]);
  const [continent, setContinent] = useState("");
  const [numberOfRounds, setNumberOfRounds] = useState(0);
  const [firstHintAfter, setFirstHintAfter] = useState(0);
  const [hintsInterval, setHintsInterval] = useState(0);
  const [timeLimitPerRound, setTimeLimitPerRound] = useState(0);
  const [numberOfOptions, setNumberOfOptions] = useState(0);
  const [gameMode, setGameMode] = useState("");
  const [playerRoles, setPlayerRoles] = useState<{ [key: string]: boolean }>(
    {}
  );

  // map playername to name and role
  const playerNamesAndRoles = joinedPlayerNames.map((playerName: string) => {
    const role = playerRoles[playerName] ? "Admin" : "Player";
    const name = playerName;
    return { name, role };
  });

  // set the loading state
  const [isLoading, setIsLoading] = useState(false);

  // private URL for the QR code
  const headers = { Authorization: sessionStorage.getItem("FlagManiaToken") };
  // get the current lobby URL
  const lobbyURL = window.location.href;

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/lobby-settings`,
    (message: any) => {
      setIsLoading(false);
      // get the lobby name and joined player names from the message
      const newLobbyName = JSON.parse(message.body).lobbyName as string;
      const newJoinedPlayerNames = JSON.parse(message.body)
        .joinedPlayerNames as string[];
      const continent = JSON.parse(message.body).continent as string;
      const newNumberOfRounds = JSON.parse(message.body).numRounds as number;
      //TODO: num rounds and continent not working
      const newFirstHintAfter = JSON.parse(message.body)
        .numSecondsUntilHint as number;
      const newHintsInterval = JSON.parse(message.body).hintInterval as number;
      const newTimeLimitPerRound = JSON.parse(message.body)
        .numSeconds as number;
      const numberOfOptions = JSON.parse(message.body).numOptions as number;
      const gameMode = JSON.parse(message.body).mode as string;

      // get the player roles from the message if it exists
      const newPlayerRoles = JSON.parse(message.body).playerRoleMap as {
        [key: string]: boolean;
      };

      // find players that joined the lobby recently
      const newPlayerNames = newJoinedPlayerNames.filter(
        (playerName: string) => !joinedPlayerNames.includes(playerName)
      );

      // find players that left the lobby recently
      const leftPlayerNames = joinedPlayerNames.filter(
        (playerName: string) => !newJoinedPlayerNames.includes(playerName)
      );

      if (newPlayerNames.length > 0) {
        // show notification for each player that joined
        newPlayerNames.forEach((playerName: string) => {
          if (playerName !== sessionStorage.getItem("currentPlayer")) {
            notifications.show({
              title: "Player joined",
              message: playerName,
              color: "green",
            });
          }
        });
      }

      // show notification for each player that left
      if (leftPlayerNames.length > 0) {
        // show notification for each player that joined
        leftPlayerNames.forEach((playerName: string) => {
          if (playerName !== sessionStorage.getItem("currentPlayer")) {
            notifications.show({
              title: "Player left",
              message: playerName,
              color: "red",
            });
          }
        });
      }

      // show notification for all players if the admin changed
      if (newPlayerRoles) {
        const newAdmin = Object.keys(newPlayerRoles).find(
          (playerName: string) => newPlayerRoles[playerName] === true
        );
        setCurrentAdmin(newAdmin ? newAdmin : "");
        if (newAdmin && newAdmin !== currentAdmin && currentAdmin !== "") {
          notifications.show({
            title: "New admin",
            message: "The admin is now " + newAdmin,
            color: "blue",
          });
        } else if (newAdmin && currentAdmin === "") {
          notifications.show({
            title: "Admin",
            message: "The admin is " + newAdmin,
            color: "blue",
          });
        }

        const updatedPlayer = player ? { ...player } : undefined;
        const thisPlayerIsCreator = updatedPlayer?.playerName === newAdmin;
        if (updatedPlayer) {
          updatedPlayer.isCreator = thisPlayerIsCreator;
          setPlayer(updatedPlayer);
        }
      }

      // update the lobby name and joined player names
      setLobbyname(newLobbyName);
      setJoinedPlayerNames(newJoinedPlayerNames);
      setContinent(continent);
      setNumberOfRounds(newNumberOfRounds);
      setFirstHintAfter(newFirstHintAfter);
      setHintsInterval(newHintsInterval);
      setTimeLimitPerRound(newTimeLimitPerRound);
      setNumberOfOptions(numberOfOptions);
      setGameMode(gameMode);
      setPlayerRoles(newPlayerRoles);
    }
  );

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/game-start`,
    (message: any) => {
      navigate("/game/" + lobbyId);
    }
  );

  useSubscription(`/user/queue/removed-from-lobby`, (message: any) => {
    // inform the user that he was removed from the lobby
    notifications.show({
      title: "Removed from lobby",
      message: "You were removed from the lobby",
      color: "red",
    });
    // delete lobby from session storage
    sessionStorage.removeItem("lobbyId");
    sessionStorage.removeItem("lobbyName");
    // for non-permanent users, flush session storage
    if (!sessionStorage.getItem("loggedIn") === true) {
      sessionStorage.clear();
    }
    navigate("/");
  });

  useEffectOnce(() => {
    httpGet("/lobbies/" + lobbyId, { headers })
      .then((response) => {
        const privateLobbyKey = response.data.privateLobbyKey;
        if (privateLobbyKey === null) {
          setGameUrl(lobbyURL + "/join");
        } else {
          setGameUrl(lobbyURL + "/join/?key=" + privateLobbyKey);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    if (stompClient) {
      stompClient.publish({
        destination: "/app/authentication",
        body: JSON.stringify({ playerToken }),
      });
    } else {
      console.error("Error: Could not send message");
    }
  });

  const startGame = async () => {
    try {
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };
      const body = {};
      await httpPut("/lobbies/" + lobbyId + "/start", body, {
        headers,
      });
      navigate("/game/" + lobbyId);
    } catch (e: any) {
      notifications.show({
        title: "Error",
        message: e.response
          ? e.response.data.message
          : "Server could not be reached",
        color: "red",
      });
    }
  };

  // number of players
  const numberOfPlayers = joinedPlayerNames.length;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "80vh",
        position: "relative",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {showQrCodeBig && (
        <QrBox>
          <CloseButton
            aria-label="Close Button"
            size="xl"
            iconSize={40}
            color="red"
            style={{ position: "relative", left: "18%" }}
            onClick={() => setShowQrCodeBig(false)}
          />
          <h1>Scan to join the game</h1>
          <QRCode value={gameUrl} style={{ width: "100%" }} />
          <ButtonCopy url={gameUrl} />
        </QrBox>
      )}
      {isLoading ? (
        <RainbowLoader />
      ) : (
        <>
          <QRCode
            value={gameUrl}
            onClick={() => setShowQrCodeBig(true)}
            style={{
              cursor: "pointer",
              right: "50px",
              position: "absolute",
              top: "0",
              width: "160px",
            }}
          />

          {gameMode === "ADVANCED" ? (
            <LobbySettingsAdvanced
              lobbyId={lobbyId}
              lobbyName={lobbyName}
              continent={continent} 
              numberOfPlayers={numberOfPlayers}
              numberOfRounds={numberOfRounds}
              showFirstHintAfter={firstHintAfter}
              hintsInterval={hintsInterval}
              timeLimitPerRound={timeLimitPerRound}
            />
          ) : (
            <LobbySettingsBasic
              lobbyId={lobbyId}
              lobbyName={lobbyName}
              continent={continent} 
              numberOfPlayers={numberOfPlayers}
              numberOfRounds={numberOfRounds}
              numberOfOptions={numberOfOptions}
              timeLimitPerRound={timeLimitPerRound}
            />
          )}

          <h3>Players in lobby:</h3>

          <UserContainer>
            <UsersRolesTable data={playerNamesAndRoles} player={player} />
          </UserContainer>

          {player?.isCreator && (
            <Button
              size="xl"
              style={{ padding: "12px 36px" }}
              onClick={() => startGame()}
            >
              Start Game
            </Button>
          )}
        </>
      )}
    </div>
  );
};
