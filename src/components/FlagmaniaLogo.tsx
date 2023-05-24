import styled from "styled-components";
import FlagLogo from "../icons/DALL-E_FlagMania_Logo.png";
import { useNavigate } from "react-router-dom";
import { httpPost, httpPut } from "../helpers/httpService";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { Player } from "../types/Player";
import { Lobby } from "../types/Lobby";
import { Dispatch, SetStateAction } from "react";

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

type PropsType = {
  player: Player | undefined;
  lobby: Lobby | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
  setLobby: Dispatch<SetStateAction<Lobby | undefined>>;
};

export const FlagmaniaLogo = (props: PropsType) => {
  const navigate = useNavigate();
  const { player, lobby, setPlayer, setLobby } =
    props;

  const userConfirmationLobby = async () => {
    modals.openConfirmModal({
      title: "Leave game",
      children: "Are you sure you want to leave the game already?",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: async () => {
        handleLeaveLobby();
      },
    });
  };

  const handleLeaveLobby = async () => {
    try {
      await httpPut(
        "/lobbies/" + lobby?.lobbyId + "/leave",
        {},
        { headers: { Authorization: sessionStorage.getItem("FlagManiaToken") } }
      );

      // set lobby to undefined
      setLobby(undefined);

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


  const handleClickedLogo = () => {
    if (player && lobby) {
      console.log("leave lobby");
      // prompt player if they really want to leave the lobby/game
      userConfirmationLobby();
    } else {
      console.log("else");
      navigate("/");
    }
  };

  return <FlagManiaLogo onClick={() => handleClickedLogo()} src={FlagLogo} />;
};