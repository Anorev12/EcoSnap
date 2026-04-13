import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './login.css';
import logo from "./Logo/EcoSnap_LOGO_4.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
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

          <p className="register">
            Don't Have an Account? <Link to="/register">Register</Link>
          </p>

          <button className="login-btn" onClick={handleLogin}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}