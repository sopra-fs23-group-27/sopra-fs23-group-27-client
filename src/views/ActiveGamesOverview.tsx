import { emptyGame, games } from "../helpers/fakeDatabase";
import { game } from "../types/databaseTypes";
import { useState, useEffect } from "react";

import styled from "styled-components";
import { RainbowLoader } from "../components/RainbowLoader";
import { httpGet, httpPut } from "../helpers/httpService";
import { useEffectOnce } from "../customHooks/useEffectOnce";
import { useNavigate } from "react-router-dom";

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
  cursor: pointer;

  &:hover {
    background-color: lightgray;
    color: #19376d;

    border: 3px solid #19376d;
  }
`;

export const PublicGame = (props: { game: game }) => {
  const navigate = useNavigate();
  const { lobbyName, joinedPlayerNames, mode, lobbyId } = props.game;

  const joinGame = async (lobbyId: number) => {
    const lobby = await httpGet("/lobbies/" + lobbyId, {});
    if (lobby.status === 200) {
      if (lobby.data.joinedPlayerNames.length >= lobby.data.maxNumPlayers) {
        throw new Error("Game is full");
      } else {
        const headers = { Authorization: localStorage.getItem("token") };
        const body = {};
        const response = await httpPut("/lobbies/" + lobbyId + "/join", body, { headers });
        if (response.status === 204) {
          navigate("/lobbies/" + lobbyId);
        } else {
          alert(response.status)
          throw new Error("Error joining game");
        }
      }
    } else {
      throw new Error("Error joining game");
    }
  };

  return (
    <GameContainer>
      <GameItem>{lobbyName}</GameItem>
      <GameItem>{joinedPlayerNames.length}/20</GameItem>
      <GameItem>{mode}</GameItem>
      <GameItem>
        <JoinButton onClick={() => joinGame(lobbyId)}>
          Join
        </JoinButton>
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
  const [games, setGames] = useState<game[]>([]);

  useEffectOnce(() => {
    const getLobbies = async () => {
      const playerToken = localStorage.getItem("token") as string;
      try {
        const games = (await httpGet("/lobbies", playerToken))
          .data as unknown as game[];
        console.log(games);
        setGames(games);
      } catch (e: any) {
        console.error(e);
      }
    };

    getLobbies();
  });

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
          {!games[0] && <p>Currently, No public games are open to join</p>}
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
