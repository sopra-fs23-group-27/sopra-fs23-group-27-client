import QRCode from "react-qr-code";

export const ScanQRCode = () => {
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

      {/* TODO: replace with actual URL */}
      <p><QRCode value="url-to-game" /></p>
      
    </div>
  );
};
