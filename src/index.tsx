import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MantineProvider} from "@mantine/core";

import "./index.css";
import { App } from "./App";
import { ErrorPage } from "./views/ErrorPage";
import reportWebVitals from "./reportWebVitals";
import { Player } from "./components/Player";
import { NewGame } from "./views/NewGame";
import { HomePage } from "./components/HomePage";

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
  { path: "newGame", 
    element: <NewGame />,
    errorElement: <ErrorPage />
  },
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