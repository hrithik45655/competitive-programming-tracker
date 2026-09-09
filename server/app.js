const express = require('express');
const cors = require('cors');

const app = express();

// Trust proxy for Render deployment (needed for rate limiting)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://competitive-programming-tracker-je3.vercel.app'
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Vercel preview deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Allow production CLIENT_URL (ignoring trailing slashes)
    if (process.env.CLIENT_URL) {
      const cleanClientUrl = process.env.CLIENT_URL.replace(/\/$/, '');
      if (origin === cleanClientUrl) {
        return callback(null, true);
      }
    }

    callback(new Error('Not allowed by CORS'));
  },
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
