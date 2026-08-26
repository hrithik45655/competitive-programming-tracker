const revisionService = require('../services/revisionService');

const getDue = async (req, res) => {
  try {
    const dueProblems = await revisionService.getDueRevisions(req.userId);
    res.status(200).json({ success: true, data: dueProblems });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const record = async (req, res) => {
  try {
    const { problemId, confidenceAfter, notes } = req.body;
    const result = await revisionService.recordRevision(req.userId, problemId, confidenceAfter, notes);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getByProblem = async (req, res) => {
  try {
    const revisions = await revisionService.getProblemRevisions(req.userId, req.params.problemId);
    res.status(200).json({ success: true, data: revisions });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getDue, record, getByProblem };
