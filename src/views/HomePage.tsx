import styled from "styled-components";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { useState } from "react";
import { handleError, httpPost } from "../helpers/httpService";
import Player from "../models/Player";
import { notifications } from "@mantine/notifications";
import { Button } from "@mantine/core";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 38px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 40vh;
`;

export const HomePage = () => {
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleUserJoin = async (link: string) => {
    const password = "";
    try {
      const response = await httpPost(
        "/players",
        {
          playerName: playerName,
          password: password,
        },
        { headers: {} }
      );

      console.log(response.data);

      // Create a new Player instance from the JSON data in the response
      const player = new Player(response.data);
      console.log(player);

      // Store the token into the session storage.
      sessionStorage.setItem("FlagManiaToken", response.headers.authorization);

      // Store the ID of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayerId", player.id.toString());

      // Store the Name of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayer", player.playerName);

      // navigate to respective view
      navigate(link);

      // catch errors
    } catch (error: any) {      
      notifications.show({
        title: "Something went wrong",
        message: error.response.data.message,
        color: "red",
      });
    }
  };
  return (
    <Container>
      <h1>FlagMania</h1>
      <p>Play the game and learn about the flags of the world!</p>
      <FloatingTextInput
        label="Name"
        onChange={(newVal: string) => setPlayerName(newVal)}
        value={playerName}
      />
      <ButtonContainer>
        <Button
          disabled={!playerName}
          onClick={() => handleUserJoin("/publicGames")}
        >
          Join Public Game
        </Button>
        <Button
          disabled={!playerName}
          onClick={() => handleUserJoin("/enterGameId")}
        >
          Join Private Game
        </Button>
        <Button
          disabled={!playerName}
          onClick={() => handleUserJoin("/configureGame")}
        >
          Create New Game
        </Button>
      </ButtonContainer>
    </Container>
  );
};
