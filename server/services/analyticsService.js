const Problem = require('../models/Problem');
const mongoose = require('mongoose');

const getTopicPerformance = async (userId) => {
  const uid = new mongoose.Types.ObjectId(userId);
  const pipeline = [
    { $match: { userId: uid, status: 'Solved' } },
    { $unwind: '$topics' },
    {
      $group: {
        _id: '$topics',
        totalSolved: { $sum: 1 },
        independentCount: { $sum: { $cond: [{ $eq: ['$confidence', 'Independent'] }, 1, 0] } },
        hintCount: { $sum: { $cond: [{ $eq: ['$confidence', 'Hint Needed'] }, 1, 0] } },
        solutionCount: { $sum: { $cond: [{ $eq: ['$confidence', 'Solution Watched'] }, 1, 0] } },
        avgTimeSpent: { $avg: '$timeSpent' },
        difficulties: { $push: '$difficulty' }
      }
    },
    {
      $project: {
        name: '$_id',
        solvedCount: '$totalSolved',
        independentCount: 1,
        hintCount: 1,
        solutionCount: 1,
        performance: {
          $round: [
            { $multiply: [{ $divide: ['$independentCount', '$totalSolved'] }, 100] },
            1
          ]
        },
        avgTimeSpent: { $round: ['$avgTimeSpent', 1] },
        avgDifficulty: {
          $arrayElemAt: [
            {
              $map: {
                input: [{ $sortByCount: '$difficulties' }],
                as: 'item',
                in: '$$item.k'
              }
            },
            0
          ]
        }
      }
    },
    { $sort: { solvedCount: -1 } }
  ];
  return await Problem.aggregate(pipeline);
};

const getDashboardStats = async (userId) => {
  const uid = new mongoose.Types.ObjectId(userId);
  const pipeline = [
    { $match: { userId: uid } },
    {
      $group: {
        _id: null,
        totalProblems: { $sum: 1 },
        solvedCount: { $sum: { $cond: [{ $eq: ['$status', 'Solved'] }, 1, 0] } },
        attemptedCount: { $sum: { $cond: [{ $eq: ['$status', 'Attempted'] }, 1, 0] } },
        unsolvedCount: { $sum: { $cond: [{ $eq: ['$status', 'Unsolved'] }, 1, 0] } },
        independentCount: { $sum: { $cond: [{ $eq: ['$confidence', 'Independent'] }, 1, 0] } },
        hintCount: { $sum: { $cond: [{ $eq: ['$confidence', 'Hint Needed'] }, 1, 0] } },
        solutionCount: { $sum: { $cond: [{ $eq: ['$confidence', 'Solution Watched'] }, 1, 0] } },
        easyCount: { $sum: { $cond: [{ $eq: ['$difficulty', 'Easy'] }, 1, 0] } },
        mediumCount: { $sum: { $cond: [{ $eq: ['$difficulty', 'Medium'] }, 1, 0] } },
        hardCount: { $sum: { $cond: [{ $eq: ['$difficulty', 'Hard'] }, 1, 0] } }
      }
    }
  ];
  const result = await Problem.aggregate(pipeline);
  return result[0] || { totalProblems: 0, solvedCount: 0, attemptedCount: 0, unsolvedCount: 0, independentCount: 0, hintCount: 0, solutionCount: 0, easyCount: 0, mediumCount: 0, hardCount: 0 };
};

const getSolvingTrends = async (userId, period = 'day') => {
  const uid = new mongoose.Types.ObjectId(userId);
  const dateField = period === 'day' ? '%Y-%m-%d' : period === 'week' ? '%Y-%U' : '%Y-%m';
  const pipeline = [
    { $match: { userId: uid, status: 'Solved' } },
    {
      $group: {
        _id: { $dateToString: { format: dateField, date: '$solvedDate' } },
        count: { $sum: 1 },
        independentCount: { $sum: { $cond: [{ $eq: ['$confidence', 'Independent'] }, 1, 0] } }
      }
    },
    { $sort: { _id: 1 } }
  ];
  return await Problem.aggregate(pipeline);
};

const getPlatformStats = async (userId) => {
  const uid = new mongoose.Types.ObjectId(userId);
  const pipeline = [
    { $match: { userId: uid } },
    {
      $group: {
        _id: '$platform',
        totalProblems: { $sum: 1 },
        solvedCount: { $sum: { $cond: [{ $eq: ['$status', 'Solved'] }, 1, 0] } }
      }
    },
    { $project: { platform: '$_id', totalProblems: 1, solvedCount: 1, _id: 0 } },
    { $sort: { totalProblems: -1 } }
  ];
  return await Problem.aggregate(pipeline);
};

const getStreakData = async (userId) => {
  const uid = new mongoose.Types.ObjectId(userId);
  const pipeline = [
    { $match: { userId: uid, status: 'Solved' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$solvedDate' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ];
  const solvedDates = await Problem.aggregate(pipeline);
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const dateSet = new Set(solvedDates.map(d => d._id));
  
  let checkDate = new Date();
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (dateSet.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (currentStreak === 0 && (dateStr === today || dateStr === yesterday)) {
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  const sortedDates = solvedDates.map(d => new Date(d._id)).sort((a, b) => a - b);
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0 || (sortedDates[i] - sortedDates[i-1]) <= 86400000) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  
  return { currentStreak, longestStreak, records: solvedDates };
};

module.exports = {
  getTopicPerformance,
  getDashboardStats,
  getSolvingTrends,
  getPlatformStats,
  getStreakData
};
