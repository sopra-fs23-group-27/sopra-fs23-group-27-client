import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSubscription, useStompClient } from "react-stomp-hooks";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { useParams } from "react-router-dom";
import { RainbowLoader } from "../components/RainbowLoader";

const P = styled.p`
  padding: 0;
  margin: 0;
`;
const Application = styled.div`
  height: 100vh;
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const AdditionalBoxes = styled.div`
  padding: 8px 16px;
  border: 2px solid rgb(216, 216, 216);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50px;
`;
const Points = styled(AdditionalBoxes)`
  left: 50px;
`;
const Time = styled(AdditionalBoxes)`
  right: 50px;
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
  height: 700px;
  border: 2px solid rgb(216, 216, 216);
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Flag = styled.img`
  margin-top: -2px;
  width: 600px;
  height: 400px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;
const Hint = styled.p``;
const GuessBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 36px;
  align-items: center;
`;
const Input = styled.input``;

const GuessButton = styled.button`
  cursor: pointer;
  background-color: lightgray;
  text-align: center;
  border: none;
  font-size: 24px;
  padding: 12px 24px;
`;

export const GameRound = () => {
  // where to get Game id??
  const { lobbyId } = useParams();
  console.log("lobbyId: ", lobbyId);

  const [isLoading, setIsLoading] = useState(true);

  const [currentRound, setCurrentRound] = useState(1);
  const [roundAmount, setRoundAmount] = useState(3);
  const [timeLeft, setTimeLeft] = useState(10);
  const [points, setPoints] = useState(700);
  const [flagURL, setFlagURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/2560px-Flag_of_Germany.svg.png"
  );
  const [guessInput, setGuessInput] = useState("");
  const [latestGlobalGuess, setLatestGlobalGuess] = useState("Austria");
  const [latestHint, setLatestHint] = useState("Capital: Berlin");
  const [gameRoundEnd, setGameRoundEnd] = useState(false);

  const stompClient = useStompClient();

  useSubscription(`/topic/games/${lobbyId}/timer `, (message: any) => {
    const timeLeft = JSON.parse(message.body).time as number;
    console.log("seconds left until round finishes: ", timeLeft);
    setTimeLeft(timeLeft);
  });

  useSubscription(`/topic/games/${lobbyId}/flag-in-round`, (message: any) => {
    const flagURL = JSON.parse(message.body).url as string;
    console.log("Flag URL: ", flagURL);
    setFlagURL(flagURL);
  });
  useSubscription(
    `/topic/games/${lobbyId}/guesses-in-round`,
    (message: any) => {
      const latestGlobalGuess = JSON.parse(message.body).guess as string;
      // const latestGlobalGuessOrigin = JSON.parse(message.body).playername as string;
      console.log("latest Global Guess: ", latestGlobalGuess);
      setLatestGlobalGuess(latestGlobalGuess);
    }
  );
  useSubscription(`/topic/games/${lobbyId}/hints-in-round`, (message: any) => {
    const latestHint = JSON.parse(message.body).hint as string;
    console.log("latest Hint: ", latestHint);
    setLatestHint(latestHint);
  });

  useSubscription(`/topic/games/${lobbyId}/round-end`, (message: any) => {
    const roundScores = JSON.parse(message.body).scores;
    const correspondingPlayers = JSON.parse(message.body).players;
    console.log("players: ", correspondingPlayers);
    console.log("roundScores: ", roundScores);
    setGameRoundEnd(true);
  });

  useEffect(() => {
    if (!gameRoundEnd) {
      return;
    }
    setCurrentRound((c) => c + 1);
    setGameRoundEnd(false);
  }, [gameRoundEnd]);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const submitGuess = () => {
    const playerName = localStorage.getItem("currentPlayer");
    if (stompClient) {
      stompClient.publish({
        destination: `app/games/${lobbyId}/guess`,
        body: JSON.stringify({ guess: guessInput, playerName }),
      });
      setGuessInput("");
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
          <Points>
            <P>{points}</P>
          </Points>
          <Time>
            <P>{timeLeft}</P>
          </Time>
          <GlobalGuess>
            <P>Latest Guess:</P>
            <P>{latestGlobalGuess}</P>
          </GlobalGuess>
          <Main>
            <Flag src={flagURL} />
            <Hint>{latestHint}</Hint>
            <GuessBox>
              <FloatingTextInput
                label="Your Guess"
                value={guessInput}
                onChange={setGuessInput}
              />
              <GuessButton onClick={() => submitGuess()}>Guess</GuessButton>
            </GuessBox>
          </Main>
        </>
      )}
    </Application>
  );
};
