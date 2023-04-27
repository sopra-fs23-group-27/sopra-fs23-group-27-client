import { Link, useParams, useNavigate } from "react-router-dom";
import { useSubscription, useStompClient } from "react-stomp-hooks";
import { useEffectOnce } from "../customHooks/useEffectOnce";
import { useState } from "react";
import styled from "styled-components";
import { UsersRolesTable } from "../components/UserTable";
import { httpPut } from "../helpers/httpService";
import { RainbowLoader } from "../components/RainbowLoader";

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

const QRCodeButton = styled.img`
  width: 75px;
  height: 75px;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  top: 50px;
  right: 50px;
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

export const GameLobby = () => {
  const { lobbyId } = useParams();
  const stompClient = useStompClient();
  const navigate = useNavigate();

  // get the lobby name from local storage
  const [lobbyName, setLobbyname] = useState("");
  const [joinedPlayerNames, setJoinedPlayerNames] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // get the player token from local storage
  const playerToken = localStorage.getItem("token");

  // map playername to name and role
  const playerNames = joinedPlayerNames.map((playerName: string) => {
    return { name: playerName, role: "player" };
  });

  console.log("player token: ", playerToken);

  useEffectOnce(() => {
    console.log("lobbyId: ", lobbyId);
    if (stompClient) {
      stompClient.publish({
        destination: "/app/authentication",
        body: JSON.stringify({ playerToken }),
      });
    } else {
      console.error("Error: Could not send message");
    }
  });

  useSubscription(
    `/user/queue/lobby/${lobbyId}/lobby-settings`,
    (message: any) => {
      setIsLoading(false);
      const lobbyName = JSON.parse(message.body).lobbyName as string;
      const joinedPlayerNames = JSON.parse(message.body)
        .joinedPlayerNames as string[];
      console.log("Message from server: ", lobbyName);
      console.log("Message from server: ", joinedPlayerNames);
      setLobbyname(lobbyName);
      setJoinedPlayerNames(joinedPlayerNames);
    }
  );

  const startGame = async () => {
    console.log("PlayerToken: ", playerToken);
    try {
      const headers = { Authorization: localStorage.getItem("token") };
      const body = {};
      const response = await httpPut("/lobbies/" + lobbyId + "/start", body, {
        headers,
      });
      navigate("/game/" + lobbyId);
    } catch (e) {
      console.error(e);
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
      {isLoading ? (
        <RainbowLoader />
      ) : (
        <>
          <QRCodeButton src="https://pngimg.com/uploads/qr_code/qr_code_PNG2.png" onClick={() => navigate("/scanQRCode" + "/" + lobbyId)}></QRCodeButton>
          <h1>
            Game Lobby {lobbyId}: {lobbyName}
          </h1>
          <h2>Waiting for players to join...</h2>

          <h3>Players in lobby:</h3>

          <UserContainer>
            <UsersRolesTable data={playerNames} />
          </UserContainer>

          <GreenButton onClick={() => startGame()}>Start Game</GreenButton>
        </>
      )}
    </div>
  );
};
