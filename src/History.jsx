import { useNavigate } from 'react-router-dom';
import './history.css';
 
export default function History() {
  const navigate = useNavigate();
 
  return (
    <div className="history-page">
      {/* ── Header ── */}
      <div className="history-header">
        <div>
          <h1 className="history-header__title">Scan History 🕐</h1>
          <p className="history-header__sub">
            All your scanned items in one place.
          </p>
        </div>
        <button
          className="history-header__scan-btn"
          onClick={() => navigate('/scanner')}
        >
          📷 Scan new Item
        </button>
      </div>
 
      {/* ── Summary Cards ── */}
      <div className="history-summary">
        <div className="history-summary__card history-summary__card--dark">
          <span className="history-summary__icon">📷</span>
          <div className="history-summary__value">0</div>
          <div className="history-summary__label">Total Scans</div>
          <span className="history-summary__chip">📋 No scans yet</span>
        </div>
        <div className="history-summary__card">
          <span className="history-summary__icon">♻️</span>
          <div className="history-summary__value">0</div>
          <div className="history-summary__label">Items Recycled</div>
          <span className="history-summary__chip history-summary__chip--light">✅ Get started!</span>
        </div>
        <div className="history-summary__card">
          <span className="history-summary__icon">📊</span>
          <div className="history-summary__value">0%</div>
          <div className="history-summary__label">Recycling Rate</div>
          <span className="history-summary__chip history-summary__chip--light">📈 Scan to build your rate</span>
        </div>
        <div className="history-summary__card">
          <span className="history-summary__icon">🌍</span>
          <div className="history-summary__value">0 kg</div>
          <div className="history-summary__label">Waste Diverted</div>
          <span className="history-summary__chip history-summary__chip--light">🌱 Your impact starts here</span>
        </div>
      </div>
 
      {/* ── Empty State ── */}
      <div className="history-empty">
        <div className="history-empty__icon">🗂️</div>
        <h3 className="history-empty__title">No scans yet</h3>
        <p className="history-empty__desc">
          Start scanning recyclable items to track your eco-impact here.
        </p>
        <button
          className="history-empty__btn"
          onClick={() => navigate('/scanner')}
        >
          📷 Scan your first item
        </button>
      </div>
 
      
    </div>
  );
}