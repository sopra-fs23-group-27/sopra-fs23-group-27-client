import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type PropsType = {
  isLoggedIn: boolean;
  children: any;
};

export const LoginGuard = (props: PropsType) => {
  const navigate = useNavigate();
  const { isLoggedIn } = props;

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [navigate]);
  
  if (
    !isLoggedIn
  ) {
    return props.children;
  } 

  return null;
};

LoginGuard.propTypes = {
  children: PropTypes.node,
};
