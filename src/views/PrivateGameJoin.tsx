import styled from "styled-components";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { useState } from "react";
import { handleError, httpGet, httpPost, httpPut } from "../helpers/httpService";
import Player from "../models/Player";

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

      // Store the token into the local storage.
      localStorage.setItem("token", response.headers.authorization);

      // Store the ID of the currently logged-in user in localstorage
      localStorage.setItem("currentPlayerId", player.id.toString());

      // Store the Name of the currently logged-in user in localstorage
      localStorage.setItem("currentPlayer", player.playerName);

      // define header and body
      const headers = { Authorization: localStorage.getItem("token") };

      // get lobby
      const lobby = await httpGet("/lobbies/" + lobbyId, { headers });

      // join game
      joinGame(lobby.data.privateLobbyKey);

      // catch errors
    } catch (error: any) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
  };

  async function joinGame(privateLobbyKey: string) {
    const headers = { Authorization: localStorage.getItem("token") };
    const body = {};
    const response = await httpPut("/lobbies/" + lobbyId + "/join?privateLobbyKey=" + privateLobbyKey, body, { headers });
    if (response.status === 204) {
      navigate("/lobbies/" + lobbyId);
    } else {
      alert(response.status)
      throw new Error("Error joining game");
    }
  }

  return (
    <Container>
      <h1>FlagMania</h1>
      <p>Welcome to Flagmania, are you ready to join the game?</p>
      <FloatingTextInput
        label="Name"
        onChange={(newVal: string) => setPlayerName(newVal)}
        value={playerName}
      />
      <ButtonContainer>
        <GreenButton
          disabled={!playerName}
          onClick={() => handleUserJoin("/lobbies/" + lobbyId)}
        >
          Join Private Game
        </GreenButton>
      </ButtonContainer>
    </Container>
  );
};
