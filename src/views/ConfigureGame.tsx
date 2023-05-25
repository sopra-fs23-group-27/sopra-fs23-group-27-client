import styled from "styled-components";
import { Dispatch, SetStateAction, useState } from "react";
import { RangeInput } from "../components/RangeInput";
import { useNavigate } from "react-router-dom";
import { httpPost } from "../helpers/httpService";
import { Lobby } from "../types/Lobby";
import { notifications } from "@mantine/notifications";
import {
  Button,
  Group,
  Button as MantineButton,
  TextInput,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { BiSelect } from "../components/BiSelect";
import { ImageCheckboxes } from "../components/Checkboxes";

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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
  min-height: 100vh;
`;
const Application = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 768px;
  font-size: 20px;
  border: 2px solid black;
  border-radius: 10px;
  padding: 16px 32px;
  background-color: #f5f7f9;
`;

const RangeOptions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface PostBody {
  //commmon fields
  continent: string[];
  isPublic: boolean;
  numRounds: number;
  numSeconds: number;
  lobbyName: string;

  //only for BASCIC games
  numOptions?: number;

  //only for ADVANCED games
  numSecondsUntilHint?: number;
  hintInterval?: number;
  maxNumGuesses?: number;
}

type PropsType = {
  setLobby: Dispatch<SetStateAction<Lobby | undefined>>;
  setCurrentGameRound: Dispatch<SetStateAction<number>>;
};

export const ConfigureGame = (props: PropsType) => {
  const { setLobby, setCurrentGameRound } = props;

  const navigate = useNavigate();
  const { classes } = useStyles();

  //Field states
  const [lobbyName, setLobbyName] = useState("");
  const [isBasic, setIsBasic] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState(false);
  const [numRounds, setNumRounds] = useState(5);
  const numSecondsBasicDefault = 10;
  const numSecondsAdvancedDefault = 30;
  const [numSeconds, setNumSeconds] = useState(numSecondsBasicDefault);

  //ADVANCED
  const [numSecondsUntilHint, setNumSecondsUntilHint] = useState(10);
  const [hintInterval, setHintInterval] = useState(5);
  //BASIC
  const [numOptions, setNumOptions] = useState(4);
  const [isPublic, setIsPublic] = useState(true);

  // CONTINENTS
  const defaultContinents = ["World"];
  const [continent, setContinent] = useState(defaultContinents);

  const handleLobbyNameInputChange = (event: {
    currentTarget: { value: SetStateAction<string> };
  }) => {
    setLobbyName(event.currentTarget.value);
  };
  const changeGameMode = (updatedGameModeIsBasic: boolean) => {
    if (updatedGameModeIsBasic === isBasic) {
      return;
    }

    if (updatedGameModeIsBasic) {
      setNumSeconds(numSecondsBasicDefault);
    } else {
      setNumSeconds(numSecondsAdvancedDefault);
    }
    setIsBasic(updatedGameModeIsBasic);
  };

  const createLobby = async () => {
    const mode = isBasic ? "basic" : "advanced";

    console.log(continent);

    const body: PostBody = {
      continent,
      isPublic,
      numRounds,
      numSeconds,
      lobbyName,
    };

    if (!isBasic) {
      body.numSecondsUntilHint = numSecondsUntilHint;
      body.hintInterval = hintInterval;
    } else {
      body.numOptions = numOptions;
    }

    try {
      // get token of current player from session storage
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };

      const response = await httpPost("/lobbies/" + mode, body, { headers });

      // Set the lobby state to the response data.
      const lobby = response.data as Lobby;
      setLobby(lobby);
      setCurrentGameRound(0);

      // navigate to lobby
      navigate("/lobbies/" + lobby.lobbyId);

      // catch errors
    } catch (error: any) {
      notifications.show({
        title: "Something went wrong",
        message: error.response
          ? error.response.data.message
          : "Server could not be reached",
        color: "red",
      });
    }
  };

  return (
    <Container>
      <Application>
        <Title style={{ margin: "32px 0" }}>Configure Game</Title>
        <div style={{ marginBottom: "32px" }}>
          <TextInput
            size="xl"
            label="Game Name"
            placeholder="Game Name"
            value={lobbyName}
            onChange={handleLobbyNameInputChange}
            style={{ width: "100%" }}
          />
        </div>

        <BiSelect
          labelA={"BASIC"}
          labelB={"ADVANCED"}
          aSelected={isBasic}
          setASelected={changeGameMode}
        />

        <div style={{ marginTop: "32px" }}>
          <MantineButton
            size="xl"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? "Hide " : "Show "} Settings{"  "}
            {showSettings ? "▲" : "▼"}
          </MantineButton>
        </div>

        {showSettings && !isBasic && (
          <RangeOptions>
            <div>
              <Title order={2} style={{ margin: "24px 0 8px 0" }}>
                Number of Rounds
              </Title>
              <RangeInput
                min={2}
                max={12}
                value={numRounds}
                setNewValue={setNumRounds}
              />
            </div>
            <div>
              <Title order={2} style={{ margin: "24px 0 8px 0" }}>
                Show first hint after
              </Title>
              <RangeInput
                min={0}
                max={15}
                value={numSecondsUntilHint}
                setNewValue={setNumSecondsUntilHint}
              />
            </div>
            <div>
              <Title order={2} style={{ margin: "24px 0 8px 0" }}>
                Hints interval
              </Title>
              <RangeInput
                min={3}
                max={10}
                value={hintInterval}
                setNewValue={setHintInterval}
              />
            </div>
            <div>
              <Title order={2} style={{ margin: "24px 0 8px 0" }}>
                Time Limit per round
              </Title>
              <RangeInput
                min={20}
                max={120}
                value={numSeconds}
                setNewValue={setNumSeconds}
              />
            </div>
          </RangeOptions>
        )}
        {showSettings && isBasic && (
          <RangeOptions>
            <div>
              <Title order={2} style={{ margin: "24px 0 8px 0" }}>
                Number of Rounds
              </Title>
              <RangeInput
                min={2}
                max={12}
                value={numRounds}
                setNewValue={setNumRounds}
              />
            </div>
            <div>
              <Title order={2} style={{ margin: "24px 0 8px 0" }}>
                Number of Options
              </Title>
              <RangeInput
                min={2}
                max={6}
                value={numOptions}
                setNewValue={setNumOptions}
              />
            </div>

            <div>
              <Title order={2} style={{ margin: "24px 0 8px 0" }}>
                Time limit per round
              </Title>
              <RangeInput
                min={5}
                max={30}
                value={numSeconds}
                setNewValue={setNumSeconds}
              />
            </div>
          </RangeOptions>
        )}

        <Title order={2} style={{ margin: "36px 0 16px 0" }}>
          Select Regions
        </Title>

        <ImageCheckboxes setContinent={setContinent} />

        <div style={{ marginTop: "36px" }}>
          <BiSelect
            labelA="Public"
            labelB="Private"
            aSelected={isPublic}
            setASelected={setIsPublic}
          />
        </div>

        <Button
          size="xl"
          disabled={!lobbyName || continent.length === 0}
          onClick={() => createLobby()}
          style={{ margin: "48px 0" }}
        >
          Create Game
        </Button>
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
            onClick={() => navigate("/publicGames")}
          >
            Join public game
          </Button>
        </Group>
      </Application>
    </Container>
  );
};
