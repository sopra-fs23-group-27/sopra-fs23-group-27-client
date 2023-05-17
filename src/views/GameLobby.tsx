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
import Lobby from "../models/Lobby";
import { ButtonCopy } from "../components/ClipboardButton";

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

const GreenButton = styled.button`
  width: 200px;
  height: 50px;
  background-color: #90ee90;
  border: 1px solid #000;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
`;

const P = styled.p`
  padding: 0;
  margin: 0;
`;

const AdditionalBoxes = styled.div`
  padding: 8px 16px;
  border: 2px solid rgb(216, 216, 216);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50px;
`;

type PropsType = {
  player: Player | undefined;
  lobby: Lobby | undefined;
  setLobby: Dispatch<SetStateAction<Lobby | undefined>>;
};
export const GameLobby = (props: PropsType) => {
  const { player, lobby, setLobby } = props;

  const [showQrCodeBig, setShowQrCodeBig] = useState(false);
  const [gameUrl, setGameUrl] = useState("");

  const { lobbyId } = useParams();
  const navigate = useNavigate();

  // get the player token from local storage
  const playerToken = sessionStorage.getItem("FlagManiaToken");

  const stompClient = useStompClient();
  // log the connection status
  console.log(stompClient ? "Connected" : "Not Connected");

  // get the player and lobby information from session storage
  const [lobbyName, setLobbyname] = useState("");
  const [joinedPlayerNames, setJoinedPlayerNames] = useState<string[]>([]);
  const [playerRoles, setPlayerRoles] = useState<{ [key: string]: boolean }>(
    {}
  );

  // map playername to name and role
  const playerNamesAndRoles = joinedPlayerNames.map((playerName: string) => {
    const role = playerRoles[playerName] ? "Creator" : "Player";
    const name = playerName;
    return { name, role };
  });

  // set the loading state
  const [isLoading, setIsLoading] = useState(false);

  // private URL for the QR code
  const headers = { Authorization: sessionStorage.getItem("FlagManiaToken") };
  // get the current lobby URL
  const lobbyURL = window.location.href;

  console.log("player token: ", playerToken);

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/lobby-settings`,
    (message: any) => {
      setIsLoading(false);
      // get the lobby name and joined player names from the message
      const newLobbyName = JSON.parse(message.body).lobbyName as string;
      const newJoinedPlayerNames = JSON.parse(message.body)
        .joinedPlayerNames as string[];

      // get the player roles from the message if it exists
      const newPlayerRoles = JSON.parse(message.body).playerRoleMap as {
        [key: string]: boolean;
      };
      console.log(message.body);
      console.log("Message from server: ", lobbyName);
      console.log("Message from server: ", joinedPlayerNames);
      console.log("Message from server: ", playerRoles);
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
          notifications.show({
            title: "Player joined",
            message: playerName,
            color: "green",
          });
        });
      }

      // show notification for each player that left
      if (leftPlayerNames.length > 0) {
        // show notification for each player that joined
        leftPlayerNames.forEach((playerName: string) => {
          notifications.show({
            title: "Player left",
            message: playerName,
            color: "red",
          });
        });
      }
      // update the lobby name and joined player names
      setLobbyname(newLobbyName);
      setJoinedPlayerNames(newJoinedPlayerNames);
      setPlayerRoles(newPlayerRoles);
    }
  );

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/game-start`,
    (message: any) => {
      navigate("/game/" + lobbyId);
    }
  );

  console.log("player token: ", playerToken);

  useEffectOnce(() => {
    console.log("lobbyId: ", lobbyId);
    httpGet("/lobbies/" + lobbyId, { headers })
      .then((response) => {
        const privateLobbyKey = response.data.privateLobbyKey;
        if (privateLobbyKey === null) {
          console.log("Public lobby");
          setGameUrl(lobbyURL + "/join");
        } else {
          setGameUrl(lobbyURL + "/join/?key=" + privateLobbyKey);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("StompClient Status: ", stompClient);
    if (stompClient) {
      stompClient.publish({
        destination: "/app/authentication",
        body: JSON.stringify({ playerToken }),
      });
    } else {
      console.error("Error: Could not send message");
      // reconnect the websocket
      // stompClient.reconnect_delay = 5000;
    }
  });

  const startGame = async () => {
    console.log("PlayerToken: ", playerToken);
    try {
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };
      const body = {};
      const response = await httpPut("/lobbies/" + lobbyId + "/start", body, {
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
              width: "100px",
            }}
          />
          <h1>
            Game Lobby {lobbyId}: {lobbyName}
          </h1>
          <h2>Waiting for players to join...</h2>

          <h3>Players in lobby:</h3>

          <UserContainer>
            <UsersRolesTable data={playerNamesAndRoles} />
          </UserContainer>

          {player?.isCreator && (
            <Button onClick={() => startGame()}>Start Game</Button>
          )}
        </>
      )}
    </div>
  );
};
