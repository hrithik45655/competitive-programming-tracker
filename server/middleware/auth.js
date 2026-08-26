const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id; // Add userId to request
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed', code: 'UNAUTHORIZED' });
    }
  }
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token', code: 'NO_TOKEN' });
  }
};

module.exports = { protect };
