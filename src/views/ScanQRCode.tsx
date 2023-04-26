import QRCode from "react-qr-code";
import { ButtonCopy } from "../components/ClipboardButton";

export const ScanQRCode = () => {

  const url  = "http://localhost:3000/gameRound"

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
      <p><QRCode value="https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=5s" /></p>


      {/* <ButtonCopy url={url} /> */}
        

    </div>
  );
};
