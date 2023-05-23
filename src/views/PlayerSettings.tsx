import { Player } from "../types/Player";
import { UserCardImage } from "../components/UserCard";
import { Dispatch, SetStateAction } from "react";

type PropsType = {
  player: Player | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
};

export const PlayerSettings = (props: PropsType) => {
  const { player, setPlayer } = props;

  interface UserCardImageProps {
    player: Player | undefined;
    setPlayer: Dispatch<SetStateAction<Player | undefined>>;
  }

  const userCardImageProps: UserCardImageProps = {
    player: player,
    setPlayer: setPlayer,
  };

  return <UserCardImage {...userCardImageProps} />;
};
