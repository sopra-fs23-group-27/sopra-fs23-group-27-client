import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import styled from "styled-components";
import { LeaderBoard } from "../components/LeaderBoard";
import { Button, ThemeIcon, createStyles, rem } from "@mantine/core";
import { Player } from "../types/Player";
import { IconInfoCircle } from "@tabler/icons-react";
import { RainbowLoader } from "../components/RainbowLoader";
import { ScoreInfo } from "../components/ScoreInfo";
import { notifications } from "@mantine/notifications";
import { Lobby } from "../types/Lobby";

const ICON_SIZE = rem(60);

const useStyles = createStyles((theme) => ({
  icon: {
    position: "absolute",
    top: `calc(5% - ${ICON_SIZE} / 2)`,
    left: `calc(95% - ${ICON_SIZE} / 2)`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

const Application = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  // background-color: #dba11c;
  padding-top: 100px;
`;
const LeaderBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 38px;
  border: 1px solid black;
  border-radius: 10px;
  background-color: #f5f7f9;
  padding: 0 45px 65px 45px;
`;

type PropsType = {
  player: Player | undefined;
  setPlayer: Dispatch<SetStateAction<Player | undefined>>;
  lobby: Lobby | undefined;
  setLobby: Dispatch<SetStateAction<Lobby | undefined>>;
  currentGameRound: number;
};

export const ScoreBoard = (props: PropsType) => {
  const { player, setPlayer, lobby, setLobby, currentGameRound } = props;

  const { classes } = useStyles();
  const { lobbyId } = useParams();
  const stompClient = useStompClient();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [playerScores, setPlayerScores] = useState<number[]>([]);
  const [correctGuesses, setCorrectGuesses] = useState<number[]>([]);
  const [timeUntilCorrectGuess, setTimeUntilCorrectGuess] = useState<number[]>(
    []
  );
  const [wrongGuesses, setWrongGuesses] = useState<number[]>([]);
  const [totalCorrectGuessesInARow, setTotalCorrectGuessesInARow] = useState<
    number[]
  >([]);
  const [playerHasGuessed, setPlayerHasGuessed] = useState<number[]>([]);

  // get the player token from session storage
  const playerToken = sessionStorage.getItem("FlagManiaToken");

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/score-board`,
    (message: any) => {
      const body = JSON.parse(message.body);
      const playerNames = body.playerNames as string[];
      const totalGameScores = body.totalGameScores as number[];
      const totalCorrectGuesses = body.totalCorrectGuesses as number[];
      const totalTimeUntilCorrectGuess =
        body.totalTimeUntilCorrectGuess as number[];
      const totalWrongGuesses = body.totalWrongGuesses as number[];
      const totalCorrectGuessesInARow =
        body.totalCorrectGuessesInARow as number[];
      const playerHasGuessed = body.playerHasGuessed as number[];
      console.log("full body: ", body);
      console.log("playerHasGuessed: ", playerHasGuessed);

      setIsLoading(false);
      setPlayerNames(playerNames);
      setPlayerScores(totalGameScores);
      setCorrectGuesses(totalCorrectGuesses);
      setTimeUntilCorrectGuess(totalTimeUntilCorrectGuess);
      setWrongGuesses(totalWrongGuesses);
      setTotalCorrectGuessesInARow(totalCorrectGuessesInARow);
      setPlayerHasGuessed(playerHasGuessed);
    }
  );

  useSubscription(
    `/user/queue/lobbies/${lobbyId}/round-start`,
    (message: any) => {
      navigate(`/game/${lobbyId}`);
    }
  );
  useSubscription(
    `/user/queue/lobbies/${lobbyId}/lobby-settings`,
    (message: any) => {
      setIsLoading(false);

      const newLobby = JSON.parse(message.body) as Lobby;

      // set the lobby to the new lobby settings
      setLobby(newLobby);

      // notify which player(s) did leave
      const leftPlayerNames = lobby?.joinedPlayerNames.filter(
        (playerName: string) => !newLobby.joinedPlayerNames.includes(playerName)
      );
      leftPlayerNames?.forEach((playerName: string) => {
        if (playerName !== player?.playerName) {
          notifications.show({
            title: "Player left",
            message: playerName,
            color: "red",
          });
        }
      });

      // notify player if admin has changed
      const oldAdmin = lobby?.joinedPlayerNames.filter((n) => {
        return lobby?.playerRoleMap[n];
      })[0];
      if (oldAdmin) {
        if (!newLobby?.playerRoleMap[oldAdmin]) {
          const newAdmin = newLobby?.joinedPlayerNames.filter((n) => {
            return newLobby?.playerRoleMap[n];
          })[0];

          // do not notify the player that is leaving
          if (player) {
            if (leftPlayerNames?.includes(player?.playerName)) {
              return;
            }
          }

          if (newAdmin === player?.playerName) {
            notifications.show({
              title: "Settings update",
              message: "You are the new game admin",
              color: "green",
            });
          } else {
            notifications.show({
              title: "Settings update",
              message: `The new game admin is: ${newAdmin}`,
              color: "green",
            });
          }
        }
      }

      // update Player if its role has changed
      if (player) {
        if (newLobby.playerRoleMap[player.playerName]) {
          const updatedPlayer = { ...player };
          updatedPlayer.isCreator = true;
          setPlayer(updatedPlayer);
        }
      }
    }
  );

  // publish message to start next round
  const startNextRound = () => {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/games/${lobbyId}/game-ready`,
        body: JSON.stringify({ playerToken }),
      });
    } else {
      console.error("Error: Could not send message");
    }
  };

  interface PlayerData {
    playerName: string;
    playerScore: number;
    correctGuesses: number;
    timeUntilCorrectGuess: number;
    wrongGuesses: number;
    totalCorrectGuessesInARow: number;
    playerHasGuessed: number;
  }

  interface GameData {
    playerNames: string[];
    playerScores: number[];
    correctGuesses: number[];
    timeUntilCorrectGuess: number[];
    wrongGuesses: number[];
    totalCorrectGuessesInARow: number[];
    playerHasGuessed: number[];
  }

  // define data for leaderboard
  const data: GameData[] = [
    {
      playerNames: playerNames,
      playerScores: playerScores,
      correctGuesses: correctGuesses,
      timeUntilCorrectGuess: timeUntilCorrectGuess,
      wrongGuesses: wrongGuesses,
      totalCorrectGuessesInARow: totalCorrectGuessesInARow,
      playerHasGuessed: playerHasGuessed,
    },
  ];

  const playerData: PlayerData[] = data.flatMap((game) => {
    return game.playerNames.map((name, index) => {
      return {
        playerName: name,
        playerScore: game.playerScores[index],
        correctGuesses: game.correctGuesses[index],
        timeUntilCorrectGuess: game.timeUntilCorrectGuess[index],
        wrongGuesses: game.wrongGuesses[index],
        totalCorrectGuessesInARow: game.totalCorrectGuessesInARow[index],
        playerHasGuessed: game.playerHasGuessed[index],
      };
    });
  });

  return (
    <>
      {isLoading ? (
        <RainbowLoader />
      ) : showScoreInfo ? (
        <ScoreInfo setShowScoreInfo={setShowScoreInfo} />
      ) : (
        <Application>
          <ThemeIcon
            className={classes.icon}
            size={ICON_SIZE}
            radius={ICON_SIZE}
          >
            <IconInfoCircle
              size="2rem"
              stroke={1.5}
              onClick={() => setShowScoreInfo(true)}
              style={{ cursor: "pointer" }}
            />
          </ThemeIcon>
          <LeaderBoardContainer>
            <h1>Leaderboard Round {currentGameRound}</h1>
            <LeaderBoard playerData={playerData} currentPlayer={player} />
            {player?.isCreator && (
              <Button
                size="xl"
                onClick={startNextRound}
                style={{ marginTop: "65px" }}
              >
                Start Next Round
              </Button>
            )}
          </LeaderBoardContainer>
        </Application>
      )}
    </>
  );
};
