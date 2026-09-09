require('dotenv').config();
const app = require('../server/app');
const mongoose = require('mongoose');

// Vercel serverless functions require reusing the DB connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }
  
  console.log('=> using new database connection');
  const db = await mongoose.connect(process.env.MONGODB_URI);
  isConnected = db.connections[0].readyState === 1;
};

// Connect to the DB outside of the request handler to reuse it
connectDB().catch(console.error);

module.exports = app;
