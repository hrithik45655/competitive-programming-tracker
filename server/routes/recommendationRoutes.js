const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getRecommendations);

module.exports = router;
