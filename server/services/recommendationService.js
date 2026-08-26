const calculatePriorityScore = (problem, topicPerformance = {}) => {
  const now = new Date();
  const nextRevisionDate = problem.nextRevisionDate;
  
  let overdueScore = 0;
  if (nextRevisionDate && nextRevisionDate < now) {
    const daysOverdue = Math.floor((now - nextRevisionDate) / (1000 * 60 * 60 * 24));
    overdueScore = Math.min(40, daysOverdue * 5);
  }
  
  const confidenceWeights = {
    'Solution Watched': 30,
    'Hint Needed': 20,
    'Independent': 5
  };
  const confidenceScore = confidenceWeights[problem.confidence] || 10;
  
  let topicWeaknessScore = 0;
  if (problem.topics && problem.topics.length > 0) {
    const topicScores = problem.topics.map(topic => {
      const performance = topicPerformance[topic] || 50; 
      return 100 - performance; 
    });
    const avgTopicWeakness = topicScores.reduce((a, b) => a + b, 0) / topicScores.length;
    topicWeaknessScore = Math.min(15, avgTopicWeakness * 0.15);
  }
  
  const difficultyWeights = { 'Hard': 15, 'Medium': 10, 'Easy': 5 };
  const difficultyScore = difficultyWeights[problem.difficulty] || 5;
  
  return Math.min(100, Math.round(overdueScore + confidenceScore + topicWeaknessScore + difficultyScore));
};

const getPriorityLabel = (score) => {
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
};

const generateRecommendations = (topicStats, dueRevisions) => {
  const recommendations = [];
  
  const weakTopics = topicStats
    .filter(t => t.performance < 50 && t.solvedCount >= 1)
    .sort((a, b) => a.performance - b.performance)
    .slice(0, 3);
  
  weakTopics.forEach(topic => {
    recommendations.push({
      type: 'TOPIC',
      topic: topic.name,
      priority: 'HIGH',
      reason: `Your independent solve rate in ${topic.name} is only ${topic.performance}%. Focus on ${topic.name} problems without hints.`,
      action: 'PRACTICE',
      suggestedCount: Math.min(5, Math.ceil((50 - topic.performance) / 10))
    });
  });
  
  const urgentRevisions = dueRevisions
    .filter(p => {
      const daysOverdue = Math.floor((new Date() - p.nextRevisionDate) / (1000 * 60 * 60 * 24));
      return daysOverdue >= 3;
    })
    .slice(0, 3);
  
  urgentRevisions.forEach(problem => {
    const daysOverdue = Math.floor((new Date() - problem.nextRevisionDate) / (1000 * 60 * 60 * 24));
    recommendations.push({
      type: 'REVISION',
      problem: problem,
      priority: 'HIGH',
      reason: `This ${problem.difficulty} ${problem.title} problem is ${daysOverdue} days overdue for revision.`,
      action: 'REVISE'
    });
  });
  
  const progressionTopics = topicStats
    .filter(t => t.performance > 60 && t.avgDifficulty === 'Easy')
    .slice(0, 2);
  
  progressionTopics.forEach(topic => {
    recommendations.push({
      type: 'PROGRESSION',
      topic: topic.name,
      priority: 'MEDIUM',
      reason: `You've mastered Easy ${topic.name} problems. Try Medium difficulty to level up.`,
      action: 'LEVEL_UP',
      suggestedDifficulty: 'Medium'
    });
  });
  
  const priorityOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return recommendations.slice(0, 5);
};

module.exports = { calculatePriorityScore, getPriorityLabel, generateRecommendations };
