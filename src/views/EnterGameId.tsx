import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@mantine/core";
import styled from "styled-components";
import { notifications } from "@mantine/notifications";

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

  const handleNavigateURL = () => {
    try {
      const url = new URL(gameURL);
      navigate(url.pathname);
    } catch (error: any) {
      notifications.show({
        title: "Invalid Game URL",
        message: "The game URL you entered is invalid. Please try again.",
        color: "red",
      });
      console.log(error);
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
      <h1>Enter the game URL or scan a QR code to join private games</h1>
      <Input
        type="text"
        value={gameURL}
        placeholder="Game URL"
        onChange={(event) => setGameURL(event.currentTarget.value)}
      />
      <ButtonContainer>
        <Button
          onClick={() => {
            handleNavigateURL();
          }}
        >
          Join Game
        </Button>
      </ButtonContainer>
    </div>
  );
};
