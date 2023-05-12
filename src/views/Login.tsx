import { useState, useEffect } from "react";
import styled from "styled-components";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { httpPost } from "../helpers/httpService";
import { notifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../icons/DALL-E_FlagMania_Logo.png";

const Application = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

type props = {
  isActive: boolean;
};
const Button = styled.button<props>`
  cursor: ${(props) => (props.isActive ? "pointer" : "not-allowed")};
  background-color: ${(props) => (props.isActive ? "lightgray" : "white")};
  text-align: center;
  border: 3px solid lightgray;
  padding: 8px 16px;
`;

export const Login = () => {
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isFormFilledOut, setIsFormFilledOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const formCheck = () => {
      if (!nameInput) {
        return false;
      }
      if (!passwordInput) {
        return false;
      }
      return true;
    };
    setIsFormFilledOut(formCheck());
  }, [nameInput, passwordInput]);

  const loginUser = async () => {
    try {
      const res = await httpPost(
        "/login",
        {
          playerName: nameInput,
          password: passwordInput,
        },
        { headers: {} }
      );

      // Store the token into the session storage.
      sessionStorage.setItem("FlagManiaToken", res.headers.authorization);

      // Store the ID of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayerId", res.data.playerId);

      // Store the Name of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayer", res.data.playerName);

      // Store login status of the current user
      sessionStorage.setItem("loggedIn", "true");

      // show notification that player has succsessfully logged in
      notifications.show({
        title: "Success",
        message: "Welcome back, " + res.data.playerName + "!",
        color: "green",
      });
      navigate("/");
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err.message,
        color: "red",
      });
    }
  };

  return (
    <Application>
      <Container>
        <img
          src={Logo}
          alt="FlagMania Logo"
          onClick={() => navigate("/")}
          style={{
            top: "10px",
            left: "10px",
            padding: "10px",
            width: "5%",
            height: "auto",
            position: "absolute",
            cursor: "pointer",
          }}
        />
        <h1>Login</h1>
        <FloatingTextInput
          label="Name"
          value={nameInput}
          onChange={setNameInput}
        />
        <FloatingTextInput
          label="Password"
          value={passwordInput}
          onChange={setPasswordInput}
        />
        <Button
          isActive={isFormFilledOut}
          onClick={loginUser}
          disabled={!isFormFilledOut}
        >
          Login
        </Button>
        <p>
          Go to registration page: <Link to="/register">Register</Link>
        </p>
      </Container>
    </Application>
  );
};
