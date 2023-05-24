import { Title, Text } from "@mantine/core";
import styled from "styled-components";

const Guess = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: -5px;
  padding: 0 16px;
`;
const Divider = styled.div`
  border: 0;
  border-top-width: 1px;
  border-top-color: black;
  border-top-style: solid;
`;

type PropsType = {
  guesses: string[];
  playerNames: string[];
};

export const GuessHistory = ({ guesses, playerNames }: PropsType) => {
  let parsedGuesses = [...guesses];
  let parsedPlayerNames = [...playerNames];

  if (guesses.length > 5) {
    parsedGuesses = parsedGuesses.slice(guesses.length - 5, guesses.length);
    parsedPlayerNames = parsedPlayerNames.slice(
      playerNames.length - 5,
      playerNames.length
    );
  }
  return (
    <>
      <Title order={5} style={{ textAlign: "center" }}>
        Recent guesses
      </Title>
      <Divider />
      {parsedGuesses.map((g, ind) => (
        <>
          <Guess>
            <Title order={5} style={{ margin: "0" }}>
              {parsedPlayerNames[ind]}
            </Title>
            <Text fz="xl" style={{ margin: "0" }}>
              {g}
            </Text>
          </Guess>
          {ind + 1 < parsedGuesses.length && <Divider />}
        </>
      ))}
    </>
  );
};
