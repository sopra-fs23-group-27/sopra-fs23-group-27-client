import styled from "styled-components";
import { useState, useEffect } from "react";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { httpPost } from "../helpers/httpService";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { Button as MantineButton } from "@mantine/core";

const Application = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: #f5f7f9;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid rgb(216, 216, 216);
  border-radius: 10px;
  padding: 32px 64px;
  align-items: center;
`;
type props = {
  isActive: boolean;
};
const Button = styled.button<props>`
  cursor: ${(props) => (props.isActive ? "pointer" : "not-allowed")};
  background-color: ${(props) =>
    props.isActive ? "rgb(34, 139, 230)" : "lightgray"};
  color: ${(props) => (props.isActive ? "white" : "gray")};
  border: none;
  text-align: center;
  padding: 16px 64px;
  margin: 30px 0 50px;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#1c7ed6" : "lightgray")};
  }
`;

export const Register = () => {
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordRepetitionInput, setPasswordRepetitionInput] = useState("");
  const [isFormFilledOut, setIsFormFilledOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const formCheck = () => {
      if (!nameInput) {
        return false;
      }

      if (passwordInput.length < 6) {
        return false;
      }
      if (passwordInput !== passwordRepetitionInput) {
        return false;
      }

      return true;
    };

    setIsFormFilledOut(formCheck());
  }, [nameInput, passwordInput, passwordRepetitionInput]);

  const registerUser = async () => {
    try {
      const res = await httpPost(
        "/registration",
        {
          playerName: nameInput,
          password: passwordInput,
        },
        { headers: {} }
      );

      // Store the token into the session storage.
      sessionStorage.setItem("FlagManiaToken", res.headers.authorization);

      // Store the ID of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayerId", res.data.id);

      // Store the Name of the currently logged-in user in sessionStorage
      sessionStorage.setItem("currentPlayer", res.data.playerName);

      // Store login status of the current user
      sessionStorage.setItem("loggedIn", "true");

      // show notification that player has been registered
      notifications.show({
        title: "Success",
        message: "Welcome to the party, " + res.data.playerName + "!",
        color: "green",
      });
      navigate("/login");
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
        <h1>Register</h1>
        <FloatingTextInput
          label="Name"
          value={nameInput}
          onChange={setNameInput}
        />
        <p>
          Minimum password length: <br />6 characters
        </p>
        <FloatingTextInput
          label="Password"
          value={passwordInput}
          onChange={setPasswordInput}
        />
        <FloatingTextInput
          label="repeat Password"
          value={passwordRepetitionInput}
          onChange={setPasswordRepetitionInput}
        />
        <Button
          isActive={isFormFilledOut}
          disabled={!isFormFilledOut}
          onClick={registerUser}
        >
          Register
        </Button>
        <p>Already got an account?</p>
        <MantineButton onClick={() => navigate("/login")}>Login</MantineButton>
      </Container>
    </Application>
  );
};
