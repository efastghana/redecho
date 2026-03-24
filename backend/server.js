require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const storiesRouter = require('./routes/stories');
const reactionsRouter = require('./routes/reactions');
const commentsRouter = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/redecho';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/stories', storiesRouter);
app.use('/api/reactions', reactionsRouter);
app.use('/api/comments', commentsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`\n🔴 RedEcho Backend running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`💾 MongoDB: ${MONGODB_URI}\n`);
});
