import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from "./Components/LoginPage.jsx";
import Signup from "./Components/Signup.jsx";
import HomePage from "./Components/homepage.jsx";
import BatchDetailsPage from "./Components/batch.jsx";
//import Navbar from "./Components/Navbar.jsx";
import StudentDetailsPage from "./Components/student.jsx";
import Interview from "./Components/interview.jsx";
import InterviewDetails from "./Components/interviewDetails.jsx";
function App() {
  
  return (
    <BrowserRouter>
      <div>
        
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/batch" element={<BatchDetailsPage/>} />
          <Route path="/student" element={<StudentDetailsPage/>} />
          <Route path="/interview" element={<Interview/>} />
          <Route path="/details" element={<InterviewDetails/>} />
        </Routes>
      </div>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
