import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './dashboard.css';


export default function Dashboard({ user }) {

// ─── Card detail content ──────────────────────────────────────────
const CARD_DETAILS = {
  scans: {
    icon: '📷',
    label: 'Total Scans',
    value: '0',
    badge: '📷 No scans yet',
    badgeType: 'on-dark',
    primary: true,
    details: [
      { label: 'This Week',  value: '0' },
      { label: 'This Month', value: '0' },
      { label: 'All Time',   value: '0' },
    ],
    tip: 'Start scanning items to track your recycling journey. Every scan counts!',
  },
  recycled: {
    icon: '♻️',
    label: 'Items Recycled',
    value: '0',
    badge: '🌿 Get started!',
    badgeType: 'light',
    primary: false,
    details: [
      { label: 'Plastic',  value: '0' },
      { label: 'Paper',    value: '0' },
      { label: 'Glass',    value: '0' },
      { label: 'Metal',    value: '0' },
    ],
    tip: 'Recycle more items to see a breakdown by material type.',
  },
  rate: {
    icon: '📊',
    label: 'Recycling Rate',
    value: '0%',
    badge: 'Scan to build your rate',
    badgeType: 'light',
    primary: false,
    details: [
      { label: 'Recyclable',     value: '0%' },
      { label: 'Non-Recyclable', value: '0%' },
      { label: 'Hazardous',      value: '0%' },
    ],
    tip: 'Your recycling rate improves as you scan and recycle more items.',
  },
  waste: {
    icon: '🌍',
    label: 'Waste Diverted',
    value: '0 kg',
    badge: 'Your impact starts here',
    badgeType: 'light',
    primary: false,
    details: [
      { label: 'From Landfill',  value: '0 kg' },
      { label: 'CO₂ Saved',      value: '0 kg' },
      { label: 'Water Saved',    value: '0 L'  },
    ],
    tip: 'Every kilogram diverted from landfill reduces CO₂ emissions.',
  },
};

// ─── Single stat card ─────────────────────────────────────────────
function StatCard({ id, data, isExpanded, isShrunk, onClick }) {
  return (
    <article
      className={[
        'stat-card',
        data.primary ? 'stat-card--primary' : '',
        isExpanded  ? 'stat-card--expanded' : '',
        isShrunk    ? 'stat-card--shrunk'   : '',
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* ── Default view ── */}
      <div className="stat-card-default">
        <span className="stat-card-icon">{data.icon}</span>
        <div className="stat-value">{data.value}</div>
        <div className="stat-label">{data.label}</div>
        <span className={`stat-badge stat-badge--${data.badgeType}`}>
          {data.badge}
        </span>
      </div>

      {/* ── Expanded view ── */}
      {isExpanded && (
        <div className="stat-card-expanded-content">
          <div className="expanded-header">
            <span className="expanded-icon">{data.icon}</span>
            <div>
              <div className="expanded-value">{data.value}</div>
              <div className="expanded-label">{data.label}</div>
            </div>
            <span className="close-hint">Click to collapse ↗</span>
          </div>

          <div className="expanded-details">
            {data.details.map((d) => (
              <div className="detail-pill" key={d.label}>
                <span className="detail-label">{d.label}</span>
                <span className="detail-value">{d.value}</span>
              </div>
            ))}
          </div>

          <div className="expanded-tip">
            <span className="tip-icon">💡</span>
            <p>{data.tip}</p>
          </div>
        </div>
      )}
    </article>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────//
export default function Dashboard() {

  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="dashboard-container">
      <div className="page-shell">

        {/* Header */}
        <header className="page-header">
          <div className="welcome-block">
            <h1>
              Welcome, {user.firstName}! 👋  {/* ✅ dynamic first name */}
              <span className="welcome-icon">🌱</span>
            </h1>
            <p>You're all set! Start scanning items to track your recycling journey.</p>
          </div>
          <button className="btn-scan" onClick={() => navigate('/scanner')}>
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
        <section className={`stats-grid${expanded ? ' has-expanded' : ''}`}>
          {Object.entries(CARD_DETAILS).map(([id, data]) => (
            <StatCard
              key={id}
              id={id}
              data={data}
              isExpanded={expanded === id}
              isShrunk={expanded !== null && expanded !== id}
              onClick={() => toggle(id)}
            />
          ))}
        </section>

      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-links">

            <div className="footer-col">
              <ul><li><Link to="/about">About Us</Link></li></ul>
            </div>
            <div className="footer-col">
              <ul><li><Link to="/contact">Contact Us</Link></li></ul>
            </div>
            <div className="footer-col">
              <ul><li><Link to="/privacy">Privacy Policy</Link></li></ul>
            </div>
            <div className="footer-col">
              <ul><li><Link to="/terms">Terms of Use</Link></li></ul>
            </div>

            <div className="footer-col"><ul><li><Link to="/about">About Us</Link></li></ul></div>
            <div className="footer-col"><ul><li><Link to="/contact">Contact Us</Link></li></ul></div>
            <div className="footer-col"><ul><li><Link to="/privacy">Privacy Policy</Link></li></ul></div>
            <div className="footer-col"><ul><li><Link to="/terms">Terms of Use</Link></li></ul></div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} EcoSnap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );

}
}