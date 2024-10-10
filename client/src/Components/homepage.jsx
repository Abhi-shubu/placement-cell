import React, { useState, useEffect } from "react";
import "./homepage.css"; // Import the CSS file
import Navbar from "./Navbar"; // Import the Navbar component

const HomePage = () => {
  // State variables to store counts
  const [interviewCount, setInterviewCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [batchCount, setBatchCount] = useState(0);

  // Fetch counts from the backend API
  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const response = await fetch(
        "https://pacementcellbackend.onrender.com/api/v1/interview/all"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch counts");
      }
      const data = await response.json();
      // Update state with the fetched counts
      setInterviewCount(data.interviewCount);
      setStudentCount(data.studentCount);
      setBatchCount(data.batchCount);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  return (
    <div>
      <Navbar /> {/* Include the Navbar component here */}
      <div className="homepage-content">
        <h4 className="welcome-text">Welcome to CodingNinja</h4>
        <div className="options">
          <div className="box batch-box">
            <h1>Batches</h1>
            <p> {batchCount}</p> {/* Render batch count */}
          </div>
          <div className="box interview-box">
            <h1>Students</h1>
            <p>{studentCount}</p> {/* Render student count */}
          </div>
          <div className="box student-box">
            <h1>Interviews</h1>
            <p> {interviewCount}</p>
            {/* Render interview count */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
