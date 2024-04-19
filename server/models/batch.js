const mongoose = require('mongoose');

// Define schema for Batches collection
const batchSchema = new mongoose.Schema({
    name:{
        type:String
    },

  startDate: {
    type:Date
  },
  endDate:{
   type:Date
  }
});

exports.Batch = mongoose.model('Batch', batchSchema);