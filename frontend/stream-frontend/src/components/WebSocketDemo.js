import React, { useState, useEffect } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketDemo = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log("Connected to WebSocket");

      // Subscribe to the /topic/messages topic
      // client.subscribe("/topic/messages", (message) => {
      //   console.log("DEMO::", message)
      //   setMessages((prev) => [...prev, message.body]);
      // });
    });

    setStompClient(client);

    // Cleanup connection on unmount
    return () => {
      if (client) {
        client.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && input) {
      // Send message to /app/send endpoint
      stompClient.send("/app/send", {}, input);
      setInput("");
    }
  };

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <div>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default WebSocketDemo;
