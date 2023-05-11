import styled from "styled-components";
import { useEffect, useState } from "react";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { httpPost } from "../helpers/httpService";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

const Application = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
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

export const Register = () => {
  const [nameInput, setNameInput] = useState("");
  const [mailInput, setMailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordRepetitionInput, setPasswordRepetitionInput] = useState("");
  const [isFormFilledOut, setIsFormFilledOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const formCheck = () => {
      if (!nameInput) {
        return false;
      }

      if (!mailInput.includes("@") || !mailInput.includes(".")) {
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
  }, [nameInput, mailInput, passwordInput, passwordRepetitionInput]);

  const registerUser = async () => {
    try {
      const res = await httpPost("/registration", {
        playerName: nameInput,
        password: passwordInput,
      }, {headers: {}});

      // set the session storage
      sessionStorage.setItem("currentPlayerId", res.data.id);
      sessionStorage.setItem("currentPlayer", res.data.playerName);
      sessionStorage.setItem("FlagManiaToken", res.headers.authorization);
      sessionStorage.setItem("loggedIn", "true");

      // show notification that player has been registered
      notifications.show({
        title: "Success",
        message: "Welcome to the party, " + res.data.playerName + "!",
        color: "green",
      });
      navigate("/login")
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
        <FloatingTextInput
          label="Email"
          value={mailInput}
          onChange={setMailInput}
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
        <Button isActive={isFormFilledOut} disabled={!isFormFilledOut} onClick={registerUser}>
          Register
        </Button>
      </Container>
    </Application>
  );
};
