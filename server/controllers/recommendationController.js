const recommendationService = require('../services/recommendationService');
const analyticsService = require('../services/analyticsService');
const revisionService = require('../services/revisionService');

const getRecommendations = async (req, res) => {
  try {
    const topics = await analyticsService.getTopicPerformance(req.userId);
    const dueRevisions = await revisionService.getDueRevisions(req.userId);
    
    // Convert topics array to an object map for score calculations
    const topicPerformanceMap = {};
    topics.forEach(t => {
      topicPerformanceMap[t.name] = t.performance;
    });
    
    // Sort due revisions by priority score
    dueRevisions.forEach(problem => {
      problem._doc.priorityScore = recommendationService.calculatePriorityScore(problem, topicPerformanceMap);
      problem._doc.priorityLabel = recommendationService.getPriorityLabel(problem._doc.priorityScore);
    });
    dueRevisions.sort((a, b) => b._doc.priorityScore - a._doc.priorityScore);

    const recommendations = recommendationService.generateRecommendations(topics, dueRevisions);
    
    res.status(200).json({ success: true, data: { recommendations, dueRevisions } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getRecommendations };
