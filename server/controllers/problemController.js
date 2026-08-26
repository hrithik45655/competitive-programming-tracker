const problemService = require('../services/problemService');

const create = async (req, res) => {
  try {
    const problem = await problemService.createProblem(req.userId, req.body);
    res.status(201).json({ success: true, data: problem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const result = await problemService.getProblems(req.userId, req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const problem = await problemService.getProblemById(req.userId, req.params.id);
    res.status(200).json({ success: true, data: problem });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const problem = await problemService.updateProblem(req.userId, req.params.id, req.body);
    res.status(200).json({ success: true, data: problem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await problemService.deleteProblem(req.userId, req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = { create, getAll, getById, update, remove };
