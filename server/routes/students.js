const express = require('express');
const router = express.Router();
const studentdetailscontroller = require('../controllers/studentdetailscontroller');

// Route to add a new student
router.post('/', studentdetailscontroller.addStudent);

// Route to get all students
router.get('/', studentdetailscontroller.getAllStudents);

// Route to get a student by ID
router.get('/:id', studentdetailscontroller.getStudentById);

// Route to update a student
router.put('/:id', studentdetailscontroller.updateStudent);

// Route to delete a student
router.delete('/:id', studentdetailscontroller.deleteStudent);

module.exports = router;
