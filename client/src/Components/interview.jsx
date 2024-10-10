import React, { useState, useEffect } from "react";
import "./interview.css";
import Navbar from "./Navbar";
import { FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Interview = () => {
  const [interviews, setInterviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newInterview, setNewInterview] = useState({
    interviewName: "",
    interviewDate: "",
    selectedStudents: [], // Array to store selected students
  });
  const [students, setStudents] = useState([]); // State to store the list of students
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
    fetchStudents();
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

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        "https://pacementcellbackend.onrender.com/api/v1/student"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDeleteInterview = async id => {
    try {
      const response = await fetch(
        `https://pacementcellbackend.onrender.com/api/v1/interview/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete interview");
      }
      setInterviews(prevInterviews =>
        prevInterviews.filter(interview => interview._id !== id)
      );
      toast.success("Interview deleted successfully");
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview");
    }
  };

  const handleEditInterview = () => {
    navigate("/details");
  };

  const handleAddInterview = async e => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://pacementcellbackend.onrender.com/api/v1/interview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newInterview),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add interview");
      }
      const data = await response.json();
      setInterviews([...interviews, data]);
      setNewInterview({
        interviewName: "",
        interviewDate: "",
        selectedStudents: [],
      });
      setShowPopup(false);
      toast.success("Interview added successfully");
    } catch (error) {
      console.error("Error adding interview:", error);
      toast.error("Failed to add interview");
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewInterview({
      ...newInterview,
      [name]: value,
    });
  };

  const handleStudentSelect = e => {
    const selectedStudentIds = Array.from(
      e.target.selectedOptions,
      option => option.value
    );
    console.log("Selected Student IDs:", selectedStudentIds); // Debugging
    setNewInterview({
      ...newInterview,
      selectedStudents: selectedStudentIds,
    });
  };
  const handleDownload = async () => {
    try {
      // Fetch interview data from the backend API
      const response = await fetch(
        "https://pacementcellbackend.onrender.com/api/v1/interview/all/student"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch interview data");
      }
      const data = await response.json();

      // Check if data is an array
      if (!Array.isArray(data)) {
        console.error("Interview data is not in the expected format");
        return;
      }

      // Check if data is empty or not
      if (data.length === 0) {
        console.error("No interview data found");
        return;
      }

      // Define the field names for the CSV
      const csvFieldNames = [
        "Student ID",
        "Student Name",
        "Student College",
        "Student Status",
        "DSA Final Score",
        "WebD Final Score",
        "React Final Score",
        "Interview Name",
        "Interview Date",
      ];

      // Convert interview data to CSV format
      let csvContent = csvFieldNames.join(",") + "\n"; // Add header row
      data.forEach(interview => {
        // Create CSV row for each interview
        const row = [
          interview.studentId,
          interview.studentName,
          interview.studentCollege,
          interview.studentStatus,
          interview.dsaFinalScore,
          interview.webDFinalScore,
          interview.reactFinalScore,
          interview.interviewName,
          interview.interviewDate,
        ].join(",");
        csvContent += row + "\n";
      });

      // Create a blob from the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Create a download link
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // Set link attributes
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "interviews.csv");

        // Append link to the document body and click it
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
      } else {
        // Fallback for browsers that do not support the download attribute
        alert("Your browser does not support downloading files.");
      }
    } catch (error) {
      console.error("Error downloading interviews:", error);
      // Handle error
    }
  };

  return (
    <div>
      <Navbar />
      <div className="interview-details">
        <h1>Interview Details</h1>
        <div className="button-container">
          <button
            className="add-interview-button"
            onClick={() => setShowPopup(true)}
          >
            Add Interview
          </button>
          <button className="download-button" onClick={handleDownload}>
            Download
          </button>
        </div>
        <table id="interviews">
          <thead>
            <tr>
              <th>Interview Name</th>
              <th>Interview Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview, index) => (
              <tr key={index}>
                <td>{interview.interviewName}</td>
                <td>
                  {new Date(interview.interviewDate).toLocaleDateString()}
                </td>
                <td>
                  <FaEye
                    onClick={() => handleEditInterview(interview._id)}
                    title="view interview details"
                  />
                  &nbsp;&nbsp;
                  <FaTrash
                    onClick={() => handleDeleteInterview(interview._id)}
                    title="Delete Interview"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-content">
              <h2>Add Interview</h2>
              <form onSubmit={handleAddInterview}>
                <div>
                  <label htmlFor="interviewName">Interview Name:</label>
                  <input
                    type="text"
                    id="interviewName"
                    name="interviewName"
                    value={newInterview.interviewName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="interviewDate">Interview Date:</label>
                  <input
                    type="date"
                    id="interviewDate"
                    name="interviewDate"
                    value={newInterview.interviewDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="selectedStudents">Select Students:</label>
                  <select
                    multiple
                    id="selectedStudents"
                    name="selectedStudents"
                    value={newInterview.selectedStudents}
                    onChange={handleStudentSelect}
                    required
                  >
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.studentName} - {student.studentId} -{" "}
                        {student.batch.name}
                      </option>
                    ))}
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

export default Interview;
