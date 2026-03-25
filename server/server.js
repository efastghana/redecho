require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const storiesRouter = require('./routes/stories');
const reactionsRouter = require('./routes/reactions');
const commentsRouter = require('./routes/comments');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const messagesRouter = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/redecho';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/stories', storiesRouter);
app.use('/api/reactions', reactionsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user/messages', messagesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🔴 RedEcho Backend running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`💾 MongoDB: ${MONGODB_URI.split('@')[1] || MONGODB_URI}\n`);
});
