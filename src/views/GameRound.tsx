import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { useSubscription, useStompClient } from "react-stomp-hooks";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { useNavigate, useParams } from "react-router-dom";
import { RainbowLoader } from "../components/RainbowLoader";
import { notifications } from "@mantine/notifications";
import { BasicRoundOptions } from "../components/BasicGame/BasicRoundOptions";
import { Player } from "../types/Player";

const P = styled.p`
  padding: 0;
  margin: 0;
  font-size: 24px;
`;
const Application = styled.div`
  min-height: 100vh;
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  // background-color: #dba11c;
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
  width: 122px;
  background-color: #f5f7f9;
`;
const GlobalGuess = styled.div`
  position: absolute;
  top: 200px;
  right: 100px;

  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-top: -2px;
  position: relative;
`;
const Flag = styled.img`
  //margin-top: -2px;
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

const GuessButton = styled.button`
  cursor: pointer;
  background-color: lightgray;
  text-align: center;
  border: none;
  font-size: 24px;
  padding: 12px 24px;
`;

type PropsType = {
  currentGameRound: number;
  setCurrentGameRound: Dispatch<SetStateAction<number>>;
  player: Player | undefined;
  gameMode: "BASIC" | "ADVANCED" | undefined;
  numRounds: number | undefined;
};
export const GameRound = (props: PropsType) => {
  const { currentGameRound, setCurrentGameRound, player, gameMode, numRounds } = props;
  const isBasic = gameMode === "BASIC";

  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [flagURL, setFlagURL] = useState("");
  const [correctCountry, setCorrectCountry] = useState("");

  // BASIC Mode
  const [guessOptions, setGuessOptions] = useState<string[]>([]);
  const [chosenOption, setChosenOption] = useState("");

  // ADVANCED Mode
  const [guessInput, setGuessInput] = useState("");
  const [latestGlobalGuess, setLatestGlobalGuess] = useState("");
  const [latestHint, setLatestHint] = useState("");

  const stompClient = useStompClient();

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/hints-in-round`,
    (message: any) => {
      let latestHint = JSON.parse(message.body).hint as string;
      latestHint = latestHint.replace("=", ": ");
      setLatestHint(latestHint);
      setLatestGlobalGuess("");
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
    const latestGlobalGuess = JSON.parse(message.body).guess as string;
    //const latestGlobalGuessOrigin = JSON.parse(message.body).playerName as string;
    setLatestGlobalGuess(latestGlobalGuess);
  });

  useSubscription(`/user/queue/lobbies/${lobbyId}/timer`, (message: any) => {
    const time = JSON.parse(message.body).time as number;
    setTimeLeft(time);
  });

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/round-end`,
    (message: any) => {
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
            <P>Time: {timeLeft}</P>
          </Time>

          {!isBasic && (
            <GlobalGuess>
              <P>Latest Guess:</P>
              <P>{latestGlobalGuess}</P>
            </GlobalGuess>
          )}

          <Main>
            <FlagContainer>
              <Flag src={flagURL} />
              <FlagCover />
            </FlagContainer>

            {!isBasic && !correctCountry && (
              <>
                <Hint>{latestHint}</Hint>
                <TextGuessBox>
                  <FloatingTextInput
                    label="Your Guess"
                    value={guessInput}
                    onChange={setGuessInput}
                  />
                  <GuessButton onClick={() => submitInputGuess()}>
                    Guess
                  </GuessButton>
                </TextGuessBox>
              </>
            )}
            {!isBasic && correctCountry && (
              <div>
                <p>correct country:</p>
                <CorrectCountryAdvanced>
                  {correctCountry}
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
