const Problem = require('../models/Problem');
const { calculateNextRevisionDate } = require('./revisionService');

const createProblem = async (userId, problemData) => {
  // Automatically calculate the first revision date based on initial confidence
  const nextRevisionDate = calculateNextRevisionDate(1, problemData.confidence);
  
  const problem = await Problem.create({
    ...problemData,
    userId,
    nextRevisionDate,
    revisionCount: 0
  });
  
  return problem;
};

const getProblems = async (userId, queryParams) => {
  const { 
    page = 1, 
    limit = 20, 
    platform, 
    difficulty, 
    status, 
    confidence, 
    topic, 
    search,
    sortBy = 'solvedDate',
    sortOrder = 'desc'
  } = queryParams;

  const query = { userId };

  if (platform) query.platform = platform;
  if (difficulty) query.difficulty = difficulty;
  if (status) query.status = status;
  if (confidence) query.confidence = confidence;
  if (topic) query.topics = topic;
  if (search) {
    query.$text = { $search: search };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const problems = await Problem.find(query)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Problem.countDocuments(query);

  return {
    problems,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit))
  };
};

const getProblemById = async (userId, problemId) => {
  const problem = await Problem.findOne({ _id: problemId, userId });
  if (!problem) throw new Error('Problem not found');
  return problem;
};

const updateProblem = async (userId, problemId, updateData) => {
  const problem = await Problem.findOneAndUpdate(
    { _id: problemId, userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!problem) throw new Error('Problem not found');
  return problem;
};

const deleteProblem = async (userId, problemId) => {
  const problem = await Problem.findOneAndDelete({ _id: problemId, userId });
  if (!problem) throw new Error('Problem not found');
  return problem;
};

module.exports = {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem
};
