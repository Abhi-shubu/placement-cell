import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./student.css";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentDetailsPage = () => {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentCollege, setStudentCollege] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [dsaFinalScore, setDsaFinalScore] = useState("");
  const [webDFinalScore, setWebDFinalScore] = useState("");
  const [reactFinalScore, setReactFinalScore] = useState("");
  const [status, setStatus] = useState(""); // Added status state

  useEffect(() => {
    fetchBatches();
    fetchStudents();
  }, []);

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

  const fetchBatches = async () => {
    try {
      const response = await fetch(
        "https://pacementcellbackend.onrender.com/api/v1/batches"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch batches");
      }
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const handleNameChange = e => {
    setStudentName(e.target.value);
  };

  const handleIdChange = e => {
    setStudentId(e.target.value);
  };

  const handleCollegeChange = e => {
    setStudentCollege(e.target.value);
  };

  const handleBatchChange = e => {
    setSelectedBatch(e.target.value);
  };

  const handleDsaScoreChange = e => {
    setDsaFinalScore(e.target.value);
  };

  const handleWebDScoreChange = e => {
    setWebDFinalScore(e.target.value);
  };

  const handleReactScoreChange = e => {
    setReactFinalScore(e.target.value);
  };

  const handleStatusChange = e => {
    setStatus(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!selectedBatch) {
      toast.error("Batch is required");
      return;
    }

    const formData = {
      studentName,
      studentId,
      studentCollege,
      dsaFinalScore,
      webDFinalScore,
      reactFinalScore,
      batch: selectedBatch,
      status, // Include status in the formData
    };

    if (editingStudent) {
      fetch(
        `https://pacementcellbackend.onrender.com/api/v1/student/${editingStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to edit student");
          }
          return response.json();
        })
        .then(data => {
          console.log("Student edited successfully:", data);
          setEditingStudent(null);
          setShowPopup(false);
          fetchStudents();
          toast.success("Student edited successfully");
        })
        .catch(error => {
          console.error("Error editing student:", error);
          toast.error("Failed to edit student");
        });
    } else {
      fetch("https://pacementcellbackend.onrender.com/api/v1/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to add student");
          }
          return response.json();
        })
        .then(data => {
          console.log("Student added successfully:", data);
          setShowPopup(false);
          fetchStudents();
          toast.success("Student added successfully");
        })
        .catch(error => {
          console.error("Error adding student:", error);
          toast.error("Failed to add student");
        });
    }
  };

  const handleDeleteStudent = async id => {
    try {
      const response = await fetch(
        `https://pacementcellbackend.onrender.com/api/v1/student/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
      setStudents(prevStudents =>
        prevStudents.filter(student => student._id !== id)
      );
      toast.success("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    }
  };

  const handleEditClick = student => {
    setEditingStudent(student);
    setStudentName(student.studentName);
    setStudentId(student.studentId);
    setStudentCollege(student.studentCollege);
    setSelectedBatch(student.batch ? student.batch._id : "");
    setDsaFinalScore(student.dsaFinalScore || "");
    setWebDFinalScore(student.webDFinalScore || "");
    setReactFinalScore(student.reactFinalScore || "");
    setStatus(student.status || ""); // Set status if it exists
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
    setStudentName("");
    setStudentId("");
    setStudentCollege("");
    setSelectedBatch("");
    setDsaFinalScore("");
    setWebDFinalScore("");
    setReactFinalScore("");
    setStatus(""); // Reset status
    setEditingStudent(null);
  };

  return (
    <div>
      <Navbar />
      <div className="student-details">
        <h1>Student Details</h1>
        <div className="button-container">
          <button
            className="add-student-button"
            onClick={() => setShowPopup(true)}
          >
            Add Student
          </button>
        </div>
        <table id="students">
          <thead>
            <tr>
              <th>slno.</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Student College</th>
              <th>Batch</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.studentName}</td>
                <td>{student.studentId}</td>
                <td>{student.studentCollege}</td>
                <td>{student.batch ? student.batch.name : "-"}</td>
                <td>
                  {editingStudent?._id === student._id ? (
                    <select value={status} onChange={handleStatusChange}>
                      <option value="Placed">Placed</option>
                      <option value="Not Placed">Not Placed</option>
                    </select>
                  ) : (
                    student.status
                  )}
                </td>
                <td>
                  <FaEdit onClick={() => handleEditClick(student)} />
                  <FaTrash onClick={() => handleDeleteStudent(student._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="popup-content">
                <h2>
                  {editingStudent
                    ? "View course score and Edit Student"
                    : "Add Student"}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-inline">
                    <div className="form-group">
                      <label htmlFor="studentName">Student Name:</label>
                      <input
                        type="text"
                        id="studentName"
                        value={studentName}
                        onChange={handleNameChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="studentId">Student ID:</label>
                      <input
                        type="text"
                        id="studentId"
                        value={studentId}
                        onChange={handleIdChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="studentCollege">Student College:</label>
                      <input
                        type="text"
                        id="studentCollege"
                        value={studentCollege}
                        onChange={handleCollegeChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="dsaFinalScore">DSA Final Score:</label>
                      <input
                        type="text"
                        id="dsaFinalScore"
                        value={dsaFinalScore}
                        onChange={handleDsaScoreChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="webDFinalScore">WebD Final Score:</label>
                      <input
                        type="text"
                        id="webDFinalScore"
                        value={webDFinalScore}
                        onChange={handleWebDScoreChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="reactFinalScore">
                        React Final Score:
                      </label>
                      <input
                        type="text"
                        id="reactFinalScore"
                        value={reactFinalScore}
                        onChange={handleReactScoreChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="batch">Batch:</label>
                      <select
                        id="batch"
                        className="batch-select"
                        value={selectedBatch}
                        onChange={handleBatchChange}
                        required
                      >
                        <option value="">Select Batch</option>
                        {batches.map((batch, index) => (
                          <option key={index} value={batch._id}>
                            {batch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="status">Status:</label>
                      <select
                        id="status"
                        value={status}
                        onChange={handleStatusChange}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Not Placed">Not Placed</option>
                      </select>
                    </div>
                  </div>
                  <div className="button-container">
                    <button type="submit">
                      {editingStudent ? "Save" : "Submit"}
                    </button>
                    <button type="cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetailsPage;
