import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { UserDashboard } from "../../views/UserDashboard";

export const PlayerGuard = (props: any) => {
  if (
    sessionStorage.getItem("loggedIn") === "false" ||
    sessionStorage.getItem("loggedIn") === null
  ) {
    return props.children;
  }
  return UserDashboard();
};

PlayerGuard.propTypes = {
  children: PropTypes.node,
};
