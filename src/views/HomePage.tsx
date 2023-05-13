import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { handleError, httpPost } from "../helpers/httpService";
import Player from "../models/Player";
import { notifications } from "@mantine/notifications";
import { Button, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";

const Application = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 38px;
  color: black;
  text-align: center;
  background-color: #f5f7f9;
`;
const H1 = styled.h1`
  margin: 0;
  margin-bottom: 32px;
`;
const P = styled.p`
  font-size: 18px;
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
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
`;

type PropsType = {
  isLoggedIn: boolean;
  player: Player | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
};

export const HomePage = (props: PropsType) => {
  const { isLoggedIn, player, setPlayer } = props;

  const [playerName, setPlayerName] = useInputState("");
  const navigate = useNavigate();

  const handleGuestJoin = async (
    link: "/configureGame" | "/enterGameId" | "/publicGames"
  ) => {
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

      if (link === "/configureGame") {
        response.data.isCreator = true;
      }

      if (link === "/configureGame") {
        response.data.isCreator = true;
      }

      // Create a new Player instance from the JSON data in the response
      const player = new Player(response.data);
      //setPlayer(player);

      // Store the token into the session storage.
      sessionStorage.setItem("FlagManiaToken", response.headers.authorization);

      // Store the ID of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayerId", player.id.toString());

      // Store the Name of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayer", player.playerName);

      // Store login status of the current user
      sessionStorage.setItem("loggedIn", "false");

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

  const UserButton = ({ isLoggedIn, username }: any) => (
    <Button
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        padding: "10px",
      }}
      onClick={() => {
        if (isLoggedIn) {
          navigate("/profile");
        } else {
          navigate("/login");
        }
      }}
    >
      {isLoggedIn ? `Welcome ${username}` : "Login"}
    </Button>
  );

  return (
    <Application>
      <H1>FlagMania</H1>
      <p>Learn about the flags of the world!</p>

      <UserContainer>
        {isLoggedIn ? (
          <>
            <Button size="lg" onClick={() => navigate("/profile")}>
              Show Your Profile
            </Button>
            <Button
              size="lg"
              onClick={() => alert("logout not implemented yet")}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button size="lg" onClick={() => navigate("/register")}>
              Register
            </Button>
          </>
        )}
      </UserContainer>

      {!isLoggedIn && (
        <GuestContainer>
          <P>or play as guest</P>
          <TextInput
            label="Username"
            placeholder="guest"
            value={playerName}
            onChange={setPlayerName}
          />

          <ButtonContainer>
            <Button
              disabled={!playerName}
              onClick={() => handleGuestJoin("/publicGames")}
            >
              Join Public Game
            </Button>
            <Button
              disabled={!playerName}
              onClick={() => handleGuestJoin("/enterGameId")}
            >
              Join Private Game
            </Button>
            <Button
              disabled={!playerName}
              onClick={() => handleGuestJoin("/configureGame")}
            >
              Create New Game
            </Button>
          </ButtonContainer>
        </GuestContainer>
      )}
    </Application>
  );
};
