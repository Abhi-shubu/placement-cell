import React, { useState, useEffect } from "react";
import "./interview.css";
import Navbar from "./Navbar";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const InterviewDetails = () => {
  const [interviews, setInterviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [status, setStatus] = useState(""); // State to hold the status
  const [selectedStudentId, setSelectedStudentId] = useState(""); // State to hold the selected student ID

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch(
        "https://pacementcellbackend.onrender.com/api/v1/interview"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch interviews");
      }
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  const handleEditInterview = (interviewId, studentId) => {
    const selected = interviews.find(
      interview => interview._id === interviewId
    );
    setSelectedInterview(selected);
    setSelectedStudentId(studentId);
    setShowPopup(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (!selectedInterview || !selectedStudentId) {
        throw new Error("No interview or selected student");
      }

      const response = await fetch(
        `https://pacementcellbackend.onrender.com/api/v1/interview/${selectedInterview._id}/students/${selectedStudentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentStatus: status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedInterview = await response.json();
      const updatedInterviews = interviews.map(interview => {
        if (interview._id === updatedInterview._id) {
          return updatedInterview;
        }
        return interview;
      });
      setInterviews(updatedInterviews);

      toast.success("Status updated successfully");
      setShowPopup(false);

      // Reload the page after successful update
      window.location.reload();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="interview-details">
        {interviews.map(interview => (
          <div key={interview._id}>
            <h2>{interview.interviewName}</h2>
            <h2>
              Interview Date:{" "}
              {new Date(interview.interviewDate).toLocaleDateString()}
            </h2>
            <table id="interviews" key={interview._id}>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Student Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {interview.students.map(student => (
                  <tr key={student._id}>
                    <td>{student.studentName.studentName}</td>
                    <td>{student.studentName.studentId}</td>
                    <td>{student.studentStatus}</td>
                    <td>
                      <FaEdit
                        onClick={() =>
                          handleEditInterview(interview._id, student._id)
                        }
                        title="Edit Interview status"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-content">
              <h2>Edit Status</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Didn’t Attempt">Didn’t Attempt</option>
                  </select>
                </div>
                <button type="submit">Submit</button>
                <button type="cancel" onClick={() => setShowPopup(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewDetails;
