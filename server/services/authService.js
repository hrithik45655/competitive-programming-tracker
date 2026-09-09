const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User with this email does not exist');
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  return resetToken;
};

const resetPassword = async (resetToken, newPassword) => {
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error('Invalid or expired password reset token');
  }

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return true;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword
};
