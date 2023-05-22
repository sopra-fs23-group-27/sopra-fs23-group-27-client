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
import { ScoreInfo } from "./views/ScoreInfo";

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

  @media (orientation: portrait) and (max-width: 768px) {
    width: auto;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // only playerId, flagmaniaToken is stored in sessionStorage
  // tell backend to create a GET endpoint where we can get the player object with a given playerId

  const [player, setPlayer] = useState<Player | undefined>();
  const [lobby, setLobby] = useState<Lobby | undefined>();
  const [currentGameRound, setCurrentGameRound] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("playerId") && !player) {
      //get request to fetch player object
    }
  }, []);

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
                  setIsLoggedIn={setIsLoggedIn}
                />
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
            element={<ConfigureGame setLobby={setLobby} />}
            errorElement={<ErrorPage />}
          />
          <Route
            path="/register"
            element={
              <LoginGuard>
                <Register setPlayer={setPlayer} setIsLoggedIn={setIsLoggedIn} />
              </LoginGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/login"
            element={
              <LoginGuard>
                <Login setPlayer={setPlayer} setIsLoggedIn={setIsLoggedIn} />
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
                  player={player}
                  setPlayer={setPlayer}
                  lobby={lobby}
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
                setIsLoggedIn={setIsLoggedIn}
              />
            }
            errorElement={<ErrorPage />}
          />
          <Route
            path="/game/:lobbyId/leaderBoard"
            element={
              <FlagManiaGuard shouldPreventReload={true} player={player}>
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
                <RegisterToSaveStats
                  setPlayer={setPlayer}
                  setIsLoggedIn={setIsLoggedIn}
                />
              </FlagManiaGuard>
            }
          />
          <Route path="/gameInfo" element={<GameInfo />} />
          <Route
            path="/game/:lobbyId/scoreInfo"
            element={
              <FlagManiaGuard shouldPreventReload={true} player={player}>
                <ScoreInfo />
              </FlagManiaGuard>
            }
            errorElement={<ErrorPage />}
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
};
