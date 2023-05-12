import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { StompSessionProvider } from "react-stomp-hooks";
import { mainURL } from "./helpers/httpService";

import { App } from "./App";
import { Notifications } from "@mantine/notifications";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <StompSessionProvider
      url={mainURL + "/ws"}
      //All options supported by @stomp/stompjs can be used here
    >
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Notifications />
        <App />
      </MantineProvider>
    </StompSessionProvider>
  </React.StrictMode>
);
