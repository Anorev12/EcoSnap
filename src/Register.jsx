import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './register.css';
import { registerUser } from "./api.js";

// ─── Role Helper ──────────────────────────────────────────────────
const isAdmin = (user) => user?.email?.endsWith('@ecosnapadmin.com');

export default function Register({ setUser }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const userData = await registerUser({
        firstName,
        lastName,
        username: "@" + firstName.toLowerCase() + lastName.toLowerCase(),
        email,
        password,
        bio: "",
      });
      setUser(userData);
      // Redirect to admin dashboard if @ecosnapadmin.com, otherwise user dashboard
      navigate(isAdmin(userData) ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">

      <Link to="/login" className="back-link">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 4L7 10L13 16" stroke="#4dd97a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Login
      </Link>

      <div className="heading">Create Account</div>
      <p className="sub">Join EcoSnap and start recycling smarter</p>

      <div className="card">
        <div className="fields-grid">
          <div className="field">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              type="password"
              id="confirm"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>

        {error && <p style={{ color: "red", fontSize: "13px", marginTop: "8px" }}>{error}</p>}

        <p className="already-line">
          Already have an Account? <Link to="/login">Log in</Link>
        </p>
      </div>

      <div className="btn-wrap">
        <button className="btn-register" onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>

    </div>
  );
}