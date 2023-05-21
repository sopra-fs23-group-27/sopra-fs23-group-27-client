import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UserStats } from "../components/UserStats";
import { httpGet, httpPost } from "../helpers/httpService";
import styled from "styled-components";
import { notifications } from "@mantine/notifications";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
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
  gap: 32px;
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
  const { setPlayer, player } = props;
  const [nRoundsPlayed, setNRoundsPlayed] = useState(0);
  const [
    overallTotalNumberOfCorrectGuesses,
    setOverallTotalNumberOfCorrectGuesses,
  ] = useState(0);
  const [
    overallTotalNumberOfWrongGuesses,
    setOverallTotalNumberOfWrongGuesses,
  ] = useState(0);
  const [
    overallTotalTimeUntilCorrectGuess,
    setOverallTotalTimeUntilCorrectGuess,
  ] = useState(0);
  const [ratioOfCorrectGuesses, setRatioOfCorrectGuesses] = useState(0);
  const [ratioOfWrongGuesses, setRatioOfWrongGuesses] = useState(0);
  const [guessingSpeed, setGuessingSpeed] = useState(0);

  const navigate = useNavigate();

  // get user stats on page load
  useEffect(() => {
    getUserStats();
  }, []);

  const getUserStats = async () => {
    try {
      const response = await httpGet(`/players/${player?.id}`, {
        headers: {
          Authorization: sessionStorage.getItem("FlagManiaToken"),
        },
      });
      setNRoundsPlayed(response.data.nRoundsPlayed);
      setOverallTotalNumberOfCorrectGuesses(response.data.totalCorrectGuesses);
      setOverallTotalNumberOfWrongGuesses(response.data.numWrongGuesses);
      setOverallTotalTimeUntilCorrectGuess(response.data.timeUntilCorrectGuess);

      // calculate ration of correct guesses
      setRatioOfCorrectGuesses(
        Math.round(
          (response.data.totalCorrectGuesses /
            (response.data.totalCorrectGuesses +
              response.data.numWrongGuesses)) *
            100
        )
      );

      setRatioOfWrongGuesses(
        Math.round(
          (response.data.numWrongGuesses /
            (response.data.totalCorrectGuesses +
              response.data.numWrongGuesses)) *
            100
        )
      );

      // guessing speed
      if (response.data.nRoundsPlayed === 0) {
        setGuessingSpeed(0);
      } else {
        setGuessingSpeed(
          Math.round(
            response.data.timeUntilCorrectGuess / response.data.nRoundsPlayed
          )
        );
      }
    } catch (error: any) {
      console.error(error.response.data.message);
      notifications.show({
        title: "Error",
        message: error.response.data.message,
        color: "red",
      });
    }
  };

  interface UserStatsProps {
    userData: {
      label: string;
      stats: number | string;
      progress: number;
      color: string;
      icon: "up" | "down";
    }[];
  }

  const userData: UserStatsProps["userData"] = [
    {
      label: "Rounds Played",
      stats: nRoundsPlayed,
      progress: 100,
      color: "blue",
      icon: "up",
    },
    {
      label: "Correct Guesses",
      stats: overallTotalNumberOfCorrectGuesses,
      progress: ratioOfCorrectGuesses,
      color: "green",
      icon: "up",
    },
    {
      label: "Wrong Guesses",
      stats: overallTotalNumberOfWrongGuesses,
      progress: ratioOfWrongGuesses,
      color: "red",
      icon: "down",
    },
    {
      label: "Avg Guessing Speed",
      stats: guessingSpeed + "s",
      progress: 100,
      color: "blue",
      icon: "up",
    },
  ];

  const handleUserJoin = async (
    link: "/configureGame" | "/enterGameId" | "/publicGames",
    isCreator: boolean
  ) => {
    try {
      if (link === "/configureGame") {
        isCreator = true;
      }

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
      await httpPost(
        "/players/" + playerId + "/logout" + "?playerId=" + playerId,
        {},
        { headers: { Authorization: sessionStorage.getItem("FlagManiaToken") } }
      );

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

  return (
    <Container>
      <h1>Welcome {player?.playerName}</h1>
      <UserStats userData={userData} />
      {/* <p>
        <i>Compare yourself to others by clicking one of the statistics</i>
      </p> */}
      <ButtonContainer>
        {/* <Button onClick={() => handleCompareStats()}>
          Compare to other players
        </Button> */}
        <Button
          disabled={!player?.playerName}
          onClick={() => handleUserJoin("/publicGames", false)}
        >
          Join Public Game
        </Button>
        <Button
          disabled={!player?.playerName}
          onClick={() => handleUserJoin("/enterGameId", false)}
        >
          Join Private Game
        </Button>
        <Button
          disabled={!player?.playerName}
          onClick={() => handleUserJoin("/configureGame", true)}
        >
          Create New Game
        </Button>
      </ButtonContainer>

      <Button
        onClick={() => handlePlayerSettings()}
        style={{ marginBottom: "12px" }}
      >
        Player Settings{" "}
      </Button>
      <Button color="red" onClick={() => handleLogout()}> Logout </Button>
    </Container>
  );
};
