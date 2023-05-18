import { notifications } from "@mantine/notifications";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

interface Props {
  shouldPreventReload: boolean;
  children: React.ReactNode;
}

export const FlagManiaGuard = ({ shouldPreventReload, children }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lobbyId } = useParams();

  const handleNotLoggedIn = () => {
    if (
      sessionStorage.getItem("FlagManiaToken")
    //   sessionStorage.getItem("lobbyId") === lobbyId
    ) {
      return children;
    }
    notifications.show({
      title: "Restricted Area",
      message: "Please enter your username first or log in to your account",
      color: "red",
    });
    navigate("/");
  };

  // handle back and forward
  const handleNavigation = (event: PopStateEvent) => {
    // Restore the current route and prevent the navigation
    navigate(location.pathname, { replace: true });
  };

  // handle reload and close
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (shouldPreventReload) {
      // ask user if they want to leave
      event.preventDefault();
      event.returnValue = "Do you really want to leave?";
    }
  };

  const handleUnload = () => {
    // delete session storage
    sessionStorage.removeItem("lobbyId");
    sessionStorage.removeItem("lobbyName");
    navigate("/");
  };

  useEffect(() => {
    handleNotLoggedIn();
    // Add the event listeners when the component mounts
    window.addEventListener('popstate', handleNavigation);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [location.pathname, shouldPreventReload]);

  return <>{children}</>;
};

FlagManiaGuard.propTypes = {
  children: PropTypes.node,
};
