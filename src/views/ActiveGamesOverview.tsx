import { game } from "../types/databaseTypes";
import { useState, useEffect, SetStateAction, Dispatch } from "react";

import styled from "styled-components";
import { RainbowLoader } from "../components/RainbowLoader";
import { httpGet, httpPut } from "../helpers/httpService";
import { useEffectOnce } from "../customHooks/useEffectOnce";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import Lobby from "../models/Lobby";
import { Button, Table } from "@mantine/core";

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

type PublicGameProps = {
  setLobby: Dispatch<SetStateAction<Lobby | undefined>>;
  game: game;
};
export const PublicGame = (props: PublicGameProps) => {
  const navigate = useNavigate();
  const { setLobby } = props;
  const { lobbyName, joinedPlayerNames, mode, lobbyId } = props.game;

  const joinGame = async (lobbyId: number) => {
    const lobby = await httpGet("/lobbies/" + lobbyId, {});

    if (lobby.status === 200) {
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };
      const body = {};
      const response = await httpPut("/lobbies/" + lobbyId + "/join", body, {
        headers,
      });
      if (response.status === 204) {
        setLobby(lobby.data);
        navigate("/lobbies/" + lobbyId);
      } else {
        notifications.show({
          title: "Error",
          message: response.status,
          color: "red",
        });
        throw new Error("Error joining game");
      }
    } else {
      throw new Error("Error joining game");
    }
  };

  return (
    <GameContainer>
      <GameItem>{lobbyName}</GameItem>
      <GameItem>{joinedPlayerNames.length}</GameItem>
      <GameItem>{mode}</GameItem>
      <GameItem>
        <JoinButton onClick={() => joinGame(lobbyId)}>Join</JoinButton>
      </GameItem>
    </GameContainer>
  );
};

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  // background-color: #dba11c;
  display: flex;
  justify-content: center;
`;
const Application = styled.div`
  padding: 50px;
  margin-top: 150px;
  width: 1200px;
`;
const H1 = styled.h1`
  font-size: 40px;
`;
const ButtonTh = styled.th`
  width: 100px;
`;
const Td = styled.td`
  padding: 12px 10px;
`;
const ButtonTd = styled(Td)`
  display: flex;
  justify-content: flex-end;
`;

type PropsType = {
  setLobby: Dispatch<SetStateAction<Lobby | undefined>>;
};
export const ActiveGameOverview = (props: PropsType) => {
  const { setLobby } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<game[]>([]);
  const navigate = useNavigate();

  const getLobbies = async () => {
    const playerToken = sessionStorage.getItem("FlagManiaToken") as string;
    try {
      const games = (await httpGet("/lobbies", playerToken))
        .data as unknown as game[];
      setIsLoading(false);
      setGames(games);
    } catch (e: any) {
      console.error(e);
    }
  };

  const joinGame = async (lobbyId: number) => {
    const lobby = await httpGet("/lobbies/" + lobbyId, {});

    console.log("lobby from join: ", lobby);
    if (lobby.status === 200) {
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };
      const body = {};
      const response = await httpPut("/lobbies/" + lobbyId + "/join", body, {
        headers,
      });
      if (response.status === 204) {
        setLobby(lobby.data);
        navigate("/lobbies/" + lobbyId);
      } else {
        notifications.show({
          title: "Error",
          message: response.status,
          color: "red",
        });
        throw new Error("Error joining game");
      }
    } else {
      throw new Error("Error joining game");
    }
  };

  useEffectOnce(() => {
    getLobbies();
  });

  return (
    <Container>
      <Application>
        {isLoading ? (
          <RainbowLoader />
        ) : (
          <>
            <H1>Public Games</H1>
            <Button
              size="md"
              onClick={() => getLobbies()}
              style={{ marginBottom: "36px" }}
            >
              Reload
            </Button>
            {!games[0] && <p>Currently, No public games are open to join</p>}
            <Table miw={600} verticalSpacing="lg" fontSize="xl">
              <thead>
                <tr>
                  <th>Name</th>
                  <th># Players</th>
                  <th>Mode</th>
                  <ButtonTh />
                </tr>
                {games.map((g, ind) => (
                  <tr key={ind}>
                    <Td>{g.lobbyName}</Td>
                    <Td>{g.joinedPlayerNames.length}</Td>
                    <Td>{g.mode}</Td>
                    <ButtonTd>
                      <Button size="lg" onClick={() => joinGame(g.lobbyId)}>
                        Join
                      </Button>
                    </ButtonTd>
                  </tr>
                ))}
              </thead>
            </Table>
          </>
        )}
      </Application>
    </Container>
  );
};
