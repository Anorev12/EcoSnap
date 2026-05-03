import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import AdminDashboard from './admin';
import History from './History';
import TipsandFacts from './TipsandFacts';
import Settings from './Settings';
import Profile from './Profile';
import Scanner from './Scanner';
import ContactUs from './ContactUs';
import AboutUs from './AboutUs';
import OurMission from './OurMission';
import TheTeam from './TheTeam';
import Faq from './Faq';
import SendFeedback from './SendFeedback';
import PrivacyPolicy from './PrivacyPolicy';
import TermsofUse from './TermsofUse';
import Navbar from './Navbar';
import ScanningIssues from './ScanningIssues';
import AccountSecurity from './AccountSecurity';
import Resources from './Resources';

import logo from './Logo/EcoSnap_LOGO_4.png';
import './splash.css';

let splashAlreadyShown = false;

// ─── Role Helper ──────────────────────────────────────────────────
const isAdmin = (user) => user?.email?.endsWith('@ecosnapadmin.com');

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [phase, setPhase] = useState(() =>
    splashAlreadyShown ? 'done' : 'splash'
  );

  const [flying, setFlying] = useState(false);

  const hideNavbar =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register') ||
    location.pathname.startsWith('/admin');

  // Splash screen logic
  useEffect(() => {
    if (phase === 'done') return;

    const flyTimer = setTimeout(() => {
      setFlying(true);
    }, 1000);

    const timer = setTimeout(() => {
      splashAlreadyShown = true;
      setPhase('done');

      if (!user) {
        navigate('/login', { replace: true });
      } else if (isAdmin(user)) {
        navigate('/admin', { replace: true });
      }
      // logged-in non-admin stays on their current route
    }, 1550);

    return () => {
      clearTimeout(timer);
      clearTimeout(flyTimer);
    };
  }, [navigate, phase, user]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  return (
    <>
      {phase !== 'done' && (
        <>
          <div className="splash-bg splash-bg--splash" />
          <div className="splash-overlay splash-overlay--splash">
            <div className="splash-overlay__logo">
              <img src={logo} alt="EcoSnap Logo" />
            </div>
            <div
              className={`splash-overlay__tagline ${
                flying ? 'splash-overlay__tagline--hide' : ''
              }`}
            >
              <span style={{ animationDelay: '0.3s' }}>Snap it.</span>
              <span style={{ animationDelay: '0.4s' }}>Know it.</span>
              <span style={{ animationDelay: '0.5s' }}>Green it.</span>
            </div>
          </div>
        </>
      )}

      {phase === 'done' && (
        <>
          {!hideNavbar && user && <Navbar user={user} setUser={setUser} />}

          <Routes>
            {/* Default route — redirect based on role */}
            <Route
              path="/"
              element={
                !user
                  ? <Navigate to="/login" replace />
                  : isAdmin(user)
                    ? <Navigate to="/admin" replace />
                    : <Navigate to="/dashboard" replace />
              }
            />

            {/* Auth routes */}
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />

            {/* Admin-only route */}
            <Route
              path="/admin"
              element={
                !user
                  ? <Navigate to="/login" replace />
                  : isAdmin(user)
                    ? <AdminDashboard user={user} />
                    : <Navigate to="/dashboard" replace />
              }
            />

            {/* Protected user routes */}
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/history" element={user ? <History /> : <Navigate to="/login" replace />} />
            <Route path="/tipsandfacts" element={user ? <TipsandFacts /> : <Navigate to="/login" replace />} />
            <Route path="/settings" element={user ? <Settings user={user} setUser={setUser} /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" replace />} />
            <Route path="/scanner" element={user ? <Scanner /> : <Navigate to="/login" replace />} />

            {/* Public routes */}
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/mission" element={<OurMission />} />
            <Route path="/team" element={<TheTeam />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/feedback" element={<SendFeedback />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsofUse />} />
            <Route path="/scanningissues" element={<ScanningIssues />} />
            <Route path="/accountsecurity" element={<AccountSecurity />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </>
      )}
    </>
  );
}