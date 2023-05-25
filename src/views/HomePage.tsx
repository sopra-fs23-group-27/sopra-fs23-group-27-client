import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { httpPost } from "../helpers/httpService";
import { Player } from "../types/Player";
import { notifications } from "@mantine/notifications";
import { Button, TextInput, ThemeIcon, Title, Text, rem } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";

const ICON_SIZE = rem(60);

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

const TopRightContainer = styled.div`
  position: absolute;
  display: flex;
  top: 20px;
  right: 100px;
  gap: 32px;
  flex-direction: row;
  height: 40vh;
  justify-content: space-between;
`;

type PropsType = {
  player: Player | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
};

export const HomePage = (props: PropsType) => {
  const { player, setPlayer } = props;

  const [playerName, setPlayerName] = useInputState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (player?.permanent) {
      navigate("/dashboard");
    }
  }, [player, navigate]);

  const handleLogout = async () => {
    // get player id from session storage
    const playerId = sessionStorage.getItem("currentPlayerId");
    try {
      await httpPost(
        `/players/${playerId}/logout?playerId=${playerId}`,
        {},
        { headers: { Authorization: sessionStorage.getItem("FlagManiaToken") } }
      );
      notifications.show({
        title: "Success",
        message: "You can now choose a new username.",
        color: "green",
      });

      // set player to undefined
      setPlayer(undefined);

      // reset the session storage
      sessionStorage.clear();
      navigate("/");
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.response.data.message,
        color: "red",
      });
      console.error(error);
    }
  };

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
      {player ? (
        <TopRightContainer>
          <Button size="md" color="red" onClick={() => handleLogout()}>
            Change username
          </Button>
          <ThemeIcon size={ICON_SIZE} radius={ICON_SIZE}>
            <IconInfoCircle
              size="2rem"
              stroke={1.5}
              onClick={() => navigate("/gameInfo")}
              style={{ cursor: "pointer" }}
            />
          </ThemeIcon>
        </TopRightContainer>
      ) : (
        <TopRightContainer>
          <ThemeIcon size={ICON_SIZE} radius={ICON_SIZE}>
            <IconInfoCircle
              size="2rem"
              stroke={1.5}
              onClick={() => navigate("/gameInfo")}
              style={{ cursor: "pointer" }}
            />
          </ThemeIcon>
        </TopRightContainer>
      )}
      <Title size={56} order={1} style={{ margin: "24px" }}>
        FlagMania
      </Title>
      <Text
        size="lg"
        sx={{ lineHeight: 1 }}
        mb={5}
        style={{ marginBottom: "48px" }}
      >
        Learn about the flags of the world!
      </Text>

      <UserContainer>
        {player?.permanent ? (
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
              Sign in
            </Button>
            <Button size="xl" onClick={() => navigate("/register")}>
              Register
            </Button>
          </>
        )}
      </UserContainer>

      {!player?.permanent && !sessionStorage.getItem("FlagManiaToken") ? (
        <GuestContainer>
          <Text size="xl" sx={{ lineHeight: 1, marginBottom: "12px" }} mb={5}>
            or play as Guest
          </Text>
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
          <Text size="xl" sx={{ lineHeight: 1 }}>
            User: {player?.playerName}
          </Text>
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
