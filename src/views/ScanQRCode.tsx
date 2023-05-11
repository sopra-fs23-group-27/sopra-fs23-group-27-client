import QRCode from "react-qr-code";
import { httpGet, mainURL } from "../helpers/httpService";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffectOnce } from "../customHooks/useEffectOnce";
import { ButtonCopy } from "../components/ClipboardButton";
import { notifications } from "@mantine/notifications";
import { getGameUrl } from "./GameLobby";

export const ScanQRCode = () => {

  //TODO: ensure that GameURL is set to CLIENT and not SERVER in production
  const GameURL = getGameUrl();

  return (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            height: "80vh",
            position: "relative",
            flexDirection: "column",
            alignItems: "center"
        }}
    >
      <h1>Scan the following QR code to join the game</h1>

      <p><QRCode value={GameURL} /></p>


      <p><ButtonCopy url={GameURL} /></p>
      
    </div>
  );
};