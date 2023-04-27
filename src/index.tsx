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

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  { path: "publicGames", element: <ActiveGameOverview /> },
  { path: "configureGame", element: <ConfigureGame /> },
  { path: "lobby", element: <GameLobby /> },
  { path: "webSocket", element: <WebSocket /> },
  { path: "register", element: <Register /> },
  { path: "login", element: <Login /> },
  { path: "newGameLogin", element: <NewGameLogin /> },
  { path: "websocket", element: <WebSocket /> },
  { path: "scanQRCode/:lobbyId", element: <ScanQRCode /> },
  { path: "enterGameId", element: <GameIdInput /> },
  { path: "lobbies/:lobbyId", element: <GameLobby /> },
  { path: "game/:lobbyId", element: <GameRound /> },
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
      </StompSessionProvider>
    </MantineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
