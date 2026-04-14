import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './register.css';

export default function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
        navigate("/dashboard");
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
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              autoComplete="name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
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

        <p className="already-line">
          Already have an Account? <Link to="/login">Log in</Link>
        </p>
      </div>

      <div className="btn-wrap">
        <button className="btn-register" onClick={handleRegister}>Register</button>
      </div>

    </div>
  );
}