import styled from "styled-components";
import { Dispatch, SetStateAction, useState } from "react";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { RangeInput } from "../components/RangeInput";
import { useNavigate } from "react-router-dom";
import { handleError, httpPost } from "../helpers/httpService";
import Lobby from "../models/Lobby";
import { notifications } from "@mantine/notifications";
import { Button as MantineButton } from "@mantine/core";
import { BiSelect } from "../components/BiSelect";
import { ImageCheckbox, ImageCheckboxes } from "../components/Checkboxes";
import FlagLogo from "../icons/DALL-E_FlagMania_Logo.png";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px;
`;
const Application = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 464px;
  font-size: 20px;
  border: 2px solid rgb(216, 216, 216);
  border-radius: 10px;
  padding: 16px 32px;
`;

const RangeOptions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

type props = {
  isActive: boolean;
};
const Button = styled.button<props>`
  cursor: pointer;
  background-color: ${(props) => (props.isActive ? "lightgray" : "white")};
  text-align: center;
  border: 3px solid lightgray;
  padding: 8px 16px;
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
};

export const ConfigureGame = (props: PropsType) => {
  const { setLobby } = props;

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
  const continents = [
    "Africa",
    "Asia",
    "Europe",
    "Americas",
    "Oceania",
  ];
  const [continent, setContinent] = useState(continents);
  
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

    alert(continent);

    try {
      // get token of current player from local storage
      const headers = {
        Authorization: sessionStorage.getItem("FlagManiaToken"),
      };

      const response = await httpPost("/lobbies/" + mode, body, { headers });

      // Create a new Lobby instance from the JSON data in the response
      const lobby = new Lobby(response.data);
      setLobby(lobby);

      // Store the name of the lobby into the local storage.
      sessionStorage.setItem("lobbyName", lobby.lobbyName);

      // Store the ID of the current game in sessionStorage
      sessionStorage.setItem("lobbyId", lobby.lobbyId.toString());

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
        <h1>Configure your Game</h1>
        <FloatingTextInput
          label="Name"
          value={lobbyName}
          onChange={(newVal: string) => setLobbyName(newVal)}
        />
        <BiSelect
          labelA={"BASIC"}
          labelB={"ADVANCED"}
          aSelected={isBasic}
          setASelected={changeGameMode}
        />

        <div style={{ marginTop: "32px" }}>
          <MantineButton onClick={() => setShowSettings(!showSettings)}>
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

        <h2>Select Region</h2>

        <ImageCheckboxes setContinent={setContinent} />

        <div style={{ marginTop: "36px" }}>
          <BiSelect
            labelA="Public"
            labelB="Private"
            aSelected={isPublic}
            setASelected={setIsPublic}
          />
        </div>

        <StartButton
          isActive={!!lobbyName}
          disabled={!lobbyName}
          onClick={() => createLobby()}
        >
          OPEN
        </StartButton>
      </Application>
    </Container>
  );
};
