import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
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
  const [phase, setPhase] = useState(() =>
    splashAlreadyShown ? 'done' : 'splash'
  );

  const [flying, setFlying] = useState(false);

  const [user, setUser] = useState({
    firstName: "Juan",
    lastName: "Dela Cruz",
    bio: "",
    username: "@juandc",
    email: "juan@example.com",
    photo: null,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register');

  useEffect(() => {
    if (phase === 'done') return;

    const flyTimer = setTimeout(() => {
      setFlying(true);
    }, 1000);

    const timer = setTimeout(() => {
      splashAlreadyShown = true;
      setPhase('done');
      navigate('/login', { replace: true });
    }, 1550);

    return () => {
      clearTimeout(timer);
      clearTimeout(flyTimer);
    };
  }, [navigate, phase]);

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
          {!hideNavbar && <Navbar user={user} />}

          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/history" element={<History />} />
            <Route path="/tipsandfacts" element={<TipsandFacts />} />
            <Route path="/settings" element={<Settings user={user} setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/scanner" element={<Scanner />} />
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