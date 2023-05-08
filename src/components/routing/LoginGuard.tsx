import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export const LoginGuard = (props: any) => {
    const navigate = useNavigate();
    if (sessionStorage.getItem("FlagManiaToken") && sessionStorage.getItem("role") === "creator") {
        return props.children;
    }
    notifications.show({
        title: "Ready",
        message: "Jump right into the game!",
        color: "teal",
        icon: <IconCheck size="1.1rem" />
    });
    return navigate("/publicGames");
};

LoginGuard.propTypes = {
    children: PropTypes.node,
};