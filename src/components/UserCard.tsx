import {
  createStyles,
  Card,
  Avatar,
  Text,
  Group,
  Button as MantineButton,
  rem,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatingTextInput } from "../components/FloatingTextInput";
import styled from "styled-components";
import { httpPut } from "../helpers/httpService";
import { notifications } from "@mantine/notifications";

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

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  avatar: {
    border: `${rem(2)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
    }`,
  },
}));

interface UserCardImageProps {
  name: string;
  stats: { label: string; value: string }[];
}

export function UserCardImage({ name, stats }: UserCardImageProps) {
  const { classes, theme } = useStyles();
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordRepetitionInput, setPasswordRepetitionInput] = useState("");
  const [isFormFilledOut, setIsFormFilledOut] = useState(false);
  const navigate = useNavigate();

  function handleUpdateProfile() {
    if (showUpdateProfile) {
      setShowUpdateProfile(false);
    } else {
      setShowUpdateProfile(true);
    }
  }

  useEffect(() => {
    const formCheck = () => {
      if (!nameInput && !passwordInput && !passwordRepetitionInput) {
        return false;
      }

      if (passwordInput && passwordInput.length < 6) {
        return false;
      }
      if (passwordInput && passwordInput !== passwordRepetitionInput) {
        return false;
      }

      return true;
    };

    setIsFormFilledOut(formCheck());
  }, [nameInput, passwordInput, passwordRepetitionInput]);

  const updateUser = async () => {
    try {
      const res = await httpPut(
        "/players/" + sessionStorage.getItem("currentPlayerId"),
        {
          playerName: nameInput,
          password: passwordInput,
        },
        { headers: { Authorization: sessionStorage.getItem("FlagManiaToken") } }
      );
      
      // store the new token in sessionStorage
      sessionStorage.setItem("FlagManiaToken", res.headers.authorization);

      // Store the new name (if applicable) of the currently logged-in user in sessionStorage
      if (nameInput) {
        sessionStorage.setItem("currentPlayer", nameInput);
      }
      const currentName = sessionStorage.getItem("currentPlayer");

      // show notification that player has been registered
      notifications.show({
        title: "Success",
        message: "Looking good, " + currentName + "!",
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

  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text ta="center" fz="lg" fw={500}>
        {stat.value}
      </Text>
      <Text ta="center" fz="sm" c="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder padding="xl" radius="md" className={classes.card}>
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {name}
      </Text>
      <Group mt="md" position="center" spacing={30}>
        {items}
      </Group>
      <MantineButton
        onClick={() => handleUpdateProfile()}
        radius="md"
        mt="xl"
        size="md"
        style={{ display: "block", margin: "0 auto" }}
        color={theme.colorScheme === "dark" ? undefined : "dark"}
      >
        Update Profile
      </MantineButton>
      {showUpdateProfile ? (
        <div>
          <Container>
            <h1>Update User</h1>
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
              onClick={updateUser}
            >
              Update User
            </Button>
          </Container>
        </div>
      ) : (
        <div></div>
      )}
    </Card>
  );
}
