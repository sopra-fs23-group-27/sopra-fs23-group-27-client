import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./views/HomePage";
import { ActiveGameOverview } from "./views/ActiveGamesOverview";
import { FlagManiaGuard } from "./components/routing/FlagManiaGuard";
import { ConfigureGame } from "./views/ConfigureGame";
import { Login } from "./views/Login";
import { Register } from "./views/Register";
import { GameLobby } from "./views/GameLobby";
import { NewGameLogin } from "./views/NewGameLogin";
import { GameIdInput } from "./views/EnterGameId";
import { GameRound } from "./views/GameRound";
import { ExternalGameJoin } from "./views/ExternalGameJoin";
import { ScoreBoard } from "./views/ScoreBoard";
import { ScoreBoardTest } from "./views/ScoreBoardTest";
import { useEffect, useState } from "react";
import Player from "./models/Player";
import Lobby from "./models/Lobby";
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
  width: 100%;
  height: auto;
  z-index: -0.5;
  opacity: 0.1;
  transform: translateY(-150px);
`;

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [player, setPlayer] = useState<Player | undefined>();
  const [lobby, setLobby] = useState<Lobby | undefined>();
  const [currentGameRound, setCurrentGameRound] = useState(0);

  console.log("currentGameRound: ", currentGameRound);
  if (lobby) {
    console.log("roundAmount: ", lobby?.numRounds);
  }

  return (
    <>
      <BackgroundImageContainer>
        <FlagManiaBackground src={FlagBackground} />
      </BackgroundImageContainer>

      <Router>
        <FlagmaniaLogo />
        <Routes>
          <Route
            path="/"
            element={
              <LoginGuard>
                <HomePage
                  player={player}
                  setPlayer={setPlayer}
                  isLoggedIn={isLoggedIn}
                />
              </LoginGuard>
            }
            errorElement={<ErrorPage />}
          />

          <Route
            path="/publicGames"
            element={
              <FlagManiaGuard shouldPreventReload={false}>
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
            element={<ConfigureGame setLobby={setLobby} />}
            errorElement={<ErrorPage />}
          />
          <Route
            path="/register"
            element={
              <LoginGuard>
                <Register setPlayer={setPlayer} />
              </LoginGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/login"
            element={
              <LoginGuard>
                <Login setPlayer={setPlayer} />
              </LoginGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/newGameLogin"
            element={<NewGameLogin />}
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
              <FlagManiaGuard shouldPreventReload={true}>
                <GameLobby player={player} setPlayer={setPlayer} />
              </FlagManiaGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/game/:lobbyId"
            element={
              <FlagManiaGuard shouldPreventReload={true}>
                <GameRound
                  currentGameRound={currentGameRound}
                  setCurrentGameRound={setCurrentGameRound}
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
                setPlayer={setPlayer}
                setCurrentGameRound={setCurrentGameRound}
              />
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/game/:lobbyId/leaderBoard"
            element={
              <FlagManiaGuard shouldPreventReload={true}>
                <ScoreBoard player={player} />
              </FlagManiaGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route path="/leaderBoard" element={<ScoreBoardTest />} />
          <Route
            path="/dashboard"
            element={
              <PlayerGuard>
                <UserDashboard player={player} setPlayer={setPlayer} />
              </PlayerGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/playerSettings/:playerId"
            element={
              <PlayerGuard>
                <PlayerSettings />
              </PlayerGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/game/:lobbyId/gameEnd"
            element={
              <FlagManiaGuard shouldPreventReload={true}>
                <GameEnd player={player} />
              </FlagManiaGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/playAgain"
            element={
              <PlayAgain
                setLobby={setLobby}
                lobby={lobby}
                setCurrentGameRound={setCurrentGameRound}
              />
            }
          />
          <Route
            path="/saveStatsRegister"
            element={<RegisterToSaveStats setPlayer={setPlayer} />}
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
};
