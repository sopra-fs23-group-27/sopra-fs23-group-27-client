import { Link, useParams } from "react-router-dom";

export const GameLobby = () => {
    const { lobbyId } = useParams();

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                height: "80vh",
                position: "relative",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <h1>Game Lobby {lobbyId}</h1>
            <Link to={`/lobbies/${lobbyId}/game`}>
                <button>Start Game</button>
            </Link>
        </div>
    );
};