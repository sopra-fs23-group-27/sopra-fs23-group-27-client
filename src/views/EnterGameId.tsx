import { useState } from "react";
import { Link } from "react-router-dom";

export const GameIdInput = () => {
    const [gameId, setGameId] = useState("");

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
            <h1>Enter the game ID or scan a QR code to join the game</h1>
            <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
            />
            <Link to={`/lobbies/${gameId}`}>
                <button>Join Game</button>
            </Link>
        </div>
    );
};