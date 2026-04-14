import { useNavigate, Link } from 'react-router-dom';
import logo from './Logo/EcoSnap_LOGO_4.png'
import './dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">

      {/* ───────────── NAVBAR ───────────── */}
      <nav className="nav-wrapper" role="navigation" aria-label="Main navigation">

        <div className="nav-logo-wrap">
          <img className="nav-logo-img" src={logo} alt="EcoSnap Logo" />
        </div>

        <div className="nav-links">
          <Link to="/dashboard" className="nav-item nav-item--active">
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </Link>

          <Link to="/history" className="nav-item">
            <span className="nav-icon">🕐</span>
            <span>History</span>
          </Link>

          <Link to="/tipsandfacts" className="nav-item">
            <span className="nav-icon">📋</span>
            <span>Tips & Facts</span>
          </Link>

          <Link to="/settings" className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </Link>
        </div>

        <Link to="/profile" className="nav-user">
          <span>John Doe</span>
          <div className="nav-avatar">👤</div>
        </Link>

      </nav>


      {/* ───────────── PAGE CONTENT ───────────── */}
      <div className="page-shell">

        {/* Header */}
        <header className="page-header">
          <div className="welcome-block">
            <h1>
              Welcome, John! 👋
              <span className="welcome-icon">🌱</span>
            </h1>

            <p>
              You're all set! Start scanning items to track your recycling journey.
            </p>
          </div>

          <button
            className="btn-scan"
            onClick={() => navigate('/scanner')}
          >
            <span className="scan-icon">📷</span>
            Scan new Item
          </button>
        </header>


        {/* Banner */}
        <div className="onboarding-banner">
          <span className="banner-icon">💡</span>

          <p>
            <strong>Welcome to EcoSnap!</strong> Hit <em>Scan new Item</em> to scan
            your first recyclable waste and start building your eco-impact.
          </p>
        </div>


        {/* Stats Grid */}
        <section className="stats-grid">

          <article className="stat-card stat-card--primary">
            <span className="stat-card-icon">📷</span>
            <div className="stat-value">0</div>
            <div className="stat-label">Total Scans</div>
            <span className="stat-badge stat-badge--on-dark">
              📷 No scans yet
            </span>
          </article>

          <article className="stat-card">
            <span className="stat-card-icon">♻️</span>
            <div className="stat-value">0</div>
            <div className="stat-label">Items Recycled</div>
            <span className="stat-badge stat-badge--light">
              🌿 Get started!
            </span>
          </article>

          <article className="stat-card">
            <span className="stat-card-icon">📊</span>
            <div className="stat-value">0%</div>
            <div className="stat-label">Recycling Rate</div>
            <span className="stat-badge stat-badge--light">
              Scan to build your rate
            </span>
          </article>

          <article className="stat-card">
            <span className="stat-card-icon">🌍</span>
            <div className="stat-value">0 kg</div>
            <div className="stat-label">Waste Diverted</div>
            <span className="stat-badge stat-badge--light">
              Your impact starts here
            </span>
          </article>

        </section>

      </div> 

      {/* ───────────── FOOTER ───────────── */}
      <footer className="site-footer">

        <div className="footer-inner">

          <div className="footer-brand">
            <div className="nav-logo-wrap">
              <img className="nav-logo-img" src={logo} alt="EcoSnap Logo" />
            </div>
            <p className="footer-tagline">
                Snap it. Know it. Green it.
              </p>
          </div>

          <div className="footer-links">

            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/mission">Our Mission</Link></li>
                <li><Link to="/team">The Team</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="feedback">Send Feedback</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Use</Link></li>
              </ul>
            </div>

          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} EcoSnap. All rights reserved.
          </p>
        </div>

      </footer>

    </div>
  );
}