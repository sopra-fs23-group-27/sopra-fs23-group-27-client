import { useEffectOnce } from "../customHooks/useEffectOnce";
import { useStompClient } from "react-stomp-hooks";
import { useNavigate } from "react-router-dom";
import { RainbowLoader } from "../components/RainbowLoader";
import { notifications } from "@mantine/notifications";

type PropsType = {
  lobbyId: number | undefined;
};
export const PlayAgain = (props: PropsType) => {
  const { lobbyId } = props;
  const stompClient = useStompClient();
  const navigate = useNavigate();

  useEffectOnce(() => {
    const playerName = sessionStorage.getItem("currentPlayer");
    if (stompClient) {
      stompClient.publish({
        destination: `/app/games/${lobbyId}/play-again`,
        body: JSON.stringify({ playerName }),
      });
      navigate("/lobbies/" + lobbyId);
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
