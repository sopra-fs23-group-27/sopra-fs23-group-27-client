import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MantineProvider, Text } from "@mantine/core";

import "./index.css";
import { App } from "./App";
import { ErrorPage } from "./components/ErrorPage";
import reportWebVitals from "./reportWebVitals";
import { Player } from "./components/Player";
import { ActiveGameOverview } from "./components/ActiveGamesOverview";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "players/:playerId",
    element: <Player />,
  },
  { path: "publicGames", element: <ActiveGameOverview /> },
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
