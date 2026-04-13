import { Link, useNavigate} from "react-router-dom";
import './dashboard.css'
import logo from "./Logo/EcoSnap_LOGO_4.png";

export default function Dashboard() {
    const navigate = useNavigate();
  return (
    <>
      {/* ── NAVBAR ─────────────────────────────────── */}
      <nav className="nav-wrapper" role="navigation" aria-label="Main navigation">

        <div className="nav-logo-wrap">
          <img className="nav-logo-img" src={logo} alt="EcoSnap Logo" />
        </div>

        <div className="nav-links">
  <Link to="/dashboard" className="nav-item nav-item--active" aria-current="page">
    <span className="nav-icon">🏠</span>
    <span>Dashboard</span>
  </Link>
  <Link to="/history" className="nav-item">
    <span className="nav-icon">🕐</span>
    <span>History</span>
  </Link>
  <Link to="/tipsandfacts" className="nav-item">
    <span className="nav-icon">📋</span>
    <span>Tips &amp; Facts</span>
  </Link>
  <Link to="/settings" className="nav-item">
    <span className="nav-icon">⚙️</span>
    <span>Settings</span>
  </Link>
</div>

        <Link to="/profile" className="nav-user" aria-label="User menu: John Doe">
  <span>John Doe</span>
  <div className="nav-avatar" aria-hidden="true">👤</div>
</Link>

      </nav>

      <main className="page-shell">

        <header className="page-header">
          <div className="welcome-block">
            <h1>
              Welcome, John! 👋
              <span className="welcome-icon" aria-hidden="true">🌱</span>
            </h1>
            <p>You're all set! Start scanning items to track your recycling journey.</p>
          </div>
         <button className="btn-scan" type="button" aria-label="Scan a new item" onClick={() => navigate('/scanner')}>
  <span className="scan-icon" aria-hidden="true">📷</span>
  Scan new Item
</button>
        </header>

        <div className="onboarding-banner" role="status" aria-label="Getting started tip">
          <span className="banner-icon" aria-hidden="true">💡</span>
          <p><strong>Welcome to EcoSnap!</strong> Hit <em>Scan new Item</em> to scan your first piece of recyclable waste and start building your eco-impact.</p>
        </div>

        <section className="stats-grid" aria-label="Today's recycling statistics">

          <article className="stat-card stat-card--primary" aria-label="Total Scans">
            <span className="stat-card-icon" aria-hidden="true">📷</span>
            <div className="stat-value">0</div>
            <div className="stat-label">Total Scans</div>
            <span className="stat-badge stat-badge--on-dark" aria-label="No scans yet">
              📷 No scans yet
            </span>
          </article>

          <article className="stat-card" aria-label="Items Recycled">
            <span className="stat-card-icon" aria-hidden="true">♻️</span>
            <div className="stat-value">0</div>
            <div className="stat-label">Items Recycled</div>
            <span className="stat-badge stat-badge--light" aria-label="Start recycling">
              🌿 Get started!
            </span>
          </article>

          <article className="stat-card" aria-label="Recycling Rate">
            <span className="stat-card-icon" aria-hidden="true">📊</span>
            <div className="stat-value">0%</div>
            <div className="stat-label">Recycling Rate</div>
            <span className="stat-badge stat-badge--light" aria-label="Scan items to build your rate">
              Scan to build your rate
            </span>
          </article>

          <article className="stat-card" aria-label="Waste Diverted">
            <span className="stat-card-icon" aria-hidden="true">🌍</span>
            <div className="stat-value">0 kg</div>
            <div className="stat-label">Waste Diverted</div>
            <span className="stat-badge stat-badge--light" aria-label="Nothing diverted yet">
              Your impact starts here
            </span>
          </article>

        </section>

      </main>
    </>
  );
}