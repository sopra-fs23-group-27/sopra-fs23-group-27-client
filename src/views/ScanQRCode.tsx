import QRCode from "react-qr-code";
import { httpGet, mainURL } from "../helpers/httpService";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffectOnce } from "../customHooks/useEffectOnce";
import { ButtonCopy } from "../components/ClipboardButton";

export const ScanQRCode = () => {

  const [privateUrl, setPrivateUrl] = useState("");
  const { lobbyId } = useParams();
  const headers = { Authorization: localStorage.getItem("token") }

  useEffectOnce(() => {
    httpGet("/lobbies/" + lobbyId, { headers })
      .then((response) => {
        setPrivateUrl(mainURL + lobbyId + "/join");
      })
      .catch((error) => {
        console.error(error);
      });
  }); 

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

      <p><QRCode value={privateUrl} /></p>


      <p><ButtonCopy url={privateUrl} /></p>
      
    </div>
  );
};