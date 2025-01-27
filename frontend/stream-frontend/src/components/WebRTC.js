import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000'); // Connect to the server

function WebRTC() {
  
  const [roomId, setRoomId] = useState("")

  useEffect(() => {
    setRoomId(window.location.pathname.replace("/",""))

    socket.emit('join-room', roomId, 10)
  }, [])

  return (
    <div>
      {/* <script src="/socket.io/socket.io.js" defer></script> */}
      <div id="video-grid"></div>
    </div>
  );
}

export default WebRTC;
