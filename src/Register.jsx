import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './register.css';
import { registerUser } from "./api.js";

// ─── Role Helper ──────────────────────────────────────────────────
const isAdmin = (user) => user?.email?.endsWith('@ecosnapadmin.com');

// Password strength checker
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score <= 2) return { score: 1, label: 'Weak', color: '#ef4444' };
  if (score <= 3) return { score: 2, label: 'Fair', color: '#f59e0b' };
  if (score <= 4) return { score: 3, label: 'Good', color: '#3b82f6' };
  return { score: 4, label: 'Strong', color: '#22c55e' };
};

export default function Register({ setUser }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password && confirm && password === confirm;
  const passwordsMismatch = password && confirm && password !== confirm;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = 
    firstName.trim() && 
    lastName.trim() && 
    validateEmail(email) && 
    password.length >= 8 && 
    passwordsMatch;

  const handleRegister = async () => {
    // Mark all fields as touched for validation display
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirm: true,
    });

    if (!firstName.trim() || !lastName.trim() || !validateEmail(email) || password.length < 8 || !passwordsMatch) {
      setError("Please fix the errors below and try again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("Creating your account...");
      
      const userData = await registerUser({
        firstName,
        lastName,
        username: "@" + firstName.toLowerCase() + lastName.toLowerCase(),
        email,
        password,
        bio: "",
      });
      
      setSuccess("Account created successfully! Redirecting...");
      setUser(userData);
      
      // Redirect to admin dashboard if @ecosnapadmin.com, otherwise user dashboard
      setTimeout(() => {
        navigate(isAdmin(userData) ? "/admin" : "/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isFormValid && !loading) {
      handleRegister();
    }
  };

  return (
    <div className="screen">
      <Link to="/login" className="back-link">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 4L7 10L13 16" stroke="#76c442" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Login
      </Link>

      <div className="heading">Create Account</div>
      <p className="sub">Join EcoSnap and start recycling smarter</p>

      <div className="card">
        {/* Name Fields */}
        <div className="fields-grid">
          <div className="field">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              autoComplete="given-name"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => setTouched({ ...touched, firstName: true })}
              onKeyPress={handleKeyPress}
              className={touched.firstName && !firstName.trim() ? 'input-error' : ''}
            />
            {touched.firstName && !firstName.trim() && (
              <span className="error-text">First name is required</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              autoComplete="family-name"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => setTouched({ ...touched, lastName: true })}
              onKeyPress={handleKeyPress}
              className={touched.lastName && !lastName.trim() ? 'input-error' : ''}
            />
            {touched.lastName && !lastName.trim() && (
              <span className="error-text">Last name is required</span>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="field full-width">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched({ ...touched, email: true })}
            onKeyPress={handleKeyPress}
            className={touched.email && email && !validateEmail(email) ? 'input-error' : ''}
          />
          {touched.email && !email && (
            <span className="error-text">Email is required</span>
          )}
          {touched.email && email && !validateEmail(email) && (
            <span className="error-text">Please enter a valid email address</span>
          )}
          {touched.email && email && validateEmail(email) && (
            <span className="success-text">✓ Email looks good</span>
          )}
        </div>

        {/* Password Field */}
        <div className="field full-width">
          <div className="field-header">
            <label htmlFor="password">Password</label>
            {password && <span className="password-hint">{password.length} characters</span>}
          </div>
          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched({ ...touched, password: true })}
              onKeyPress={handleKeyPress}
              className={touched.password && password && password.length < 8 ? 'input-error' : ''}
            />
            <button 
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
              aria-label="Toggle password visibility"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          
          {password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div 
                  className={`strength-fill strength-${passwordStrength.score}`}
                  style={{ width: `${(passwordStrength.score / 4) * 100}%`, backgroundColor: passwordStrength.color }}
                />
              </div>
              <span className="strength-label" style={{ color: passwordStrength.color }}>
                {passwordStrength.label}
              </span>
            </div>
          )}
          
          {touched.password && password && password.length < 8 && (
            <span className="error-text">Password must be at least 8 characters</span>
          )}
          
          {password && password.length >= 8 && (
            <span className="success-text">✓ Password meets requirements</span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="field full-width">
          <label htmlFor="confirm">Confirm Password</label>
          <div className="input-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              id="confirm"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => setTouched({ ...touched, confirm: true })}
              onKeyPress={handleKeyPress}
              className={passwordsMismatch ? 'input-error' : ''}
            />
            <button 
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex="-1"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirm ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          
          {passwordsMismatch && (
            <span className="error-text">Passwords do not match</span>
          )}
          
          {passwordsMatch && confirm && (
            <span className="success-text">✓ Passwords match</span>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="message error-message">
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="message success-message">
            <span>✓</span> {success}
          </div>
        )}

        {/* Divider */}
        <div className="divider-line" />

        {/* Already have account */}
        <p className="already-line">
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>

      {/* Register Button */}
      <div className="btn-wrap">
        <button 
          className={`btn-register ${!isFormValid ? 'disabled' : ''}`}
          onClick={handleRegister} 
          disabled={loading || !isFormValid}
        >
          {loading ? (
            <>
              <span className="spinner" /> Creating Account...
            </>
          ) : (
            'Register Now'
          )}
        </button>
      </div>

      {!isFormValid && (
        <p className="form-hint">Complete all fields with valid data to register</p>
      )}
    </div>
  );
}