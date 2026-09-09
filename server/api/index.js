const app = require('../app');
const mongoose = require('mongoose');

let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      console.log('=> connecting to database');
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
      }
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection error. Ensure MONGODB_URI is set to a valid MongoDB Atlas cluster, not localhost.', 
      error: error.message 
    });
  }

  // Delegate the request to the Express app
  return app(req, res);
};
