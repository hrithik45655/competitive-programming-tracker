const express = require('express');
const router = express.Router();
const { getDashboard, getTopics, getTrends, getPlatforms } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/topics', getTopics);
router.get('/trends', getTrends);
router.get('/platforms', getPlatforms);

module.exports = router;
