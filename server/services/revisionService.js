const Revision = require('../models/Revision');
const Problem = require('../models/Problem');

/**
 * Calculates next revision date based on spaced repetition algorithm
 */
const calculateNextRevisionDate = (revisionCount, confidence) => {
  const baseIntervals = [1, 3, 7, 14, 30];
  
  let baseInterval;
  if (revisionCount <= baseIntervals.length) {
    baseInterval = baseIntervals[revisionCount - 1];
  } else {
    baseInterval = baseIntervals[baseIntervals.length - 1] * Math.pow(2, revisionCount - baseIntervals.length - 1);
  }
  
  const confidenceMultipliers = {
    'Independent': 1.5,
    'Hint Needed': 1.0,
    'Solution Watched': 0.5
  };
  
  const multiplier = confidenceMultipliers[confidence] || 1.0;
  const intervalInDays = Math.max(1, Math.floor(baseInterval * multiplier));
  
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalInDays);
  
  return nextDate;
};

const recordRevision = async (userId, problemId, confidenceAfter, notes) => {
  const problem = await Problem.findOne({ _id: problemId, userId });
  
  if (!problem) throw new Error('Problem not found');

  const newRevisionCount = (problem.revisionCount || 0) + 1;
  const nextRevisionDate = calculateNextRevisionDate(newRevisionCount, confidenceAfter);

  // Create revision record
  const revision = await Revision.create({
    userId,
    problemId,
    revisionNumber: newRevisionCount,
    confidenceBefore: problem.confidence,
    confidenceAfter,
    notes
  });

  // Update problem with new stats
  problem.confidence = confidenceAfter;
  problem.revisionCount = newRevisionCount;
  problem.lastRevisedDate = revision.revisionDate;
  problem.nextRevisionDate = nextRevisionDate;
  
  await problem.save();

  return { revision, problem };
};

const getProblemRevisions = async (userId, problemId) => {
  return await Revision.find({ userId, problemId }).sort({ revisionDate: -1 });
};

const getDueRevisions = async (userId) => {
  const now = new Date();
  // Fetch problems where nextRevisionDate is in the past
  return await Problem.find({
    userId,
    nextRevisionDate: { $lte: now }
  }).sort({ nextRevisionDate: 1 });
};

module.exports = {
  calculateNextRevisionDate,
  recordRevision,
  getProblemRevisions,
  getDueRevisions
};
