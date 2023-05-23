import styled from "styled-components";
import { Dispatch, SetStateAction, useState } from "react";
import { RangeInput } from "../components/RangeInput";
import { useNavigate } from "react-router-dom";
import { httpPost } from "../helpers/httpService";
import { Lobby } from "../types/Lobby";
import { notifications } from "@mantine/notifications";
import {
  Button,
  Button as MantineButton,
  TextInput,
  Title,
} from "@mantine/core";
import { BiSelect } from "../components/BiSelect";
import { ImageCheckboxes } from "../components/Checkboxes";

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
type StartButtonProps = {
  isActive: boolean;
};
const StartButton = styled.button<StartButtonProps>`
  cursor: ${(props) => (props.isActive ? "pointer" : "not-allowed")};
  background-color: ${(props) =>
    props.isActive ? "rgb(34, 139, 230)" : "lightgray"};
  text-align: center;
  border: none;
  font-size: 32px;
  padding: 16px 32px;
  margin: 64px 0;
  z-index: 1;
  color: ${(props) => (props.isActive ? "white" : "gray")};

  &:hover {
    background-color: ${(props) => (props.isActive ? "#1c7ed6" : "lightgray")};
  }
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
              <h2>Number of Rounds</h2>
              <RangeInput
                min={2}
                max={12}
                value={numRounds}
                setNewValue={setNumRounds}
              />
            </div>
            <div>
              <h2>Show first hint after</h2>
              <RangeInput
                min={0}
                max={15}
                value={numSecondsUntilHint}
                setNewValue={setNumSecondsUntilHint}
              />
            </div>
            <div>
              <h2>Hints interval</h2>
              <RangeInput
                min={3}
                max={10}
                value={hintInterval}
                setNewValue={setHintInterval}
              />
            </div>
            <div>
              <h2>Time Limit per round</h2>
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
              <h2>Number of Rounds</h2>
              <RangeInput
                min={2}
                max={12}
                value={numRounds}
                setNewValue={setNumRounds}
              />
            </div>
            <div>
              <h2>Number of Options</h2>
              <RangeInput
                min={2}
                max={6}
                value={numOptions}
                setNewValue={setNumOptions}
              />
            </div>

            <div>
              <h2>Time limit per round</h2>
              <RangeInput
                min={5}
                max={30}
                value={numSeconds}
                setNewValue={setNumSeconds}
              />
            </div>
          </RangeOptions>
        )}

        <h2>Select Regions</h2>

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
          OPEN
        </Button>
      </Application>
    </Container>
  );
};
