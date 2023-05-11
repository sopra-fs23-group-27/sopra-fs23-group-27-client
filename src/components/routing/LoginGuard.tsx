import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { UserDashboard } from "../../views/UserDashboard";

export const LoginGuard = (props: any) => {
    if (sessionStorage.getItem("loggedIn") === "false" || sessionStorage.getItem("loggedIn") === null) {
        return props.children;
    }
    notifications.show({
        title: "Ready",
        message: "Jump right into the game!",
        color: "teal",
        icon: <IconCheck size="1.1rem" />
    });
    return UserDashboard();
};

LoginGuard.propTypes = {
    children: PropTypes.node,
};