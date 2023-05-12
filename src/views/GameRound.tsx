import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { useSubscription, useStompClient } from "react-stomp-hooks";
import { FloatingTextInput } from "../components/FloatingTextInput";
import { useNavigate, useParams } from "react-router-dom";
import { RainbowLoader } from "../components/RainbowLoader";
import { notifications } from "@mantine/notifications";

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
};
export const GameRound = (props: PropsType) => {
  const { currentGameRound, setCurrentGameRound } = props;

  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [points, setPoints] = useState(0);
  const [flagURL, setFlagURL] = useState("");
  const [guessInput, setGuessInput] = useState("");
  const [latestGlobalGuess, setLatestGlobalGuess] = useState("");
  const [latestHint, setLatestHint] = useState("");

  const stompClient = useStompClient();

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/round-start`,
    (message: any) => {
      console.log("round has started");
      setLatestGlobalGuess("");
      setLatestHint("");
      setGuessInput("");
    }
  );
  useSubscription(
    `/user/queue/lobbies/${lobbyId}/round-end`,
    (message: any) => {
      console.log("round has ended");
    }
  );
  useSubscription(
    `/user/queue/lobbies/${lobbyId}/hints-in-round`,
    (message: any) => {
      let latestHint = JSON.parse(message.body).hint as string;
      latestHint = latestHint.replace("=", ": ");
      console.log(latestHint);
      setLatestHint(latestHint);
    }
  );

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/flag-in-round`,
    (message: any) => {
      const attributeURL = JSON.parse(message.body).url;
      const flagURL = attributeURL.split("=")[1] as string;
      console.log("flag URL: ", flagURL);
      setIsLoading(false);
      setFlagURL(flagURL);
      setCurrentGameRound(currentGameRound + 1);
    }
  );
  useSubscription(`/user/queue/lobbies/${lobbyId}/guesses`, (message: any) => {
    const latestGlobalGuess = JSON.parse(message.body).guess as string;
    const latestGlobalGuessOrigin = JSON.parse(message.body)
      .playerName as string;
    console.log(
      "latest Global Guess: ",
      latestGlobalGuess,
      " from: ",
      latestGlobalGuessOrigin
    );
    setLatestGlobalGuess(latestGlobalGuess);
  });

  useSubscription(`/user/queue/lobbies/${lobbyId}/timer`, (message: any) => {
    const time = JSON.parse(message.body).time as number;
    console.log(time);
    setTimeLeft(time);
  });

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/round-end`,
    (message: any) => {
      console.log("time is up");
      if (currentGameRound === 3) {
        navigate(`/game/${lobbyId}/gameEnd`);
      } else {
        navigate(`/game/${lobbyId}/leaderBoard`);
      }
    }
  );

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

  // TODO: final leaderboard once game is over

  const submitGuess = () => {
    const playerName = sessionStorage.getItem("currentPlayer");
    if (stompClient) {
      stompClient.publish({
        destination: `/app/games/${lobbyId}/guess`,
        body: JSON.stringify({ guess: guessInput, playerName }),
      });
      console.log("guess was sent");
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
