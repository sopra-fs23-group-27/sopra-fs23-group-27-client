import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

import "./index.css";
import { App } from "./App";
import { ErrorPage } from "./views/ErrorPage";
import reportWebVitals from "./reportWebVitals";
import { Player } from "./components/Player";
import { ActiveGameOverview } from "./views/ActiveGamesOverview";
import { ConfigureGame } from "./views/ConfigureGame";
import { NewGame } from "./views/NewGame";
import { HomePage } from "./components/HomePage";
import { WebSocket } from "./components/WebSocket";
import { Register } from "./views/Register";
import { Login } from "./views/Login";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "home",
    element: <HomePage />,
  },
  {
    path: "players/:playerId",
    element: <Player />,
  },
  { path: "publicGames", element: <ActiveGameOverview /> },
  { path: "configureGame", element: <ConfigureGame /> },
  { path: "newGame", element: <NewGame /> },
  { path: "webSocket", element: <WebSocket /> },
  { path: "register", element: <Register /> },
  { path: "login", element: <Login /> },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
