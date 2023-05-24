import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UserStats } from "../components/UserStats";
import { httpDelete, httpGet, httpPost } from "../helpers/httpService";
import styled from "styled-components";
import { notifications } from "@mantine/notifications";
import { Button, ThemeIcon, createStyles, rem, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Player } from "../types/Player";
import { IconInfoCircle } from "@tabler/icons-react";
import { modals } from "@mantine/modals";

const ICON_SIZE = rem(60);

const useStyles = createStyles((theme) => ({
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

const Application = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 38px;
  color: black;
  text-align: center;
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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
  justify-content: space-between;
`;

type PropsType = {
  player: Player | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
};

export const UserDashboard = (props: PropsType) => {
  const { classes } = useStyles();
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
      
      // calculate ration of wrong guesses
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
      label: "Avg Guessing Speed",
      stats: guessingSpeed + "s",
      progress: 100,
      color: "blue",
      icon: "up",
    },
  ];

  const userConfirmationDelete = async () => {
    modals.openConfirmModal({
      title: "Danger Zone",
      children:
        "We are sad to see you leave, are you really sure you want to delete your profile including your progress?",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: async () => {
        handleDeletePlayer();
      },
    });
  };

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

  const handleDeletePlayer = async () => {
    // get player id from session storage
    const playerId = sessionStorage.getItem("currentPlayerId");
    try {
      await httpDelete("/players/" + playerId, {
        headers: { Authorization: sessionStorage.getItem("FlagManiaToken") },
      });
      notifications.show({
        title: "Success",
        message: "You have successfully deleted your profile",
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

  return (
    <Application>
      <TopRightContainer>
        <Button
          size="md"
          onClick={() => handlePlayerSettings()}
          style={{ marginBottom: "12px" }}
        >
          Player Settings
        </Button>
        <Button size="md" color="red" onClick={() => handleLogout()}>
          Logout
        </Button>
        <Button
          size="md"
          sx={(theme) => ({
            backgroundColor:
              theme.colors.dark[theme.colorScheme === "dark" ? 9 : 6],
            color: "#fff",
            "&:hover": {
              backgroundColor:
                theme.colors.dark[theme.colorScheme === "dark" ? 9 : 6],
            },
          })}
          onClick={() => userConfirmationDelete()}
        >
          Delete Profile
        </Button>
        <ThemeIcon size={ICON_SIZE} radius={ICON_SIZE}>
          <IconInfoCircle
            size="2rem"
            stroke={1.5}
            onClick={() => navigate("/gameInfoDashboard")}
            style={{ cursor: "pointer" }}
          />
        </ThemeIcon>
      </TopRightContainer>
      <h1>Welcome {player?.playerName}</h1>
      <UserStats userData={userData} />
      <p style={{ marginTop: "200px" }}>
        Jump right into the game and improve your stats!
      </p>
      <ButtonContainer>
        <Button
          size="xl"
          disabled={!player?.playerName}
          onClick={() => handleUserJoin("/publicGames", false)}
        >
          Join Public Game
        </Button>
        <Button
          size="xl"
          disabled={!player?.playerName}
          onClick={() => handleUserJoin("/enterGameId", false)}
        >
          Join Private Game
        </Button>
        <Button
          size="xl"
          disabled={!player?.playerName}
          onClick={() => handleUserJoin("/configureGame", true)}
        >
          Create New Game
        </Button>
      </ButtonContainer>
    </Application>
  );
};
