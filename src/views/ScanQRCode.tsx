import QRCode from "react-qr-code";
import { httpGet, mainURL } from "../helpers/httpService";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useEffectOnce } from "../customHooks/useEffectOnce";
import { ButtonCopy } from "../components/ClipboardButton";
import { notifications } from "@mantine/notifications";
import { getGameUrl } from "./GameLobby";
import Logo from "../icons/DALL-E_FlagMania_Logo.png";

export const ScanQRCode = () => {
  const GameURL = getGameUrl();
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "80vh",
        position: "relative",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        src={Logo}
        alt="FlagMania Logo"
        onClick={() => navigate("/")}
        style={{
          top: "10px",
          left: "10px",
          padding: "10px",
          width: "5%",
          height: "auto",
          position: "absolute",
          cursor: "pointer",
        }}
      />
      <h1>Scan the following QR code to join the game</h1>

      <p>
        <QRCode value={GameURL} />
      </p>

      <p>
        <ButtonCopy url={GameURL} />
      </p>
    </div>
  );
};
