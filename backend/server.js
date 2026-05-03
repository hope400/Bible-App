const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB error:', err));

// ── Initialise socket helper BEFORE importing routes ──────────
const socketEmitter = require('./socket');
socketEmitter.init(io);

// ── Track live connected users ────────────────────────────────
const connectedUsers = new Map();

function broadcastMembers() {
  const members = Array.from(connectedUsers.values());
  io.emit('members:update', { count: members.length, members });
}

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Frontend sends user info when landing on Community page
  socket.on('user:join', ({ name, userId }) => {
    connectedUsers.set(socket.id, {
      name: name || 'Anonymous',
      userId,
      action: 'Just joined the sanctuary',
      socketId: socket.id
    });
    broadcastMembers();
    socketEmitter.emit('activity:new', {
      name: name || 'Someone',
      action: 'joined the sanctuary',
      icon: '🌅',
      timestamp: new Date().toISOString()
    });
  });

  // Frontend can update what the user is currently doing
  socket.on('user:action', ({ action, icon }) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.action = action;
      connectedUsers.set(socket.id, user);
      broadcastMembers();
      socketEmitter.emit('activity:new', {
        name: user.name, action, icon: icon || '✨',
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`${user.name} disconnected`);
      connectedUsers.delete(socket.id);
      broadcastMembers();
    }
  });
});

// ── Routes ────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const journalRoutes = require('./routes/journal');
app.use('/api/journals', journalRoutes);

const postRoutes = require('./routes/post');
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Bible App API is running' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { io };