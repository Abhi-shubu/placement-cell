const express = require('express');
const router = express.Router();
const employeecontroller = require('../controllers/employeecontrollers');

// Route to register a new employee
router.post('/register', employeecontroller.registernormalemployee);

// Route to log in an employee
router.post('/login', employeecontroller.loginUser);

module.exports = router;
