import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';
import logo from "./Logo/EcoSnap_LOGO_4.png";
import { loginUser } from "./api.js";

// ─── Role Helper ──────────────────────────────────────────────────
const isAdmin = (user) => user?.email?.endsWith('@ecosnapadmin.com');

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const userData = await loginUser(email, password);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // Redirect based on email domain
      navigate(isAdmin(userData) ? "/admin" : "/dashboard");
    } catch (err) {
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