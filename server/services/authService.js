const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (userData) => {
  const { username, email, password } = userData;
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists with this email');
  }
  
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const user = await User.create({
    username,
    email,
    password: hashedPassword
  });
  
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    token: generateToken(user._id)
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  
  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id)
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
