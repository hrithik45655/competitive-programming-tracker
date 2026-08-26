const express = require('express');
const router = express.Router();
const { create, getAll, getById, update, remove } = require('../controllers/problemController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

const problemValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('platform').isIn(['LeetCode', 'CodeChef', 'Codeforces', 'HackerRank', 'GeeksforGeeks', 'Other']).withMessage('Invalid platform'),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']).withMessage('Invalid difficulty'),
  body('topics').isArray({ min: 1 }).withMessage('At least one topic is required'),
  body('confidence').isIn(['Independent', 'Hint Needed', 'Solution Watched']).withMessage('Invalid confidence'),
  validate
];

router.use(protect); // All problem routes are protected

router.route('/')
  .post(problemValidation, create)
  .get(getAll);

router.route('/:id')
  .get(getById)
  .put(problemValidation, update)
  .delete(remove);

module.exports = router;
