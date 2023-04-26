import { Link, useParams } from "react-router-dom";
import { useSubscription, useStompClient } from "react-stomp-hooks";

export const GameLobby = () => {
  const { lobbyId } = useParams();
  const stompClient = useStompClient();

  // get the lobby name from local storage
  const lobbyName = localStorage.getItem("lobbyName");

  // get the private key from local storage
  const privateLobbyKey = localStorage.getItem("privateLobbyKey");

  // get the player token from local storage
  const playerToken = localStorage.getItem("token");

  console.log("player token: ", playerToken);
  if (stompClient) {
    console.log("Connected to websocket!");
    stompClient.publish({
      destination: "/app/authentication",
      body: JSON.stringify({ playerToken }),
    });
  } else {
    console.error("Error: Could not send message");
  }
  useSubscription(
    `/user/queue/lobby/${lobbyId}/lobby-settings`,
    (message: any) => {
      const parsedMessage = JSON.parse(message.body).message as string;
      console.log("Message from server: ", parsedMessage);
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
      <ul>
        <li>Player 1</li>
        <li>Player 2</li>
        <li>Player 3</li>
      </ul>
      <Link to={`/lobbies/${lobbyId}/game`}>
        <button>Start Game</button>
      </Link>
    </div>
  );
};