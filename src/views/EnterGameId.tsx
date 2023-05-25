import { useState } from "react";
import { Button, Group, Input, Title, createStyles, rem } from "@mantine/core";
import styled from "styled-components";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    boxSizing: "border-box",
  },

  inner: {
    position: "relative",
    paddingTop: rem(200),
    paddingBottom: rem(120),

    [theme.fn.smallerThan("sm")]: {
      paddingBottom: rem(80),
      paddingTop: rem(80),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(62),
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(42),
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: rem(24),

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(18),
    },
  },

  controls: {
    marginTop: `calc(${theme.spacing.xl} * 2)`,

    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: rem(54),
    paddingLeft: rem(38),
    paddingRight: rem(38),

    [theme.fn.smallerThan("sm")]: {
      height: rem(54),
      paddingLeft: rem(18),
      paddingRight: rem(18),
      flex: 1,
    },
  },
}));

const ButtonContainer = styled.div`
  display: flex;
  gap: 32px;
  flex-direction: row;
  align-items: center;
  height: 40vh;
  justify-content: space-between;
`;

export const GameIdInput = () => {
  const [gameURL, setGameURL] = useState("");
  const { classes } = useStyles();
  const navigate = useNavigate();

  const handleNavigateURL = () => {
    try {
      window.location.href = gameURL;
    } catch (error: any) {
      notifications.show({
        title: "Invalid Game URL",
        message: "The game URL you entered is invalid. Please try again.",
        color: "red",
      });
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "80vh",
        position: "relative",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Title size={36} order={1} style={{ margin: "24px" }}>
        Enter the game URL or scan a QR code to join private games
      </Title>
      <Input
        size="xl"
        type="text"
        value={gameURL}
        placeholder="Game URL"
        onChange={(event) => setGameURL(event.currentTarget.value)}
      />
      <ButtonContainer>
        <Button
          size="xl"
          onClick={() => {
            handleNavigateURL();
          }}
        >
          Join Game
        </Button>
      </ButtonContainer>
      <Group className={classes.controls}>
        <Button
          size="md"
          className={classes.control}
          color="gray"
          onClick={() => navigate("/")}
        >
          Back to home
        </Button>
        <Button
          size="md"
          className={classes.control}
          variant="gradient"
          gradient={{ from: "blue", to: "cyan" }}
          onClick={() => navigate("/configureGame")}
        >
          Create new game
        </Button>
      </Group>
    </div>
  );
};
