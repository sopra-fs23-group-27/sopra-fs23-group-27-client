import { Link, useParams } from "react-router-dom";
import { useSubscription, useStompClient } from "react-stomp-hooks";
import { useEffectOnce } from "../customHooks/useEffectOnce";

export const GameLobby = () => {
  const { lobbyId } = useParams();
  const stompClient = useStompClient();

  const playerToken = localStorage.getItem("token");
  console.log("player token: ", playerToken);

  useEffectOnce(() => {
    const authenticate = () => {
      if (stompClient) {
        stompClient.publish({
          destination: "/app/authentication",
          body: JSON.stringify({ playerToken }),
        });
      } else {
        console.error("Error: Could not send message");
      }
    };
    authenticate();
  });

  useSubscription(
    `/user/queue/lobby/${lobbyId}/lobby-settings`,
    (message: any) => {
      const lobbyId = JSON.parse(message.body).lobbyId as string;
      console.log("Message from server: ", lobbyId);
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
      <h1>Game Lobby {lobbyId}</h1>
      <Link to={`/lobbies/${lobbyId}/game`}>
        <button>Start Game</button>
      </Link>
    </div>
  );
};
