import styled from "styled-components";
import "../styles/HomePage.css";
import { Link } from "react-router-dom";
import { FloatingTextInput } from "./FloatingTextInput";
import { useState } from "react";
import { handleError, httpGet, httpPost } from "../helpers/httpService";
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
  
export const HomePage = () => {
  const [playerName, setPlayerName] = useState("");

  const handleUserJoin = async () => {
    const password = "1234";
    try {
      const response = await httpPost('/players', {
        playerName: playerName,
        password: password,
      });
      console.log(response.data);

      // Create a new Player instance from the JSON data in the response
      const player = new Player(response.data);
      console.log(player);

      // Store the token into the local storage.
      localStorage.setItem('token', player.headers.authorization);

      // Store the ID of the currently logged-in user in localstorage
      localStorage.setItem('currentPlayerId', player.id.toString());

      // Store the Name of the currently logged-in user in localstorage
      localStorage.setItem('currentPlayer', player.playerName);

      // catch errors
    } catch (error: any) {
      alert(`Something went wrong: \n${handleError(error)}`);
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
        <Link to="/publicGames"><OrangeButton disabled={!playerName} onClick={handleUserJoin}>
          Join Public Game
        </OrangeButton></Link>
        <Link to="/enterGameId"><GreenButton disabled={!playerName} onClick={handleUserJoin}>
          Join Private Game
        </GreenButton></Link>
        <Link to="/configureGame"><OrangeButton disabled={!playerName} onClick={handleUserJoin}>
          Create New Game
        </OrangeButton></Link>
      </ButtonContainer>
    </Container>
  );
};