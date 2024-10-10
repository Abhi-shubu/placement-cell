const mongoose = require('mongoose');
const { StudentDetails } = require('./student');

// Define schema for Interview collection
const interviewSchema = new mongoose.Schema({
  interviewName: {
    type: String,
    required: true,
  },
  interviewDate: {
    type: Date,
  },
  students: [{
    studentName: {
      type: mongoose.Schema.Types.ObjectId,
  ref: 'StudentDetails',
      
    },
    studentStatus: {
      type: String,
      
      default: 'PASS'
    }
  }]
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = { Interview };
