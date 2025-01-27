const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:3000' })); 

//const server = require('http').Server(app)
// const io = require('socket.io')(server)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST'],       // Allowed methods
    credentials: true               // Allow credentials like cookies or headers
  }
});

const { v4: uuidV4 } = require('uuid')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room})
})

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    console.log(roomId, userId);
    
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-joined', userId)
  })

  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message', `Server: ${data}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
})

server.listen(PORT, () => {
  console.log('Server running on http://localhost:3001');
});
