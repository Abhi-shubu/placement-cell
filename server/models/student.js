const mongoose = require('mongoose');

// Define schema for StudentDetails collection
const studentDetailsSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentCollege: {
    type: String,
    required: true,
  },
  status:{
    type: String,
    default: 'not_placed'
  },
  dsaFinalScore: {
    type: Number,
    default: 0,
  },
  webDFinalScore: {
    type: Number,
    default: 0,
  },
  reactFinalScore: {
    type: Number,
    default: 0,
  },
  
batch:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Batch',
},
});

const StudentDetails = mongoose.model('StudentDetails', studentDetailsSchema);

module.exports = { StudentDetails };
