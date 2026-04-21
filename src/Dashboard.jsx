import { useNavigate, Link } from 'react-router-dom';
import './dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">

      
      <div className="page-shell">

        
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
          <div className="footer-links">

            <div className="footer-col">
              <ul>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <ul>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              {/* <h4>Legal</h4> */}
              <ul>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
              </ul>
                
            </div>

            <div className="footer-col">
              <ul>
                <li>
                  <Link to="/terms">Terms of Use</Link>
                </li>
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