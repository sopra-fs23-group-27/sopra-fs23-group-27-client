import { games } from "../helpers/fakeDatabase";
import { game } from "../types/databaseTypes";
import { useState, useEffect } from "react";

import styled from "styled-components";
import { RainbowLoader } from "./RainbowLoader";

const GameContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: lightgray;
  padding: 16px 8px;
`;
const GameItem = styled.div`
  width: 100px;
  font-size: 20px;
`;

const JoinButton = styled.button`
  background-color: #19376d;
  border: 3px solid transparent;
  color: white;
  text-align: center;
  text-decoration: none;
  padding: 10px 18px;

  &:hover {
    background-color: lightgray;
    color: #19376d;

    border: 3px solid #19376d;
  }
`;
const PublicGame = (props: { game: game }) => {
  const { name, joinedPlayers, gameMode } = props.game;

  return (
    <GameContainer>
      <GameItem>{name}</GameItem>
      <GameItem>{joinedPlayers}/20</GameItem>
      <GameItem>{gameMode}</GameItem>
      <GameItem>
        <JoinButton>Join</JoinButton>
      </GameItem>
    </GameContainer>
  );
};

const Application = styled.div`
  padding: 50px;
`;
const GameList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 22px;
  list-style-type: none;
`;
export const ActiveGameOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <Application>
      {isLoading ? (
        <RainbowLoader />
      ) : (
        <>
          <h1>Public Games</h1>
          <GameList>
            {games.map((g, ind) => (
              <PublicGame key={ind} game={g} />
            ))}
          </GameList>
        </>
      )}
    </Application>
  );
};
