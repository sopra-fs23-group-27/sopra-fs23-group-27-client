import styled from "styled-components";
import { useState } from "react";
import { useSubscription, useStompClient } from "react-stomp-hooks";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 38px;
`;
export const WebSocket = () => {
  const [messages, setMessages] = useState<Array<string>>(["Sample"]);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  useSubscription("/topic/messages", (message: any) => {
    const newMessage = JSON.parse(message.body).message as string;
    if (newMessage.includes("Hello, world!")) {
      return;
    }
    setMessages([...messages, newMessage]);
  });
  const stompClient = useStompClient();

  // include playerToken in the body for first publication request
  // publish auf app/authentication --> to join

  // then publish to user/queue/lobbies/:lobby-id/lobby-settings
  const sendMessage = () => {
    if (stompClient) {
      //Send Message
      stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify({ message: currentMessage }),
      });
      console.log("Message sent: ", currentMessage)
      setCurrentMessage("");
    } else {
      console.error("Error: Could not send message");
    }
  };
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
