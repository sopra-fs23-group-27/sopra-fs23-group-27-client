import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserDashboard } from "../../views/UserDashboard";

export const LoginGuard = (props: any) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("loggedIn") === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);
  
  if (
    sessionStorage.getItem("loggedIn") === "false" ||
    sessionStorage.getItem("loggedIn") === null
  ) {
    return props.children;
  } 

  return null;
};

LoginGuard.propTypes = {
  children: PropTypes.node,
};
