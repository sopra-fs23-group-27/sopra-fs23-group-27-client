import styled from "styled-components";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { httpPut } from "../helpers/httpService";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import Player from "../models/Player";

import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Group,
} from "@mantine/core";

const Application = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   border: 2px solid rgb(216, 216, 216);
//   border-radius: 10px;
//   padding: 32px 64px;
//   align-items: center;
// `;
// type props = {
//   isActive: boolean;
// };
// const Button = styled.button<props>`
//   cursor: ${(props) => (props.isActive ? "pointer" : "not-allowed")};
//   background-color: ${(props) =>
//     props.isActive ? "rgb(34, 139, 230)" : "lightgray"};
//   color: ${(props) => (props.isActive ? "white" : "gray")};
//   border: none;
//   text-align: center;
//   padding: 16px 64px;
//   margin: 30px 0 50px;

//   &:hover {
//     background-color: ${(props) => (props.isActive ? "#1c7ed6" : "lightgray")};
//   }
// `;

type PropsType = {
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
};
export const RegisterToSaveStats = (props: PropsType) => {
  const { setPlayer } = props;
  const guestName = sessionStorage.getItem("currentPlayer") || "";
  const [nameInput, setNameInput] = useState(guestName);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordRepetitionInput, setPasswordRepetitionInput] = useState("");
  const [isFormFilledOut, setIsFormFilledOut] = useState(false);
  const navigate = useNavigate();

  const handleNameInputChange = (event: {
    currentTarget: { value: SetStateAction<string> };
  }) => {
    setNameInput(event.currentTarget.value);
  };

  const handlePasswordInputChange = (event: {
    currentTarget: { value: SetStateAction<string> };
  }) => {
    setPasswordInput(event.currentTarget.value);
  };

  const handlePasswordRepetitionInputChange = (event: {
    currentTarget: { value: SetStateAction<string> };
  }) => {
    setPasswordRepetitionInput(event.currentTarget.value);
  };

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
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };
      const playerId = sessionStorage.getItem("currentPlayerId");
      console.log("playerId: ", playerId);
      const res = await httpPut(
        `/players/${playerId}`,
        {
          playerName: nameInput,
          password: passwordInput,
          permanent: true,
        },
        { headers }
      );
      setPlayer(res.data);

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
        message: err.response.data.message,
        color: "red",
      });
      console.error(err);
    }
  };

  //   return (
  //     <Application>
  //       <Container>
  //         <h1>Register</h1>
  //         <FloatingTextInput
  //           label="Name"
  //           value={nameInput}
  //           onChange={setNameInput}
  //         />
  //         <p>
  //           Minimum password length: <br />6 characters
  //         </p>
  //         <FloatingTextInput
  //           label="Password"
  //           value={passwordInput}
  //           onChange={setPasswordInput}
  //         />
  //         <FloatingTextInput
  //           label="repeat Password"
  //           value={passwordRepetitionInput}
  //           onChange={setPasswordRepetitionInput}
  //         />
  //         <Button
  //           isActive={isFormFilledOut}
  //           disabled={!isFormFilledOut}
  //           onClick={registerUser}
  //         >
  //           Register
  //         </Button>
  //       </Container>
  //     </Application>
  //   );
  // };

  return (
    <Application>
      <Container size="xl" my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Register to join the party!
        </Title>
        <Text color="dimmed" size="xl" align="center" mt={5}>
          Already have an account?{" "}
          <Anchor
            size="xl"
            component="button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Username"
            placeholder="Username"
            value={nameInput}
            onChange={handleNameInputChange}
            size="xl"
            required
          />
          <Text color="dimmed" size="md" align="center" mt={5}>
            Minimum password length: 6 characters
          </Text>
          <PasswordInput
            label="Password"
            placeholder="Password"
            value={passwordInput}
            onChange={handlePasswordInputChange}
            size="xl"
            required
            mt="md"
          />
          <PasswordInput
            label="Password"
            placeholder="repeat Password"
            value={passwordRepetitionInput}
            onChange={handlePasswordRepetitionInputChange}
            size="xl"
            required
            mt="md"
          />
          <Group position="apart" mt="lg"></Group>
          <Button
            onClick={registerUser}
            disabled={!isFormFilledOut}
            fullWidth
            size="xl"
          >
            Register
          </Button>
        </Paper>
      </Container>
    </Application>
  );
};
