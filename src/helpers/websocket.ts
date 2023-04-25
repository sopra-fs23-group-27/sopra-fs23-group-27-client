import { Client } from "@stomp/stompjs";

export const authenticate = (stompClient: Client) => {
  const playerToken = localStorage.getItem("token");
  console.log("player token: ", playerToken);

  if (stompClient) {
    stompClient.publish({
      destination: "/app/authenticate",
      body: JSON.stringify({ playerToken }),
    });
  } else {
    console.error("Error: Could not send message");
  }
};
