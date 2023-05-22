import { useEffectOnce } from "../customHooks/useEffectOnce";
import { useStompClient } from "react-stomp-hooks";
import { useNavigate } from "react-router-dom";
import { RainbowLoader } from "../components/RainbowLoader";
import { notifications } from "@mantine/notifications";
import { Lobby } from "../types/Lobby";
import { SetStateAction, Dispatch } from "react";

type PropsType = {
  lobby: Lobby | undefined;
  setLobby: Dispatch<SetStateAction<Lobby | undefined>>;
  setCurrentGameRound: Dispatch<SetStateAction<number>>;
};
export const PlayAgain = (props: PropsType) => {
  const { lobby, setLobby, setCurrentGameRound } = props;
  const stompClient = useStompClient();
  const navigate = useNavigate();

  useEffectOnce(() => {
    const playerName = sessionStorage.getItem("currentPlayer");
    if (stompClient) {
      stompClient.publish({
        destination: `/app/games/${lobby?.lobbyId}/play-again`,
        body: JSON.stringify({ playerName }),
      });
      setCurrentGameRound(0);
      navigate("/lobbies/" + lobby?.lobbyId);
    } else {
      console.error("Error: could not send message");
      notifications.show({
        title: "Something went wrong",
        message: ":/",
        color: "red",
      });
    }
  });

  return <RainbowLoader />;
};
