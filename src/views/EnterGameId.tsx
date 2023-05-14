import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../icons/DALL-E_FlagMania_Logo.png";
import { useNavigate } from "react-router-dom";

export const GameIdInput = () => {
    const [gameId, setGameId] = useState("");
    const navigate = useNavigate();
    
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
            <img
            src={Logo}
            alt="FlagMania Logo"
            onClick={() => navigate("/")}
            style={{
              top: "10px",
              left: "10px",
              padding: "10px",
              width: "5%",
              height: "auto",
              position: "absolute",
              cursor: "pointer",
            }}
          />
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