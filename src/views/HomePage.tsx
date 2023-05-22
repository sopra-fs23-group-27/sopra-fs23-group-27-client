import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { httpPost } from "../helpers/httpService";
import { Player } from "../types/Player";
import { notifications } from "@mantine/notifications";
import { Button, TextInput, ThemeIcon, createStyles, rem } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";

const ICON_SIZE = rem(60);

const useStyles = createStyles((theme) => ({
  icon: {
    position: "absolute",
    top: `calc(5% - ${ICON_SIZE} / 2)`,
    left: `calc(95% - ${ICON_SIZE} / 2)`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

const Application = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 38px;
  color: black;
  // color: white;
  text-align: center;
  //background-color: #f5f7f9;
  //background-color: #dba11c;
`;
const H1 = styled.h1`
  margin: 0;
  margin-bottom: 32px;
`;
const P = styled.p`
  font-size: 24px;
  margin: 0;
`;
const UserContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
`;
const GuestContainer = styled.div`
  margin-top: 64px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
  justify-content: space-between;
`;

type PropsType = {
  isLoggedIn: boolean;
  player: Player | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

export const HomePage = (props: PropsType) => {
  const { classes } = useStyles();
  const { isLoggedIn, setPlayer, setIsLoggedIn } = props;

  const [playerName, setPlayerName] = useInputState("");
  const navigate = useNavigate();

  const handleGuestJoin = async (
    link: "/configureGame" | "/enterGameId" | "/publicGames"
  ) => {
    const password = "";
    try {
      // check if player is already in sessionStorage
      if (sessionStorage.getItem("currentPlayerId") === null) {
        const response = await httpPost(
          "/players",
          {
            playerName: playerName,
            password: password,
          },
          { headers: {} }
        );

        response.data.permanent = false;

        if (link === "/configureGame") {
          response.data.isCreator = true;
        }
        console.log("new guest player created: ", response.data);

        // Set player to the response data
        const player = response.data as Player;
        setPlayer(player);
        setIsLoggedIn(false);
        console.log("new guest player created: ", player);

        // Store the token into the session storage.
        sessionStorage.setItem(
          "FlagManiaToken",
          response.headers.authorization
        );

        // Store the ID of the currently logged-in user in sessionStorage
        sessionStorage.setItem("currentPlayerId", player.id.toString());
      }

      // navigate to respective view
      navigate(link);

      // catch errors
    } catch (error: any) {
      notifications.show({
        title: "Something went wrong",
        message: error.response
          ? error.response.data.message
          : "Server could not be reached",
        color: "red",
      });
    }
  };

  return (
    <Application>
      <ThemeIcon className={classes.icon} size={ICON_SIZE} radius={ICON_SIZE}>
        <IconInfoCircle
          size="2rem"
          stroke={1.5}
          onClick={() => navigate("/gameInfo")}
          style={{ cursor: "pointer" }}
        />
      </ThemeIcon>
      <H1>FlagMania</H1>
      <p>Learn about the flags of the world!</p>

      <UserContainer>
        {isLoggedIn ? (
          <>
            leaderBoard
            <Button size="xl" onClick={() => navigate("/profile")}>
              Show Your Profile
            </Button>
            <Button
              size="xl"
              onClick={() => alert("logout not implemented yet")}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button size="xl" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button size="xl" onClick={() => navigate("/register")}>
              Register
            </Button>
          </>
        )}
      </UserContainer>

      {!isLoggedIn && !sessionStorage.getItem("FlagManiaToken") ? (
        <GuestContainer>
          <P>or play as guest</P>
          <TextInput
            size="lg"
            label="Username"
            placeholder="Guest"
            value={playerName}
            onChange={setPlayerName}
          />{" "}
        </GuestContainer>
      ) : (
        <GuestContainer>
          <P>User: {sessionStorage.getItem("currentPlayer")}</P>
        </GuestContainer>
      )}
      <GuestContainer>
        <ButtonContainer>
          <Button
            size="lg"
            disabled={!playerName && !sessionStorage.getItem("FlagManiaToken")}
            onClick={() => handleGuestJoin("/publicGames")}
          >
            Join Public Game
          </Button>
          <Button
            size="lg"
            disabled={!playerName && !sessionStorage.getItem("FlagManiaToken")}
            onClick={() => handleGuestJoin("/enterGameId")}
          >
            Join Private Game
          </Button>
          <Button
            size="lg"
            disabled={!playerName && !sessionStorage.getItem("FlagManiaToken")}
            onClick={() => handleGuestJoin("/configureGame")}
          >
            Create New Game
          </Button>
        </ButtonContainer>
      </GuestContainer>
    </Application>
  );
};
