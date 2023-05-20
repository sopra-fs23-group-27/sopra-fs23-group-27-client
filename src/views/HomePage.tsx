import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { httpPost } from "../helpers/httpService";
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
};

export const HomePage = (props: PropsType) => {
  const { isLoggedIn, setPlayer } = props;

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

        // Create a new Player instance from the JSON data in the response
        const player = new Player(response.data);
        setPlayer(player);
        console.log("new guest player created: ", player);

        // Store the token into the session storage.
        sessionStorage.setItem(
          "FlagManiaToken",
          response.headers.authorization
        );

        // Store the ID of the currently logged-in user in sessionStorage
        sessionStorage.setItem("currentPlayerId", player.id.toString());

        // Store the Name of the currently logged-in user in sessionStorage
        sessionStorage.setItem("currentPlayer", player.playerName);

        // Store login status of the current user
        sessionStorage.setItem("loggedIn", "false");
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
      <H1>FlagMania</H1>
      <p>Learn about the flags of the world!</p>

      <UserContainer>
        {isLoggedIn ? (
          <>
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
            placeholder="guest"
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
