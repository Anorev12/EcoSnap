import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import History from './History';
import TipsandFacts from './TipsandFacts';
import Settings from './Settings';
import Profile from './Profile';
import Scanner from './Scanner';

import logo from './Logo/EcoSnap_LOGO_4.png';
import './splash.css';

// ✅ Module-level flag — survives re-renders, resets only on full page refresh
let splashAlreadyShown = false;

export default function App() {
  useEffect(() => {
    window.history.replaceState(null, '', '/');
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  // ✅ If splash was already shown this session, start as 'done' immediately
  const [phase, setPhase] = useState(() => splashAlreadyShown ? 'done' : 'splash');
  const navigate = useNavigate();

  useEffect(() => {
    if (phase === 'done') return; // ✅ Already done, skip the timer entirely

    const timer = setTimeout(() => {
      splashAlreadyShown = true; // ✅ Mark as shown before navigating
      setPhase('done');
      navigate('/login', { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, phase]);

  return (
    <>
      {/* ── Splash screen ── */}
      {phase !== 'done' && (
        <>
          <div className={`splash-bg splash-bg--splash`} />
          <div className={`splash-overlay splash-overlay--splash`}>
            <div className="splash-overlay__logo">
              <img src={logo} alt="EcoSnap Logo" />
            </div>
            <div className="splash-overlay__tagline">
              <span style={{ animationDelay: '0.2s' }}>Snap it.</span>
              <span style={{ animationDelay: '0.5s' }}>Know it.</span>
              <span style={{ animationDelay: '0.8s' }}>Green it.</span>
            </div>
          </div>
        </>
      )}

      {/* ── App routes ── */}
      {phase === 'done' && (
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/tipsandfacts" element={<TipsandFacts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/scanner" element={<Scanner />} />
        </Routes>
      )}
    </>
  );
}