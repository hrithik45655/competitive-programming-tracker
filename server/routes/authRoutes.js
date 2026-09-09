const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    code: 'RATE_LIMITED'
  }
});

const registerValidation = [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  body('password').exists().withMessage('Password is required'),
  validate
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  validate
];

const resetPasswordValidation = [
  body('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
  validate
];

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.get('/me', protect, getMe);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPasswordValidation, resetPassword);

module.exports = router;
