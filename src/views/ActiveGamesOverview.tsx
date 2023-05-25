import { game } from "../types/game";
import { useState, SetStateAction, Dispatch } from "react";

import styled from "styled-components";
import { RainbowLoader } from "../components/RainbowLoader";
import { httpGet, httpPut } from "../helpers/httpService";
import { useEffectOnce } from "../customHooks/useEffectOnce";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { Lobby } from "../types/Lobby";
import { Button, Group, Table, Title, createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    boxSizing: "border-box",
  },

  inner: {
    position: "relative",
    paddingTop: rem(200),
    paddingBottom: rem(120),

    [theme.fn.smallerThan("sm")]: {
      paddingBottom: rem(80),
      paddingTop: rem(80),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(62),
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(42),
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: rem(24),

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(18),
    },
  },

  controls: {
    marginTop: `calc(${theme.spacing.xl} * 2)`,

    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: rem(54),
    paddingLeft: rem(38),
    paddingRight: rem(38),

    [theme.fn.smallerThan("sm")]: {
      height: rem(54),
      paddingLeft: rem(18),
      paddingRight: rem(18),
      flex: 1,
    },
  },
}));

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
    const res = await httpGet("/lobbies/" + lobbyId, {});

    // Set the lobby state to the lobby that was returned from the server
    const lobby = res.data as Lobby;
    console.log("lobby from get request: ", res.data);
    setLobby(lobby);

    if (res.status === 200) {
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };
      const body = {};
      const response = await httpPut(
        "/lobbies/" + lobby.lobbyId + "/join",
        body,
        {
          headers,
        }
      );
      if (response.status === 204) {
        // Set the lobby state to the lobby that was returned from the server
        const lobby = response.data as Lobby;
        setLobby(lobby);

        // Navigate to the lobby page
        navigate("/lobbies/" + lobby.lobbyId);
      } else {
        notifications.show({
          title: "Error",
          message: response.data.message,
          color: "red",
        });
        console.error(response.data.message);
      }
    } else {
      console.error(res.data.message);
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
  setCurrentGameRound: Dispatch<SetStateAction<number>>;
};
export const ActiveGameOverview = (props: PropsType) => {
  const { setCurrentGameRound } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<game[]>([]);
  const { classes } = useStyles();
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
    const res = await httpGet("/lobbies/" + lobbyId, {});
    const lobby = res.data as Lobby;

    console.log("lobby from join: ", lobby);
    if (res.status === 200) {
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };
      const body = {};
      try {
        const response = await httpPut("/lobbies/" + lobbyId + "/join", body, {
          headers,
        });
        console.log("response: ", response);
        if (response.status === 204) {
          setCurrentGameRound(0);
          // Navigate to the lobby page
          navigate("/lobbies/" + lobbyId);
        } else {
          notifications.show({
            title: "Error",
            message: response.data.message,
            color: "red",
          });
        }
      } catch (e: any) {
        console.error(e);
        notifications.show({
          title: "Error",
          message: e.response.data.message,
          color: "red",
        });
      }
    } else {
      notifications.show({
        title: "Error",
        message: res.data.message,
        color: "red",
      });
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
            <Title size={56} order={1} style={{ margin: "24px" }}>
              Public Games
            </Title>
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
            <Group className={classes.controls}>
              <Button
                size="md"
                className={classes.control}
                color="gray"
                onClick={() => navigate("/")}
              >
                Back to home
              </Button>
              <Button
                size="md"
                className={classes.control}
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                onClick={() => navigate("/configureGame")}
              >
                Create new game
              </Button>
            </Group>
          </>
        )}
      </Application>
    </Container>
  );
};
