import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "../../types/Player";

type PropsType = {
  player: Player | undefined;
  children: any;
};

export const PlayerGuard = (props: PropsType) => {
  const navigate = useNavigate();
  const { player } = props;

  useEffect(() => {
    if (
      !player?.permanent
    ) {
      navigate("/login");
    }
  }, [navigate]);

  if (player?.permanent) {
    return props.children;
  }
  return null;
};

PlayerGuard.propTypes = {
  children: PropTypes.node,
};
