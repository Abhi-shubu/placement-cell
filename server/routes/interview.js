const express = require('express');
const router = express.Router();
const  interviewcontroller = require('../controllers/interviewcontroller');

// Route to create a new interview
router.post('/', interviewcontroller.createInterview);

// Route to get all interviews
router.get('/', interviewcontroller.getAllInterviews);

// Route to get an interview by ID
router.get('/all', interviewcontroller.getAllCounts);
router.get('/all/student', interviewcontroller.getAllInterview);
// Route to update an interview
router.put('/:id', interviewcontroller.updateInterview);
router.put('/:interviewId/students/:studentId', interviewcontroller.updateStudentStatus);
// Route to delete an interview
router.delete('/:id', interviewcontroller.deleteInterview);

module.exports = router;
