import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();

    // Log the data before making the API call
    console.log("Data sent to backend:", { email, password });

    try {
      const response = await fetch(
        "https://pacementcellbackend.onrender.com/api/v1/employees/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        toast.success("Login successful!");
        navigate("/home"); // Redirect to home page after successful login
      } else {
        if (data && data.error) {
          toast.error("Login failed: " + data.error);
        } else {
          toast.error("Login failed");
        }
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <label className="form-label">
            Email:
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </label>

          <label className="form-label">
            Password:
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </label>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
