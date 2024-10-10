const {StudentDetails} = require('../models/student');

// Controller to add a new student
exports.addStudent = async (req, res) => {
  try {
    const {
      studentId,
        studentName,
        studentCollege,
        status,
        dsaFinalScore,
        webDFinalScore,
        reactFinalScore,
        batch
      
      
    } = req.body;

    const newStudent = new StudentDetails({
      studentId,
        studentName,
        studentCollege,
        status,
        dsaFinalScore,
        webDFinalScore,
        reactFinalScore,
        batch
      
    });

    const savedStudent = await newStudent.save();

    if (!savedStudent) {
      return res.status(400).send('The student could not be created!');
    }

    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Failed to create student:', error);
    res.status(500).json({ success: false, error: 'An error occurred while creating the student' });
  }
};

// Controller to get all students
exports.getAllStudents = async (req, res) => {
  try {
    // Populate the 'batch' field with the batch name
    const students = await StudentDetails.find().populate('batch', 'name');
    res.json(students);
  } catch (error) {
    console.error('Failed to fetch students:', error);
    res.status(500).json({ success: false, error: 'An error occurred while fetching students' });
  }
};


// Controller to get a student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await StudentDetails.findById(id);

    if (!student) {
      return res.status(404).send('Student not found');
    }

    res.json(student);
  } catch (error) {
    console.error('Failed to fetch student:', error);
    res.status(500).json({ success: false, error: 'An error occurred while fetching the student' });
  }
};

// Controller to update a student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      studentId,
      studentName,
      studentCollege,
      status,
      dsaFinalScore,
      webDFinalScore,
      reactFinalScore,
      batch
    } = req.body;

    const updatedStudent = await StudentDetails.findByIdAndUpdate(
      id,
      {
        studentId,
        studentName,
        studentCollege,
        status,
        dsaFinalScore,
        webDFinalScore,
        reactFinalScore,
        batch
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).send('Student not found');
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error('Failed to update student:', error);
    res.status(500).json({ success: false, error: 'An error occurred while updating the student' });
  }
};

// Controller to delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await StudentDetails.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).send('Student not found');
    }

    res.json(deletedStudent);
  } catch (error) {
    console.error('Failed to delete student:', error);
    res.status(500).json({ success: false, error: 'An error occurred while deleting the student' });
  }
};
