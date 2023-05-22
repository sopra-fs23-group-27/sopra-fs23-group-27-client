import { Dispatch, SetStateAction } from "react";
import { Player } from "../types/Player";
import { UserCardImage } from "../components/UserCard";

type PropsType = {
  player: Player | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
};

export const PlayerSettings = () => {
  // get player data from session storage
  const playerId = sessionStorage.getItem("currentPlayerId");
  const playerName = sessionStorage.getItem("currentPlayer");
  const loggedIn = sessionStorage.getItem("loggedIn");

  interface UserCardImageProps {
    name: string;
    stats: { label: string; value: string }[];
  }

  const userCardImageProps: UserCardImageProps = {
    name: playerName ? playerName : "",
    stats: [
      { label: "Wins", value: "10" },
      { label: "Losses", value: "10" },
      { label: "Win Rate", value: "50%" },
    ],
  };

  return <UserCardImage {...userCardImageProps} />;
};
