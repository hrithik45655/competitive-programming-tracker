const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${timestamp}] ${requestId} - ${req.method} ${req.path}`);
  req.requestId = requestId;
  next();
});

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/problems', require('./routes/problemRoutes'));
app.use('/api/revisions', require('./routes/revisionRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

module.exports = app;
