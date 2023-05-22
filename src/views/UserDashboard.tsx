import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UserStats } from "../components/UserStats";
import { httpGet, httpPost } from "../helpers/httpService";
import styled from "styled-components";
import { notifications } from "@mantine/notifications";
import { Button, ThemeIcon, createStyles, rem } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Player } from "../types/Player";
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
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

export const UserDashboard = (props: PropsType) => {
  const { classes } = useStyles();
  const { setPlayer, player, setIsLoggedIn } = props;
  const [nRoundsPlayed, setNRoundsPlayed] = useState(0);
  const [
    overallTotalNumberOfCorrectGuesses,
    setOverallTotalNumberOfCorrectGuesses,
  ] = useState(0);
  const [
    overallTotalNumberOfWrongGuesses,
    setOverallTotalNumberOfWrongGuesses,
  ] = useState(0);
  const [unansweredFlags, setUnansweredFlags] = useState(0);
  const [ratioOfUnansweredFlags, setRatioOfUnansweredFlags] = useState(0);
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

      // calculate number of unanswered flags
      setUnansweredFlags(
        response.data.nRoundsPlayed -
          response.data.totalCorrectGuesses -
          response.data.numWrongGuesses
      );

      // calculate ratio of unanswered flags
      setRatioOfUnansweredFlags(
        Math.round(
          ((response.data.nRoundsPlayed -
            response.data.totalCorrectGuesses -
            response.data.numWrongGuesses) /
            response.data.nRoundsPlayed) *
            100
        )
      );

      // calculate ration of correct guesses
      setRatioOfCorrectGuesses(
        Math.round(
          (response.data.totalCorrectGuesses /
            (response.data.totalCorrectGuesses +
              response.data.numWrongGuesses +
              (response.data.nRoundsPlayed -
                response.data.totalCorrectGuesses -
                response.data.numWrongGuesses))) *
            100
        )
      );

      setRatioOfWrongGuesses(
        Math.round(
          (response.data.numWrongGuesses /
            (response.data.totalCorrectGuesses +
              response.data.numWrongGuesses +
              (response.data.nRoundsPlayed -
                response.data.totalCorrectGuesses -
                response.data.numWrongGuesses))) *
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
      label: "Unanswered Flags",
      stats: unansweredFlags,
      progress: ratioOfUnansweredFlags,
      color: "orange",
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
      notifications.show({
        title: "Success",
        message: "You have successfully logged out",
        color: "green",
      });

      // set player to undefined and isLoggedIn in to false
      setPlayer(undefined);
      setIsLoggedIn(false);

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
    <Application>
      <ThemeIcon className={classes.icon} size={ICON_SIZE} radius={ICON_SIZE}>
        <IconInfoCircle
          size="2rem"
          stroke={1.5}
          onClick={() => navigate("/gameInfo")}
          style={{ cursor: "pointer" }}
        />
      </ThemeIcon>
      <h1>Welcome {player?.playerName}</h1>
      <UserStats userData={userData} />
      <ButtonContainer>
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
      <Button color="red" onClick={() => handleLogout()}>
        {" "}
        Logout{" "}
      </Button>
    </Application>
  );
};
