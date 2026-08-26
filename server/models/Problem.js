const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    enum: ['LeetCode', 'CodeChef', 'Codeforces', 'HackerRank', 'GeeksforGeeks', 'Other'],
    required: true,
    index: true
  },
  problemNumber: {
    type: String,
    trim: true
  },
  problemUrl: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
    index: true
  },
  topics: [{
    type: String,
    index: true
  }],
  status: {
    type: String,
    enum: ['Attempted', 'Solved', 'Unsolved'],
    default: 'Solved',
    index: true
  },
  solvedDate: {
    type: Date,
    default: Date.now
  },
  confidence: {
    type: String,
    enum: ['Independent', 'Hint Needed', 'Solution Watched'],
    required: true,
    index: true
  },
  attemptCount: {
    type: Number,
    default: 1,
    min: 1
  },
  revisionCount: {
    type: Number,
    default: 0
  },
  lastRevisedDate: {
    type: Date
  },
  nextRevisionDate: {
    type: Date,
    index: true
  },
  timeSpent: {
    type: Number,
    min: 0  // In minutes
  },
  notes: {
    type: String,
    maxlength: 2000
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

// Composite indexes for common queries
problemSchema.index({ userId: 1, status: 1 });
problemSchema.index({ userId: 1, difficulty: 1 });
problemSchema.index({ userId: 1, nextRevisionDate: 1 });
problemSchema.index({ userId: 1, topics: 1 });
problemSchema.index({ userId: 1, solvedDate: -1 });

// Text search index
problemSchema.index({ title: 'text', topics: 'text' });

module.exports = mongoose.model('Problem', problemSchema);
