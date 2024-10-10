import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empCode, setEmpCode] = useState("");
  const navigate = useNavigate();

  const handleSignup = async e => {
    e.preventDefault();

    // Log the data before making the API call
    console.log("Data sent to backend:", { name, email, password, empCode });

    try {
      const response = await fetch(
        "https://pacementcellbackend.onrender.com/api/v1/employees/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            empCode,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful!");
        navigate("/login"); // Redirect to login page
      } else {
        if (data && data.error) {
          toast.error("Registration failed: " + data.error);
        } else {
          toast.error("Registration failed");
        }
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="empcode">Employee Code</label>
            <input
              type="text"
              className="form-control"
              id="empcode"
              value={empCode}
              onChange={e => setEmpCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Sign Up
          </button>
        </form>
        <div className="login-link">
          <p>
            Already registered? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
