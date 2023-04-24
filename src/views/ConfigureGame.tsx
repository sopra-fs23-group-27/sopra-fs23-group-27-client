import styled from "styled-components";
import { useState } from "react";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { RangeInput } from "../components/RangeInput";
import { handleError, httpPost } from "../helpers/httpService";
import Lobby from "../models/Lobby";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Application = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  font-size: 20px;
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
const StartButton = styled.button`
  cursor: pointer;
  background-color: lightgray;
  text-align: center;
  border: none;
  font-size: 32px;
  padding: 16px 32px;
  margin: 64px 0;
`;

export const ConfigureGame = () => {
  //Field states
  const [lobbyName, setGameName] = useState("");
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false);
  //ADVANCED
  const [numSecondsUntilHint, setHintsDelay] = useState(10);
  const [hintInterval, setHintsInterval] = useState(5);
  const [roundTimeLimit, setRoundTimeLimit] = useState(10);
  const [maxNumGuesses, setGuessingLimit] = useState(1);
  //BASIC
  const [numberOfOptions, setNumberOfOptions] = useState(3);
  const [numSeconds, setRoundDuration] = useState(10);
  const [isPublic, setIsPublic] = useState(false);

  // navigation
  const navigate = useNavigate();

  const createLobby = async () => {
    const mode = "advanced";

    try {
      // get token of current player from local storage
      const headers = {"Authorization": localStorage.getItem('token')}

      const response = await httpPost('/lobbies/' + mode, {
        isPublic: isPublic, 
        numSeconds: numSeconds,
        numSecondsUntilHint: numSecondsUntilHint,
        hintInterval: hintInterval,
        maxNumGuesses: maxNumGuesses,
        lobbyName: lobbyName
      }, {headers});
      console.log(response.data);

      // Create a new Lobby instance from the JSON data in the response
      const lobby = new Lobby(response.data);

      // Store the token into the local storage.
      localStorage.setItem('privateLobbyKey', lobby.privateLobbyKey);

      // Store the ID of the current game in localstorage
      localStorage.setItem('lobbyId', lobby.lobbyId.toString());

      // navigate to lobby
      navigate("/lobbies/" + lobby.lobbyId)

      // catch errors
    } catch (error: any) {
      alert(`Something went wrong: \n${handleError(error)}`);
    }
  };

  return (
    <Container>
      <Application>
        <h1>Configure your Game</h1>
        <FloatingTextInput
          label="Name"
          value={lobbyName}
          onChange={(newVal: string) => setGameName(newVal)}
        />
        <div>
          <Button onClick={() => setIsAdvanced(false)} isActive={!isAdvanced}>
            BASIC
          </Button>
          <Button onClick={() => setIsAdvanced(true)} isActive={isAdvanced}>
            ADVANCED
          </Button>
        </div>

        {isAdvanced ? (
          <div>
            <div>
              <h2>Show first hint after</h2>
              <RangeInput
                min={10}
                max={30}
                value={numSecondsUntilHint}
                setNewValue={setHintsDelay}
              />
            </div>
            <div>
              <h2>Hints interval</h2>
              <RangeInput
                min={5}
                max={20}
                value={hintInterval}
                setNewValue={setHintsInterval}
              />
            </div>
            <div>
              <h2>Time Limit per round</h2>
              <RangeInput
                min={10}
                max={120}
                value={roundTimeLimit}
                setNewValue={setRoundTimeLimit}
              />
            </div>
            <div>
              <h2>Guessing Limit</h2>
              <RangeInput
                min={1}
                max={10}
                value={maxNumGuesses}
                setNewValue={setGuessingLimit}
              />
            </div>
          </div>
        ) : (
          <div>
            <div>
              <h2>Number of Options</h2>
              <RangeInput
                min={2}
                max={6}
                value={numberOfOptions}
                setNewValue={setNumberOfOptions}
              />
            </div>

            <div>
              <h2>Round duration</h2>
              <RangeInput
                min={5}
                max={30}
                value={numSeconds}
                setNewValue={setRoundDuration}
              />
            </div>
          </div>
        )}

        <div>
          <Button onClick={() => setIsPublic(true)} isActive={isPublic}>
            Public
          </Button>
          <Button onClick={() => setIsPublic(false)} isActive={!isPublic}>
            Private
          </Button>
        </div>
        <StartButton onClick={() => createLobby()}>START</StartButton>
      </Application>
    </Container>
  );
};
