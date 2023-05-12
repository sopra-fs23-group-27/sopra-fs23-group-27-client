import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const PlayerGuard = (props: any) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !sessionStorage.getItem("loggedIn") ||
      sessionStorage.getItem("loggedIn") === "false"
    ) {
      navigate("/login");
    }
  }, [navigate]);

  if (sessionStorage.getItem("loggedIn") === "true") {
    return props.children;
  }
  return null;
};

PlayerGuard.propTypes = {
  children: PropTypes.node,
};
