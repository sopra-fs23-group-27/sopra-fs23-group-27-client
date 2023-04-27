import QRCode from "react-qr-code";
import { httpGet } from "../helpers/httpService";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffectOnce } from "../customHooks/useEffectOnce";

export const ScanQRCode = () => {

  const [privateUrl, setPrivateUrl] = useState("");
  const { lobbyId } = useParams();
  const headers = { Authorization: localStorage.getItem("token") }

  useEffectOnce(() => {
    httpGet("/lobbies/" + lobbyId, { headers })
      .then((response) => {
        setPrivateUrl("www.google.com/" + response.data.lobbyId);
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

      {/* TODO: replace with dynamic URL */}
      <p><QRCode value={privateUrl} /></p>


      {/* <ButtonCopy url={url} /> */}
        

    </div>
  );
};
