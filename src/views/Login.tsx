import { useState, useEffect } from "react";
import styled from "styled-components";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { httpPost } from "../helpers/httpService";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";

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
      const res = await httpPost("/login", {
        playername: nameInput,
        password: passwordInput,
      }, {headers: {}});
      console.log(res);
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
        <p>Go to registration page: <Link to="/register">Register</Link></p>
      </Container>
    </Application>
  );
};
