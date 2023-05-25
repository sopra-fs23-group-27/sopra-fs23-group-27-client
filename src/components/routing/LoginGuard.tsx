import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "../../types/Player";

type PropsType = {
  player: Player | undefined;
  children: any;
};

export const LoginGuard = (props: PropsType) => {
  const navigate = useNavigate();
  const { player } = props;

  useEffect(() => {
    if (player?.permanent) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return props.children;
};

LoginGuard.propTypes = {
  children: PropTypes.node,
};
