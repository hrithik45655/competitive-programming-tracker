const mongoose = require('mongoose');

const revisionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    index: true
  },
  revisionNumber: {
    type: Number,
    required: true
  },
  revisionDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  confidenceBefore: {
    type: String,
    enum: ['Independent', 'Hint Needed', 'Solution Watched']
  },
  confidenceAfter: {
    type: String,
    enum: ['Independent', 'Hint Needed', 'Solution Watched'],
    required: true
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
revisionSchema.index({ userId: 1, problemId: 1, revisionDate: -1 });
revisionSchema.index({ userId: 1, revisionDate: -1 });

module.exports = mongoose.model('Revision', revisionSchema);
