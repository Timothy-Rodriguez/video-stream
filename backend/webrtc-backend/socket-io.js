const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({ origin: 'http://localhost:3000' })); // Replace with your frontend's URL

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST'],       // Allowed methods
    credentials: true               // Allow credentials like cookies or headers
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    console.log(roomId, userId);
    
  })

  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message', `Server: ${data}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
