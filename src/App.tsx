import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./views/HomePage";
import { ActiveGameOverview } from "./views/ActiveGamesOverview";
import { FlagManiaGuard } from "./components/routing/FlagManiaGuard";
import { ConfigureGame } from "./views/ConfigureGame";
import { Login } from "./views/Login";
import { Register } from "./views/Register";
import { GameLobby } from "./views/GameLobby";
import { NewGameLogin } from "./views/NewGameLogin";
import { ScanQRCode } from "./views/ScanQRCode";
import { GameIdInput } from "./views/EnterGameId";
import { GameRound } from "./views/GameRound";
import { ExternalGameJoin } from "./views/ExternalGameJoin";
import { ScoreBoard } from "./views/ScoreBoard";
import { ScoreBoardTest } from "./views/ScoreBoardTest";
import { useState } from "react";
import Player from "./models/Player";
import Lobby from "./models/Lobby";

import { PlayerGuard } from "./components/routing/PlayerGuard";
import { LoginGuard } from "./components/routing/LoginGuard";
import { UserDashboard } from "./views/UserDashboard";
import { GameEnd } from "./views/GameEnd";

import "./App.css";

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [player, setPlayer] = useState<Player | undefined>();
  const [lobby, setLobby] = useState<Lobby | undefined>();
  const [currentGameRound, setCurrentGameRound] = useState(0);

  console.log("currentGameRound: ", currentGameRound);
  console.log("lobby: ", lobby);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PlayerGuard>
              <HomePage
                player={player}
                setPlayer={setPlayer}
                isLoggedIn={isLoggedIn}
              />
            </PlayerGuard>
          }
        />

        <Route
          path="/publicGames"
          element={
            <FlagManiaGuard shouldPreventReload={true}>
              <ActiveGameOverview setLobby={setLobby} />
            </FlagManiaGuard>
          }
        />
        <Route
          path="/configureGame"
          element={<ConfigureGame setLobby={setLobby} />}
        />
        <Route path="/lobby" element={<GameLobby player={player} />} />
        <Route
          path="/register"
          element={
            <LoginGuard>
              <Register />
            </LoginGuard>
          }
        />
        <Route
          path="/login"
          element={
            <LoginGuard>
              <Login />
            </LoginGuard>
          }
        />
        <Route path="/newGameLogin" element={<NewGameLogin />} />
        <Route path="/scanQRCode/:lobbyId" element={<ScanQRCode />} />
        <Route path="/enterGameId" element={<GameIdInput />} />

        <Route
          path="/lobbies/:lobbyId"
          element={
            <FlagManiaGuard shouldPreventReload={true}>
              <GameLobby player={player} />
            </FlagManiaGuard>
          }
        />
        <Route
          path="/game/:lobbyId"
          element={
            <FlagManiaGuard shouldPreventReload={true}>
              <GameRound
                currentGameRound={currentGameRound}
                setCurrentGameRound={setCurrentGameRound}
                gameMode={lobby?.mode}
              />
            </FlagManiaGuard>
          }
        />
        <Route path="/lobbies/:lobbyId/join" element={<ExternalGameJoin />} />
        <Route
          path="/game/:lobbyId/leaderBoard"
          element={
            <FlagManiaGuard shouldPreventReload={true}>
              <ScoreBoard player={player} />
            </FlagManiaGuard>
          }
        />
        <Route path="/leaderBoard" element={<ScoreBoardTest />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route
          path="/game/:lobbyId/gameEnd"
          element={<GameEnd player={player} />}
        />
      </Routes>
    </Router>
  );
};
