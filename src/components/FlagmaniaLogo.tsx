import styled from "styled-components";
import FlagLogo from "../icons/DALL-E_FlagMania_Logo.png";
import { useNavigate, useParams } from "react-router-dom";
import { httpPost, httpPut } from "../helpers/httpService";
import { notifications } from "@mantine/notifications";

const FlagManiaLogo = styled.img`
  top: 10px;
  left: 10px;
  padding: 10px;
  width: 180px;
  height: auto;
  position: absolute;
  z-index: 1;
  cursor: pointer;
  transition: transform 200ms ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
  @media (max-width: 700px) {
    width: 100px;
  }
  @media (max-width: 550px) {
    top: 5px;
    left: 5px;
    width: 70px;
  }
`;

export const FlagmaniaLogo = () => {
  const navigate = useNavigate();
  const { lobbyId } = useParams();

  const handleLeaveLobby = async () => {
    try {
      await httpPut(
        "/lobbies/" + lobbyId + "/leave",
        {},
        { headers: { Authorization: sessionStorage.getItem("FlagManiaToken") } }
      );
      // delete lobby from session storage
      sessionStorage.removeItem("lobbyId");
      sessionStorage.removeItem("lobbyName");

      // navigate to dashboard
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

  const handleClickedLogo = () => {
    if (sessionStorage.getItem("loggedIn") === "true") {
      handleLeaveLobby();
    } else if (sessionStorage.getItem("loggedIn") === "false") {
      handleLogout();
    } else {
      navigate("/");
    }
  };


  return <FlagManiaLogo onClick={() => handleClickedLogo()} src={FlagLogo} />;
};
