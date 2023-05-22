import {
  createStyles,
  Container,
  Text,
  Button,
  Group,
  rem,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";

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

export const ScoreInfo = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { lobbyId } = useParams();

  return (
    <div className={classes.wrapper}>
      <Container size={1000} className={classes.inner}>
        <h1 className={classes.title}>
          The ultimate{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            inherit
          >
            FlagMania scoring mechanism
          </Text>{" "}
          explained in detail!
        </h1>
        <Text className={classes.description} color="dimmed">
          Are you confused with the numbers that are displayed? Here is what
          they mean: For each player you see their overall current rank, current
          total score, current total number of currently correct guessed
          countries (round won) as well as the summed-up time each player got
          during the previous rounds and an answer distribution:{" "}
          <ol>
            <li>
              The current overall rank is entirely determined by the current
              score.
            </li>
            <li>
              The current score is computed as follows: (10 * the number of
              consecutively correct guesses * 1) + (100 / the time until the
              correct guess in the previous round * 2) - (the number of times you
              have not guessed correctly). After each round, the score of the
              last round is added to the score of the previous rounds.
            </li>
            <li>
              If you have guessed the country correctly, you are awarded one
              point in the "correct guesses" column, else 0.
            </li>
            <li>
              In the column "Time Until Correct Guess" you see the overall time
              you had until the correct guess! If you have not guessed the
              country correctly, you get the full length (in seconds) of the
              last round assigned! So better guess correctly!
            </li>
            <li>
              The answer distribution displays the number of countries guessed
              correctly relative to the number of rounds played!
            </li>
          </ol>
          <i>
            *1: For example, if you guessed the country correctly in the last 2
            rounds, you get 10 * 2 = 20 points here; If you have guessed the country
            correctly in the round before the last round but have not guessed it
            correctly in the previous round, you get 0 points here as the
            guesses must be correct consecutively!
          </i>
          <br />
          <i>
            *2 This condition ensures that faster answers are rewarded more
            points!
          </i>
        </Text>
        <Group className={classes.controls}>
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            onClick={() => navigate("/game/" + lobbyId + "/leaderBoard")}
          >
            Back to Game
          </Button>
        </Group>
      </Container>
    </div>
  );
};
