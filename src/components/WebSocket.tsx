import styled from "styled-components";
import { useState } from "react";
import { io } from "socket.io-client";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;

  font-size: 38px;
`;
export const WebSocket = () => {
  const socket = io("ws://sopra-fs23-group-27-server.oa.r.appspot.com");

  socket.on("message", (message) => {
    const extendedMessages = [...messages];
    extendedMessages.push(message);
    setMessages(extendedMessages);
  });
  const sendMessage = () => {
    console.log("sending: ", currentMessage);
    socket.emit("message", currentMessage);
  };

  const [messages, setMessages] = useState<Array<string>>(["Sample"]);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  return (
    <Container>
      <h1>Group 27</h1>
      <h1>FlagMania</h1>

      <ul>
        {messages.map((m, ind) => (
          <li key={ind}>{m}</li>
        ))}
      </ul>
      <input
        placeholder="message"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.currentTarget.value)}
      />
      <button onClick={() => sendMessage()}>Send</button>
    </Container>
  );
};
