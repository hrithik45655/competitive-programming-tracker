const express = require('express');
const router = express.Router();
const { getDue, record, getByProblem } = require('../controllers/revisionController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

const recordValidation = [
  body('problemId').notEmpty().withMessage('Problem ID is required'),
  body('confidenceAfter').isIn(['Independent', 'Hint Needed', 'Solution Watched']).withMessage('Invalid confidence value'),
  validate
];

router.use(protect); // Protect all routes

router.get('/due', getDue);
router.post('/', recordValidation, record);
router.get('/problem/:problemId', getByProblem);

module.exports = router;
