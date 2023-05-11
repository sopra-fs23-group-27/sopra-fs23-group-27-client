import React from "react";
import { UserStats } from "../components/UserStats";
import { httpPost } from "../helpers/httpService";
import styled from "styled-components";
import { notifications } from "@mantine/notifications";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 38px;
`;

export const UserDashboard = () => {
  const user = sessionStorage.getItem("currentPlayer");

  interface UserStatsProps {
    userData: {
      label: string;
      stats: string;
      progress: number;
      color: string;
      icon: "up" | "down";
    }[];
  }

  const userData: UserStatsProps["userData"] = [
    {
      label: "Games Played",
      stats: "10",
      progress: 100,
      color: "blue",
      icon: "up",
    },
    {
      label: "Games Won",
      stats: "5",
      progress: 50,
      color: "green",
      icon: "up",
    },
    {
      label: "Games Lost",
      stats: "5",
      progress: 50,
      color: "red",
      icon: "down",
    },
  ];

  const handleLogout = async () => {
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
      // reload the page
      window.location.reload();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    }
  };

  return (
    <Container>
      <h1>Welcome back {user}, enjoy some nice stats</h1>
      <UserStats userData={userData} />
      <button onClick={handleLogout}>Logout</button>
    </Container>
  );
};