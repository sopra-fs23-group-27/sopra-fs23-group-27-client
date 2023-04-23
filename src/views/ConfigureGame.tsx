import styled from "styled-components";
import { useState } from "react";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { RangeInput } from "../components/RangeInput";

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
  const [gameName, setGameName] = useState("");
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false);
  //ADVANCED
  const [hintsDelay, setHintsDelay] = useState(10);
  const [hintsInterval, setHintsInterval] = useState(5);
  const [roundTimeLimit, setRoundTimeLimit] = useState(10);
  const [guessingLimit, setGuessingLimit] = useState(1);
  //BASIC
  const [numberOfOptions, setNumberOfOptions] = useState(3);
  const [roundDuration, setRoundDuration] = useState(10);
  const [isPublic, setIsPublic] = useState(false);

  return (
    <Container>
      <Application>
        <h1>Configure your Game</h1>
        <FloatingTextInput
          label="Name"
          value={gameName}
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
                value={hintsDelay}
                setNewValue={setHintsDelay}
              />
            </div>
            <div>
              <h2>Hints interval</h2>
              <RangeInput
                min={5}
                max={20}
                value={hintsInterval}
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
                value={guessingLimit}
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
                value={roundDuration}
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
        <StartButton>START</StartButton>
      </Application>
    </Container>
  );
};
