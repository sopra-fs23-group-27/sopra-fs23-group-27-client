import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { useState } from "react";
import {
  handleError,
  httpGet,
  httpPost,
  httpPut,
} from "../helpers/httpService";
import Player from "../models/Player";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Logo from "../icons/DALL-E_FlagMania_Logo.png";

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

const OrangeButton = styled.button`
  width: 200px;
  height: 50px;
  background-color: #ffa500;
  border: 1px solid #000;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
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

export const ExternalGameJoin = () => {
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();
  const lobbyId = window.location.pathname.split("/")[2];

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

      // define header and body
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };

      // get lobby
      const lobby = await httpGet("/lobbies/" + lobbyId, { headers });

      // join game
      joinGame(lobby.data.privateLobbyKey);

      // catch errors
    } catch (error: any) {
      notifications.show({
        title: "Something went wrong",
        message: error.response.data.message,
        color: "red",
      });
    }
  };

  async function joinGame(privateLobbyKey: string) {
    const headers = { Authorization: sessionStorage.getItem("FlagManiaToken") };
    const body = {};
    const response = await httpPut(
      "/lobbies/" + lobbyId + "/join?privateLobbyKey=" + privateLobbyKey,
      body,
      { headers }
    );
    if (response.status === 204) {
      navigate("/lobbies/" + lobbyId);
    } else {
      notifications.show({
        title: "Error",
        message: response.status,
        color: "red",
      });
      throw new Error("Error joining game");
    }
  }

  return (
    <Container>
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
      <h1>FlagMania</h1>
      <p>Welcome to Flagmania, are you ready to join the game?</p>
      <FloatingTextInput
        label="Name"
        onChange={(newVal: string) => setPlayerName(newVal)}
        value={playerName}
      />
      <ButtonContainer>
        <Button
          disabled={!playerName}
          onClick={() => handleUserJoin("/lobbies/" + lobbyId)}
        >
          Join Game
        </Button>
      </ButtonContainer>
    </Container>
  );
};
