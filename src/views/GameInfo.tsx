import {
  createStyles,
  Container,
  Text,
  Button,
  Group,
  rem,
} from "@mantine/core";
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

export const GameInfo = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.wrapper}>
      <Container size={1000} className={classes.inner}>
        <h1 className={classes.title}>
          A{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            inherit
          >
            multiplayer game
          </Text>{" "}
          that tests your knowledge about{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            inherit
          >
            country flags
          </Text>{" "}
          to the limit!
        </h1>
        <Text className={classes.description} color="dimmed">
          Have you ever felt ashamed because a friend showed you a flag, but you
          had no idea which country it belonged to? Well, improve your knowledge
          now playfully with FlagMania! Here is what you can do: First decide if
          you want to play with your friends or with strangers from around the
          world. If you only want to play with your friends, choose a username
          and click{" "}
        </Text>
        <h3>
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            inherit
          >
            Create new game!
          </Text>{" "}
        </h3>

        <Text className={classes.description} color="dimmed">
          After you have chosen a lobby name, you can select the game mode:
          <ul>
            <li>
              <Text
                component="span"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                inherit
              >
                Basic Mode:{" "}
              </Text>
              Do you know very little about the flags of countries from all over
              the world? Then try Basic Mode first! Here you will be shown
              possible answers and you have to choose the country that matches
              the displayed flag.
            </li>
            <li>
              <Text
                component="span"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                inherit
              >
                Advanced Mode:{" "}
              </Text>
              Are you already a real flag expert? Then try the Advanced Mode!
              Here you must type the correct country directly into an input
              field. To the right you can even see the wrong guesses of the
              other players. The round ends when the first player has guessed
              the correct country.
            </li>
          </ul>
          Can you hold your own against the other players? Do you already have a
          user login? If no, then register as soon as possible! There are great
          advantages waiting for you. For example, you can protect your username
          and view your overall statistics. To do so, go to the register page on
          the homepage and log in. Alternatively, you can also register after
          playing a round!
        </Text>
        <Group className={classes.controls}>
          <Button
            size="xl"
            className={classes.control}
            color="gray"
            onClick={() => navigate("/")}
          >
            Back to home
          </Button>
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Group>
      </Container>
    </div>
  );
};
