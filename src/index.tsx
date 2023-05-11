import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { StompSessionProvider } from "react-stomp-hooks";
import { mainURL } from "./helpers/httpService";

import "./index.css";
import { ErrorPage } from "./views/ErrorPage";
import reportWebVitals from "./reportWebVitals";
import { ActiveGameOverview } from "./views/ActiveGamesOverview";
import { ConfigureGame } from "./views/ConfigureGame";
import { NewGameLogin } from "./views/NewGameLogin";
import { HomePage } from "./views/HomePage";
import { WebSocket } from "./components/WebSocket";
import { Register } from "./views/Register";
import { Login } from "./views/Login";
import { ScanQRCode } from "./views/ScanQRCode";
import { GameIdInput } from "./views/EnterGameId";
import { GameLobby } from "./views/GameLobby";
import { GameRound } from "./views/GameRound";
import { ExternalGameJoin } from "./views/ExternalGameJoin";
import { ScoreBoardTest } from "./views/ScoreBoardTest";
import { ScoreBoard } from "./views/ScoreBoard";
import { App } from "./App";
import { FlagManiaGuard } from "./components/routing/FlagManiaGuard";
import { UserDashboard } from "./views/UserDashboard";
import { GameEnd } from "./views/GameEnd";
import { LoginGuard } from "./components/routing/LoginGuard";
import { PlayerGuard } from "./components/routing/PlayerGuard";

const router = createBrowserRouter([
  {
    path: "/",
    element: 
      <PlayerGuard>
        <HomePage />
      </PlayerGuard>,
    errorElement: <ErrorPage />,
  },
  {
    path: "publicGames",
    element: (
      <FlagManiaGuard shouldPreventReload={true}>
        <ActiveGameOverview />
      </FlagManiaGuard>
    ),
  },
  { path: "configureGame", element: <ConfigureGame /> },
  { path: "lobby", element: <GameLobby /> },
  { path: "webSocket", element: <WebSocket /> },
  { path: "register", element: 
    <LoginGuard>
      <Register />
    </LoginGuard> 
  },
  { path: "login", element:
    <LoginGuard>
      <Login />
    </LoginGuard>
  },
  { path: "newGameLogin", element: <NewGameLogin /> },
  { path: "websocket", element: <WebSocket /> },
  { path: "scanQRCode/:lobbyId", element: <ScanQRCode /> },
  { path: "enterGameId", element: <GameIdInput /> },
  {
    path: "lobbies/:lobbyId",
    element: (
      <FlagManiaGuard shouldPreventReload={true}>
        <GameLobby />
      </FlagManiaGuard>
    ),
  },
  {
    path: "game/:lobbyId",
    element: (
      <FlagManiaGuard shouldPreventReload={true}>
        <GameRound />
      </FlagManiaGuard>
    ),
  },
  { path: "lobbies/:lobbyId/join", element: <ExternalGameJoin /> },
  {
    path: "game/:lobbyId/leaderBoard",
    element: (
      <FlagManiaGuard shouldPreventReload={true}>
        <ScoreBoard />
      </FlagManiaGuard>
    ),
  },
  { path: "leaderBoard", element: <ScoreBoardTest /> },
  { path: "dashboard", element: <UserDashboard /> },
  { path: "gameEnd", element: <GameEnd /> },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <StompSessionProvider
        url={mainURL + "/ws"}
        //All options supported by @stomp/stompjs can be used here
      >
        <RouterProvider router={router} />
        <App />
      </StompSessionProvider>
    </MantineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
