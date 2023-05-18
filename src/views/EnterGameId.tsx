import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@mantine/core";
import styled from "styled-components";

const ButtonContainer = styled.div`
  display: flex;
  gap: 32px;
  flex-direction: row;
  align-items: center;
  height: 40vh;
  justify-content: space-between;
`;

export const GameIdInput = () => {
  const [gameURL, setGameURL] = useState("");
  const navigate = useNavigate();

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
      <h1>Enter the game URL or scan a QR code to join private games</h1>
      <Input
        type="text"
        value={gameURL}
        placeholder="Game URL"
        onChange={(e) => setGameURL(e.target.value)}
      />
      <ButtonContainer>
        <Link to={gameURL}>
          <Button>Join Game</Button>
        </Link>
      </ButtonContainer>
    </div>
  );
};
