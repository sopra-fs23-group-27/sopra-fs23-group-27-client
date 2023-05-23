import { Player } from "../types/Player";
import { UserCardImage } from "../components/UserCard";

type PropsType = {
  player: Player | undefined;
};

export const PlayerSettings = (props: PropsType) => {
  const { player } = props;

  // get player name from player object
  const playerName = player?.playerName;

  interface UserCardImageProps {
    name: string;
    stats: { label: string; value: string }[];
  }

  const userCardImageProps: UserCardImageProps = {
    name: player?.playerName ? player?.playerName : "",
    stats: [
      { label: "Wins", value: "10" },
      { label: "Losses", value: "10" },
      { label: "Win Rate", value: "50%" },
    ],
  };

  return <UserCardImage {...userCardImageProps} />;
};
