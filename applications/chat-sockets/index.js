const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins, adjust as needed
    methods: ['GET', 'POST'],
  },
});

// Express route
app.get('/', (req, res) => {
  res.send('Socket.io server is running');
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', (msg) => {
    console.log(`Message from ${socket.id}:`, msg);
    io.emit('message', msg); // Broadcast message
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
