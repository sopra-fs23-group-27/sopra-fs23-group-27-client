import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./views/HomePage";
import { ActiveGameOverview } from "./views/ActiveGamesOverview";
import { FlagManiaGuard } from "./components/routing/FlagManiaGuard";
import { ConfigureGame } from "./views/ConfigureGame";
import { Login } from "./views/Login";
import { Register } from "./views/Register";
import { GameLobby } from "./views/GameLobby";
import { GameIdInput } from "./views/EnterGameId";
import { GameRound } from "./views/GameRound";
import { ExternalGameJoin } from "./views/ExternalGameJoin";
import { ScoreBoard } from "./views/ScoreBoard";
import { ScoreBoardTest } from "./views/ScoreBoardTest";
import { useEffect, useState } from "react";
import { Lobby } from "./types/Lobby";
import { Player } from "./types/Player";

import FlagBackground from "./icons/Background_Flagmania.png";

import { PlayerGuard } from "./components/routing/PlayerGuard";
import { LoginGuard } from "./components/routing/LoginGuard";
import { UserDashboard } from "./views/UserDashboard";
import { GameEnd } from "./views/GameEnd";

import { PlayerSettings } from "./views/PlayerSettings";
import { PlayAgain } from "./views/PlayAgain";
import { ErrorPage } from "./views/ErrorPage";
import { RegisterToSaveStats } from "./views/RegisterToSaveStats";
import { FlagmaniaLogo } from "./components/FlagmaniaLogo";
import styled from "styled-components";
import { GameInfo } from "./views/GameInfo";
import { ScoreInfo } from "./components/ScoreInfo";
import { httpGet } from "./helpers/httpService";
import { GameInfoDashboard } from "./views/GameInfoDashboard";

const BackgroundImageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const FlagManiaBackground = styled.img`
  position: absolute;
  z-index: -0.5;
  opacity: 0.1;

  @media (orientation: landscape) and (min-aspect-ratio: 1/1) {
    width: 100%;
    height: auto;
    transform: translateY(-150px);
  }

  @media (orientation: portrait) and (max-width: 1500px) {
    width: auto;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const App = () => {
  const [player, setPlayer] = useState<Player | undefined>();
  const [lobby, setLobby] = useState<Lobby | undefined>();
  const [currentGameRound, setCurrentGameRound] = useState(0);

  console.log("lobby: ", lobby);
  // only playerId, flagmaniaToken is stored in sessionStorage

  useEffect(() => {
    getPlayer();
  }, []);

  const getPlayer = async () => {
    if (sessionStorage.getItem("currentPlayerId") && !player) {
      // get player object from backend
      try {
        const response = await httpGet(
          `/players/${sessionStorage.getItem("currentPlayerId")}`,
          {
            headers: {
              Authorization: sessionStorage.getItem("FlagManiaToken"),
            },
          }
        );
        if (response.status === 200) {
          console.log(response.data);
          setPlayer(response.data);
          console.log(player);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <BackgroundImageContainer>
        <FlagManiaBackground src={FlagBackground} />
      </BackgroundImageContainer>

      <Router>
        <FlagmaniaLogo
          player={player}
          lobby={lobby}
          setPlayer={setPlayer}
          setLobby={setLobby}
        />
        <Routes>
          <Route
            path="/"
            element={
              <LoginGuard player={player}>
                <HomePage player={player} setPlayer={setPlayer} />
              </LoginGuard>
            }
            errorElement={<ErrorPage />}
          />

          <Route
            path="/publicGames"
            element={
              <FlagManiaGuard shouldPreventReload={false} player={player}>
                <ActiveGameOverview
                  setLobby={setLobby}
                  setCurrentGameRound={setCurrentGameRound}
                />
              </FlagManiaGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/configureGame"
            element={
              <ConfigureGame
                setLobby={setLobby}
                setCurrentGameRound={setCurrentGameRound}
              />
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/register"
            element={
              <LoginGuard player={player}>
                <Register setPlayer={setPlayer} />
              </LoginGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/login"
            element={
              <LoginGuard player={player}>
                <Login setPlayer={setPlayer} />
              </LoginGuard>
            }
            errorElement={<ErrorPage />}
          />

          <Route
            path="/enterGameId"
            element={<GameIdInput />}
            errorElement={<ErrorPage />}
          />

          <Route
            path="/lobbies/:lobbyId"
            element={
              <FlagManiaGuard shouldPreventReload={true} player={player}>
                <GameLobby
                  setCurrentGameRound={setCurrentGameRound}
                  player={player}
                  setPlayer={setPlayer}
                  lobby={lobby}
                  setLobby={setLobby}
                />
              </FlagManiaGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/game/:lobbyId"
            element={
              <FlagManiaGuard shouldPreventReload={true} player={player}>
                <GameRound
                  currentGameRound={currentGameRound}
                  setCurrentGameRound={setCurrentGameRound}
                  player={player}
                  gameMode={lobby?.mode}
                  numRounds={lobby?.numRounds}
                />
              </FlagManiaGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/lobbies/:lobbyId/join"
            element={
              <ExternalGameJoin
                setLobby={setLobby}
                player={player}
                setPlayer={setPlayer}
                setCurrentGameRound={setCurrentGameRound}
              />
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/game/:lobbyId/leaderBoard"
            element={
              <FlagManiaGuard shouldPreventReload={true} player={player}>
                <ScoreBoard
                  player={player}
                  currentGameRound={currentGameRound}
                />
              </FlagManiaGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route path="/leaderBoard" element={<ScoreBoardTest />} />
          <Route
            path="/dashboard"
            element={
              <PlayerGuard player={player}>
                <UserDashboard player={player} setPlayer={setPlayer} />
              </PlayerGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/playerSettings/:playerId"
            element={
              <PlayerGuard player={player}>
                <PlayerSettings player={player} setPlayer={setPlayer} />
              </PlayerGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/game/:lobbyId/gameEnd"
            element={
              <FlagManiaGuard shouldPreventReload={true} player={player}>
                <GameEnd player={player} />
              </FlagManiaGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/playAgain"
            element={
              <FlagManiaGuard shouldPreventReload={true} player={player}>
                <PlayAgain
                  setLobby={setLobby}
                  lobby={lobby}
                  setCurrentGameRound={setCurrentGameRound}
                />
              </FlagManiaGuard>
            }
          />
          <Route
            path="/saveStatsRegister"
            element={
              <FlagManiaGuard shouldPreventReload={true} player={player}>
                <RegisterToSaveStats player={player} setPlayer={setPlayer} />
              </FlagManiaGuard>
            }
          />
          <Route
            path="/gameInfo"
            element={<GameInfo />}
            errorElement={<ErrorPage />}
          />
          <Route
            path="/gameInfoDashboard"
            element={
              <PlayerGuard player={player}>
                <GameInfoDashboard />
              </PlayerGuard>
            }
            errorElement={<ErrorPage />}
          />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
};
