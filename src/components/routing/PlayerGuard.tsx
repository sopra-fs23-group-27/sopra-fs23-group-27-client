import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type PropsType = {
  isLoggedIn: boolean;
  children: any;
};

export const PlayerGuard = (props: PropsType) => {
  const navigate = useNavigate();
  const { isLoggedIn } = props;

  useEffect(() => {
    if (
      !isLoggedIn
    ) {
      navigate("/login");
    }
  }, [navigate]);

  if (isLoggedIn) {
    return props.children;
  }
  return null;
};

PlayerGuard.propTypes = {
  children: PropTypes.node,
};
