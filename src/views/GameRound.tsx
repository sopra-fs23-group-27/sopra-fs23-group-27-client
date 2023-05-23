import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { useSubscription, useStompClient } from "react-stomp-hooks";
import { useNavigate, useParams } from "react-router-dom";
import { RainbowLoader } from "../components/RainbowLoader";
import { notifications } from "@mantine/notifications";
import { BasicRoundOptions } from "../components/BasicGame/BasicRoundOptions";
import { GuessHistory } from "../components/GuessHistory";
import { Player } from "../types/Player";
import { TextInput, Button, Text, Title } from "@mantine/core";
import { useInputState } from "@mantine/hooks";

const Application = styled.div`
  min-height: 100vh;
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const AdditionalBoxes = styled.div`
  padding: 8px 16px;
  border: 1px solid black;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50px;
`;
const Time = styled(AdditionalBoxes)`
  right: 50px;
  width: 140px;
  background-color: #f5f7f9;
`;
const GuessHistoryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: absolute;
  top: 200px;
  right: 15px;
  background-color: white;
  border-radius: 10px;
  border: 2px solid black;
  padding: 8px 0;
  width: 240px;
  overflow: hidden;
`;
const Main = styled.div`
  width: 900px;
  min-height: 700px;
  border: 1px solid black;
  border-radius: 10px;
  padding-bottom: 12px;

  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f7f9;
`;
const FlagContainer = styled.div`
  position: relative;
`;
const Flag = styled.img`
  width: 600px;
  height: 400px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;
const FlagCover = styled.div`
  position: absolute;
  top: 0;
  width: 600px;
  height: 400px;
`;
const Hint = styled.p``;
const TextGuessBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 36px;
  align-items: center;
  justify-content: center;
`;

const CorrectCountryAdvanced = styled.div`
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  text-align: center;
  font-size: 30px;
  color: black;
  background-color: lightgray;
`;

type PropsType = {
  currentGameRound: number;
  setCurrentGameRound: Dispatch<SetStateAction<number>>;
  player: Player | undefined;
  gameMode: "BASIC" | "ADVANCED" | undefined;
  numRounds: number | undefined;
};
export const GameRound = (props: PropsType) => {
  const { currentGameRound, setCurrentGameRound, player, gameMode, numRounds } =
    props;
  const isBasic = gameMode === "BASIC";

  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [flagURL, setFlagURL] = useState("");
  const [correctCountry, setCorrectCountry] = useState("");

  console.log("isBasic: ", isBasic);
  console.log("correctCountry: ", correctCountry);

  // BASIC Mode
  const [guessOptions, setGuessOptions] = useState<string[]>([]);
  const [chosenOption, setChosenOption] = useState("");

  // ADVANCED Mode
  const [guessInput, setGuessInput] = useInputState("");
  const [guessHistory, setGuessHistory] = useState<string[]>([]);
  const [guessHistoryNames, setGuessHistoryNames] = useState<string[]>([]);
  const [latestHint, setLatestHint] = useState("");

  const stompClient = useStompClient();

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/hints-in-round`,
    (message: any) => {
      let latestHint = JSON.parse(message.body).hint as string;
      latestHint = latestHint.replace("=", ": ");
      setLatestHint(latestHint);
    }
  );

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/flag-in-round`,
    (message: any) => {
      const attributeURL = JSON.parse(message.body).url;
      const flagURL = attributeURL.split("=")[1] as string;
      setIsLoading(false);
      setFlagURL(flagURL);
      setCurrentGameRound(currentGameRound + 1);
    }
  );
  useSubscription(`/user/queue/lobbies/${lobbyId}/guesses`, (message: any) => {
    const body = JSON.parse(message.body);

    const newGuess = body.guess as string;
    const newGuessPlayerName = body.playerName as string;
    setGuessHistory([...guessHistory, newGuess]);
    setGuessHistoryNames([...guessHistoryNames, newGuessPlayerName]);
  });

  useSubscription(`/user/queue/lobbies/${lobbyId}/timer`, (message: any) => {
    const time = JSON.parse(message.body).time as number;
    setTimeLeft(time);
  });

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/round-end`,
    (message: any) => {
      console.log(
        `currentGameRound: ${currentGameRound}, numRounds: ${numRounds}`
      );
      if (currentGameRound === numRounds) {
        navigate(`/game/${lobbyId}/gameEnd`);
      } else {
        navigate(`/game/${lobbyId}/leaderBoard`);
      }
    }
  );

  // Get correct guess after each round
  useSubscription(
    `/user/queue/lobbies/${lobbyId}/correct-country`,
    (message: any) => {
      const parsedMessage = JSON.parse(message.body);
      const correctCountry = parsedMessage.correctGuess;
      setCorrectCountry(correctCountry);
    }
  );

  // Basic mode
  useSubscription(
    `/user/queue/lobbies/${lobbyId}/guess-evaluation`,
    (message: any) => {
      const parsedMessage = JSON.parse(message.body);
      if (!parsedMessage.isCorrect) {
        notifications.show({
          withCloseButton: true,
          autoClose: 3000,
          title: "Try again",
          message: "Your guess was wrong",
          color: "red",
        });
      } else {
        notifications.show({
          withCloseButton: true,
          autoClose: 2000,
          title: "Nice",
          message: "Your guess was correct",
          color: "green",
        });
      }
    }
  );

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/choices-in-round`,
    (message: any) => {
      const parsedMessage = JSON.parse(message.body);
      const choices = parsedMessage.choices;
      setGuessOptions(choices);
    }
  );

  const submitInputGuess = () => {
    const playerName = player?.playerName;
    if (stompClient) {
      stompClient.publish({
        destination: `/app/games/${lobbyId}/guess`,
        body: JSON.stringify({ guess: guessInput, playerName }),
      });
      setGuessInput("");
    } else {
      console.error("Error: could not send message");
    }
  };
  const submitOptionGuess = (guess: string) => {
    if (chosenOption) {
      return;
    }
    const playerName = player?.playerName;
    if (stompClient) {
      stompClient.publish({
        destination: `/app/games/${lobbyId}/guess`,
        body: JSON.stringify({ guess, playerName }),
      });
      setChosenOption(guess);
    } else {
      console.error("Error: could not send message");
    }
  };

  return (
    <Application>
      {isLoading ? (
        <RainbowLoader />
      ) : (
        <>
          <Time>
            <Text size="xl">Time: {timeLeft}</Text>
          </Time>

          {!isBasic && guessHistory[0] && (
            <>
              <GuessHistoryBox>
                <GuessHistory
                  guesses={guessHistory}
                  playerNames={guessHistoryNames}
                />
              </GuessHistoryBox>
            </>
          )}

          <Main>
            <FlagContainer>
              <Flag src={flagURL} />
              <FlagCover />
            </FlagContainer>

            {!isBasic && !correctCountry && (
              <>
                <Text size="xl">{latestHint}</Text>
                <TextGuessBox>
                  <TextInput
                    size="lg"
                    label="Your Guess"
                    placeholder="Guess"
                    value={guessInput}
                    onChange={setGuessInput}
                    style={{ marginBottom: "24px" }}
                  />
                  <Button
                    disabled={!guessInput}
                    size="xl"
                    onClick={submitInputGuess}
                    style={{}}
                  >
                    Guess
                  </Button>
                </TextGuessBox>
              </>
            )}
            {!isBasic && correctCountry && (
              <div>
                <Text size="lg">correct country:</Text>
                <CorrectCountryAdvanced>
                  <Title order={2} style={{ margin: "auto" }}>
                    {correctCountry}
                  </Title>
                </CorrectCountryAdvanced>
              </div>
            )}

            {isBasic && (
              <BasicRoundOptions
                correctCountry={correctCountry}
                userSelection={chosenOption}
                countryOptions={guessOptions}
                submitOptionGuess={submitOptionGuess}
              />
            )}
          </Main>
        </>
      )}
    </Application>
  );
};
