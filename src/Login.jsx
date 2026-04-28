import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './login.css';
import logo from "./Logo/EcoSnap_LOGO_4.png";

// API function directly here
const loginUser = async (email, password) => {
  const response = await fetch("http://localhost:8080/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Invalid email or password");
  return response.json();
};

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Login button clicked!", email, password);
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const userData = await loginUser(email, password);
      console.log("Login success!", userData);
      setUser(userData);
      navigate("/dashboard");
    } catch (err) {
      console.log("Error details:", err.message);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="left">
        <div className="left-content">
          <div className="logo img">
            <img src={logo} alt="EcoSnap Logo" />
          </div>
          <div className="tagline">
            <h1>Snap it.</h1>
            <h1>Know it.</h1>
            <h1>Green it.</h1>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="card">
          <h2>Welcome!</h2>
          <p>Sign in to your Account</p>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}

          <p className="register">
            Don't Have an Account? <Link to="/register">Register</Link>
          </p>

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </div>
      </div>
    </div>
  );
}