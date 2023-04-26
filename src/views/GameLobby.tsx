import { Link, useParams } from "react-router-dom";
import { useSubscription, useStompClient } from "react-stomp-hooks";
import { useEffectOnce } from "../customHooks/useEffectOnce";
import { useState } from "react";
import styled from "styled-components";
import { UsersRolesTable } from "../components/UserTable";

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

export const GameLobby = () => {
  const { lobbyId } = useParams();
  const stompClient = useStompClient();

  // get the lobby name from local storage
  const [lobbyName, setLobbyname] = useState("");
  const [joinedPlayerNames, setJoinedPlayerNames] = useState<string[]>([]);

  // get the player token from local storage
  const playerToken = localStorage.getItem("token");

  // map playername to name and role
  const playerNames = joinedPlayerNames.map((playerName: string) => {
    return { name: playerName, role: "player" };
  });
  

  console.log("player token: ", playerToken);

  useEffectOnce(() => {
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
      const lobbyName = JSON.parse(message.body).lobbyName as string;
      const joinedPlayerNames = JSON.parse(message.body).joinedPlayerNames as string[];
      console.log("Message from server: ", lobbyName);
      console.log("Message from server: ", joinedPlayerNames);
      setLobbyname(lobbyName);
      setJoinedPlayerNames(joinedPlayerNames);
    }
  );

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
      <h1>Game Lobby {lobbyId}: {lobbyName}</h1>
      <h2>Waiting for players to join...</h2>

      <h3>Players in lobby:</h3>

      <UserContainer>
        <UsersRolesTable data={playerNames} />
      </UserContainer>

      <Link to={"/game/" + lobbyId}>
        <GreenButton>Start Game</GreenButton>
      </Link>
    </div>
  );
};