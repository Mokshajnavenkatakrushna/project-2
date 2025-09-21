const mongoose = require('mongoose');

const soilAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nitrogen: {
    type: Number,
    required: true,
    min: 0
  },
  phosphorus: {
    type: Number,
    required: true,
    min: 0
  },
  potassium: {
    type: Number,
    required: true,
    min: 0
  },
  pH: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  moisture: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    required: true
  },
  recommendations: [{
    type: String
  }],
  cropSuggestions: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SoilAnalysis', soilAnalysisSchema);
