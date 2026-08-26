const analyticsService = require('../services/analyticsService');

const getDashboard = async (req, res) => {
  try {
    const stats = await analyticsService.getDashboardStats(req.userId);
    const streaks = await analyticsService.getStreakData(req.userId);
    res.status(200).json({ success: true, data: { ...stats, streaks } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getTopics = async (req, res) => {
  try {
    const topics = await analyticsService.getTopicPerformance(req.userId);
    res.status(200).json({ success: true, data: topics });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getTrends = async (req, res) => {
  try {
    const trends = await analyticsService.getSolvingTrends(req.userId, req.query.period);
    res.status(200).json({ success: true, data: trends });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getPlatforms = async (req, res) => {
  try {
    const platforms = await analyticsService.getPlatformStats(req.userId);
    res.status(200).json({ success: true, data: platforms });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, getTopics, getTrends, getPlatforms };
