const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body.email, req.body.password);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const resetToken = await authService.forgotPassword(req.body.email);
    
    // Create reset url
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    
    console.log(`Password reset link: ${resetUrl}`);

    res.status(200).json({ success: true, message: 'Password reset token generated. Check terminal for link.', token: resetToken });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.params.token, req.body.password);
    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword
};
