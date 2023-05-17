import React, { Dispatch, SetStateAction } from "react";
import { UserStats } from "../components/UserStats";
import { httpPost } from "../helpers/httpService";
import styled from "styled-components";
import { notifications } from "@mantine/notifications";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import Logo from "../icons/DALL-E_FlagMania_Logo.png";
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
  align-items: center;
  height: 40vh;
  justify-content: space-between;
`;

type PropsType = {
  player: Player | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
};

export const UserDashboard = (props: PropsType) => {
  const playerName = sessionStorage.getItem("currentPlayer");
  const { player, setPlayer } = props;

  const navigate = useNavigate();

  interface UserStatsProps {
    userData: {
      link: string;
      label: string;
      stats: string;
      progress: number;
      color: string;
      icon: "up" | "down";
    }[];
  }

  const userData: UserStatsProps["userData"] = [
    {
      link: "/gamesPlayed",
      label: "Games Played",
      stats: "10",
      progress: 100,
      color: "blue",
      icon: "up",
    },
    {
      link: "/correctGuesses",
      label: "Correct Guesses",
      stats: "5",
      progress: 50,
      color: "green",
      icon: "up",
    },
    {
      link: "/wrongGuesses",
      label: "Wrong Guesses",
      stats: "5",
      progress: 50,
      color: "red",
      icon: "down",
    },
    {
      link: "/totalScore",
      label: "Total Score",
      stats: "50",
      progress: 100,
      color: "blue",
      icon: "up",
    },
  ];

  const handleUserJoin = async (
    link: "/configureGame" | "/enterGameId" | "/publicGames",
    isCreator: boolean
  ) => {
    const password = "";

    try {
      if (link === "/configureGame") {
        isCreator = true;
      }

      // get player data from session storage
      const playerId = sessionStorage.getItem("currentPlayerId");
      const playerName = sessionStorage.getItem("currentPlayer");
      const loggedIn = sessionStorage.getItem("loggedIn");

      const playerInfo = {
        playerNId: playerId,
        playerName: playerName,
        loggedIn: loggedIn,
        isCreator: isCreator,
      };

      const player = new Player(playerInfo);
      setPlayer(player);

      // navigate to the next page
      navigate(link);

      // catch errors
    } catch (error: any) {
      notifications.show({
        title: "Something went wrong",
        message: error.response.data.message,
        color: "red",
      });
    }
  };

  const handleCompareStats = async () => {
    try {
      // get player data from session storage
      const playerId = sessionStorage.getItem("currentPlayerId");
      const playerName = sessionStorage.getItem("currentPlayer");
      const loggedIn = sessionStorage.getItem("loggedIn");

      const playerInfo = {
        playerId: playerId,
        playerName: playerName,
        loggedIn: loggedIn,
      };

      const player = new Player(playerInfo);
      setPlayer(player);

      // navigate to the next page
      navigate("/compareStats");

      // catch errors
    } catch (error: any) {
      notifications.show({
        title: "Something went wrong",
        message: error.response.data.message,
        color: "red",
      });
    }
  };

  const handlePlayerSettings = async () => {
    try {
      // get player id from session storage
      const playerId = sessionStorage.getItem("currentPlayerId");

      // navigate to the next page
      navigate("/playerSettings/" + playerId);

      // catch errors
    } catch (error: any) {
      notifications.show({
        title: "Something went wrong",
        message: error.response.data.message,
        color: "red",
      });
    }
  };

  const handleLogout = async () => {
    // get player id from session storage
    const playerId = sessionStorage.getItem("currentPlayerId");
    try {
      const res = await httpPost(
        "/players/" + playerId + "/logout" + "?playerId=" + playerId,
        {},
        { headers: { Authorization: sessionStorage.getItem("FlagManiaToken") } }
      );

      // reset the session storage
      sessionStorage.setItem("loggedIn", "false");
      sessionStorage.setItem("currentPlayer", "");
      sessionStorage.setItem("currentPlayerId", "");
      sessionStorage.setItem("FlagManiaToken", "");
      console.log(res);
      navigate("/");
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: "Something went wrong, the player could not be logged out",
        color: "red",
      });
      console.log(error);
    }
  };

  return (
    <Container>
      <img
        src={Logo}
        alt="FlagMania Logo"
        onClick={() => navigate("/")}
        style={{
          top: "10px",
          left: "10px",
          padding: "10px",
          width: "5%",
          height: "auto",
          position: "absolute",
          cursor: "pointer",
        }}
      />
      <h1>Welcome back {playerName}, enjoy some nice stats</h1>
      <UserStats userData={userData} />
      <p><i>Compare yourself to others by clicking one of the statistics</i></p>
      <ButtonContainer>
        {/* <Button onClick={() => handleCompareStats()}>
          Compare to other players
        </Button> */}
        <Button
          disabled={!playerName}
          onClick={() => handleUserJoin("/publicGames", false)}
        >
          Join Public Game
        </Button>
        <Button
          disabled={!playerName}
          onClick={() => handleUserJoin("/enterGameId", false)}
        >
          Join Private Game
        </Button>
        <Button
          disabled={!playerName}
          onClick={() => handleUserJoin("/configureGame", true)}
        >
          Create New Game
        </Button>
      </ButtonContainer>
      <Button onClick={() => handlePlayerSettings()}> Player Settings </Button>
      <Button onClick={() => handleLogout()}> Logout </Button>
    </Container>
  );
};
