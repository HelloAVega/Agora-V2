require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
const buildPath = path.join(__dirname, '../client/dist');
app.use(express.static(buildPath));
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Simple logger for auth API requests to help debug uploads
app.use((req, res, next) => {
  try {
    if (req.path && req.path.startsWith('/api/auth')) {
      console.log('[auth-logger]', req.method, req.path, 'headers:', { authorization: !!req.headers.authorization })
    }
  } catch (e) {}
  next()
})

// Auth routes (register / login)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

// WebSocket connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Catch-all handler to serve React app for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;

// Initialize DB and then start server
const sequelize = require('./config/database');
// Load models so sequelize knows about them
require('./models/user');
require('./models/chatSession');
require('./models/chatMessage');

const User = require('./models/user');
const ChatSession = require('./models/chatSession');
const ChatMessage = require('./models/chatMessage');

User.hasMany(ChatSession, { foreignKey: 'userId', as: 'chatSessions', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
ChatSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ChatSession.hasMany(ChatMessage, { foreignKey: 'chatSessionId', as: 'messages', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
ChatMessage.belongsTo(ChatSession, { foreignKey: 'chatSessionId', as: 'session' });

(async () => {
  try {
    await sequelize.authenticate();
    // Use alter to update DB schema with new fields (adds `avatar` if missing)
    await sequelize.sync({ alter: true });
    const queryInterface = sequelize.getQueryInterface();
    try {
      await sequelize.query('ALTER TABLE "chat_sessions" DROP CONSTRAINT IF EXISTS "chat_sessions_userId_key";')
      await sequelize.query('DROP INDEX IF EXISTS "chat_sessions_userId_key";')
      const indexes = await queryInterface.showIndex('chat_sessions');
      for (const index of indexes) {
        const hasUserIdField = Array.isArray(index.fields) && index.fields.some((field) => field.attribute === 'userId');
        if (index.unique && hasUserIdField) {
          await queryInterface.removeIndex('chat_sessions', index.name);
        }
      }
    } catch (indexError) {
      console.warn('Could not normalize chat session indexes:', indexError.message || indexError);
    }
    console.log('✅ Database connected and synced');
  } catch (err) {
    console.error('Database connection failed:', err.message || err);
  }

  httpServer.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📱 Frontend serving from: ${buildPath}`);
  });
})();

module.exports = { app, io };