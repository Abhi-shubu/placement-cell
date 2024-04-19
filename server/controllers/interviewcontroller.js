const { Interview } = require('../models/interview');

const {StudentDetails }= require('../models/student');
const { Batch } = require('../models/batch');
// Controller function for creating interviews with multiple students
exports.createInterview = async (req, res) => {
  try {
    // Extract data from request body
    const { interviewName, interviewDate, selectedStudents } = req.body;

    // Validate input data
    if (!interviewName || !interviewDate || !selectedStudents || !Array.isArray(selectedStudents)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Check if selected students exist
    const existingStudents = await StudentDetails.find({ _id: { $in: selectedStudents } });
    if (existingStudents.length !== selectedStudents.length) {
      return res.status(404).json({ message: 'One or more selected students do not exist' });
    }

    // Create interview document
    const interview = new Interview({
      interviewName,
      interviewDate,
      students: selectedStudents.map(studentId => ({ studentName:studentId, studentStatus: 'Pending' }))
    });

    // Save interview document
    await interview.save();

    // Return success response
    return res.status(201).json(interview);
  } catch (error) {
    console.error('Error creating interview:', error);
    return res.status(500).json({ message: 'Failed to create interview' });
  }
};
exports.getAllCounts = async (req, res) => {
  try {
    // Execute all asynchronous operations concurrently using Promise.all
    const [interviewCount, studentCount, batchCount] = await Promise.all([
      Interview.countDocuments(),
      StudentDetails.countDocuments(),
      Batch.countDocuments()
    ]);

    // Respond with the counts
    res.status(200).json({ interviewCount, studentCount, batchCount });
  } catch (error) {
    console.error("Error fetching counts:", error);
    // Respond with an error message
    res.status(500).json({ error: "Failed to fetch counts" });
  }
};




exports.updateStudentStatus = async (req, res) => {
  const { interviewId, studentId } = req.params; 
  const { studentStatus } = req.body; 

  try {
    // Find the interview by ID
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Find the student by ID within the interview
    const student = interview.students.find(student => student._id == studentId); // Note: Use == instead of === to compare ObjectId

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update the student status
    student.studentStatus = studentStatus;

    // Save the updated interview
    await interview.save();

    // Respond with success message
    res.status(200).json({ message: 'Student status updated successfully', interview });
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({ error: 'Failed to update student status' });
  }
};




// Controller to get all interviews
exports.getAllInterviews = async (req, res) => {
  
  try {
    const interviews = await Interview.find().populate('students.studentName', 'studentName studentId');
    res.json(interviews);
  } catch (error) {
    console.error('Failed to fetch interviews:', error);
    res.status(500).json({ success: false, error: 'An error occurred while fetching interviews' });
  }
}



// Controller to get an interview by ID
exports.getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).send('Interview not found');
    }

    res.json(interview);
  } catch (error) {
    console.error('Failed to fetch interview:', error);
    res.status(500).json({ success: false, error: 'An error occurred while fetching the interview' });
  }
};

// Controller to update an interview
exports.updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { interviewName, interviewDate } = req.body;

    const updatedInterview = await Interview.findByIdAndUpdate(
      id,
      { interviewName, interviewDate },
      { new: true }
    );

    if (!updatedInterview) {
      return res.status(404).send('Interview not found');
    }

    res.json(updatedInterview);
  } catch (error) {
    console.error('Failed to update interview:', error);
    res.status(500).json({ success: false, error: 'An error occurred while updating the interview' });
  }
};

// Controller to delete an interview
exports.deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInterview = await Interview.findByIdAndDelete(id);

    if (!deletedInterview) {
      return res.status(404).send('Interview not found');
    }

    res.json(deletedInterview);
  } catch (error) {
    console.error('Failed to delete interview:', error);
    res.status(500).json({ success: false, error: 'An error occurred while deleting the interview' });
  }
};
exports.getAllInterview = async (req, res) => {
  try {
    const interviews = await Interview.find().populate('students.studentName', 'studentId studentName studentCollege dsaFinalScore webDFinalScore  reactFinalScore batch');
    
    const interviewsArray = [];

    // Iterate through each interview
    interviews.forEach((interview) => {
      // Iterate through each student in the interview
      interview.students.forEach((student) => {
        const { studentName, studentId } = student.studentName;
        
        // Create an object for each interview-student pair
        const interviewData = {
          interviewName: interview.interviewName,
          interviewDate: new Date(interview.interviewDate).toLocaleDateString(),
          studentName: studentName,
          studentId: studentId,
          studentCollege: student.studentName.studentCollege,
          studentStatus: student.studentStatus,
          dsaFinalScore: student.studentName.dsaFinalScore,
          webDFinalScore: student.studentName.webDFinalScore,
          reactFinalScore: student.studentName.reactFinalScore
        };

        // Push the interview data to the array
        interviewsArray.push(interviewData);
      });
    });

    res.json(interviewsArray);
  } catch (error) {
    console.error('Failed to fetch interviews:', error);
    res.status(500).json({ success: false, error: 'An error occurred while fetching interviews' });
  }
}
