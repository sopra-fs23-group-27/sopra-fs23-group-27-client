import { notifications } from "@mantine/notifications";
import PropTypes from "prop-types";
import { redirect } from "react-router-dom";

export const PlayerGuard = (props: any) => {
    if (sessionStorage.getItem("FlagManiaToken")) {
        return props.children;
    }
    notifications.show({
        title: "Restricted Area",
        message: "Please enter your username first or log in to your account",
        color: "red"
    });
    return redirect("/");
};

PlayerGuard.propTypes = {
    children: PropTypes.node,
};