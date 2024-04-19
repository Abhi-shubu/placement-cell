const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
 
    name: {
        type: String,
        
    },
    
 
    email: {
        type: String,
        required: true,
        unique: true
      },
    
    passwordHash: {
        type: String,
        
    },
    empcode: {
        type: String,
        
    },
})
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;