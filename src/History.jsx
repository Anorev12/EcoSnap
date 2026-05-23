import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './history.css';

const CATEGORY_META = {
  'Recyclable':               { icon: '♻️',  color: 'green',  key: 'recyclable' },
  'Biodegradable':            { icon: '🌿',  color: 'lime',   key: 'biodegradable' },
  'Residual / Non-Recyclable':{ icon: '🗑️',  color: 'gray',   key: 'residual' },
  'Hazardous':                { icon: '⚠️',  color: 'red',    key: 'hazardous' },
  'E-Waste':                  { icon: '🔌',  color: 'purple', key: 'ewaste' },
  'Unknown':                  { icon: '❓',  color: 'gray',   key: 'unknown' },
};

const FILTERS = [
  { key: 'all',          label: 'All',          icon: '🗂️' },
  { key: 'recyclable',   label: 'Recyclable',   icon: '♻️' },
  { key: 'biodegradable',label: 'Biodegradable',icon: '🌿' },
  { key: 'residual',     label: 'Non-Recyclable',icon: '🗑️' },
  { key: 'hazardous',    label: 'Hazardous',    icon: '⚠️' },
  { key: 'ewaste',       label: 'E-Waste',      icon: '🔌' },
];

function getCategoryKey(category) {
  if (!category) return 'unknown';
  const lower = category.toLowerCase();
  if (lower.includes('recyclable') && !lower.includes('non')) return 'recyclable';
  if (lower.includes('biodegradable')) return 'biodegradable';
  if (lower.includes('non') || lower.includes('residual')) return 'residual';
  if (lower.includes('hazardous')) return 'hazardous';
  if (lower.includes('e-waste') || lower.includes('ewaste')) return 'ewaste';
  return 'unknown';
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Scan Detail Modal ─────────────────────────────────────────────
function ScanDetailModal({ scan, onClose }) {
  const meta = CATEGORY_META[scan.category] || CATEGORY_META['Unknown'];
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, maxWidth: 480, width: '100%', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>

        {/* Image */}
        {scan.imageData ? (
          <img src={`data:image/jpeg;base64,${scan.imageData}`} alt={scan.item}
            style={{ width: '100%', height: 220, objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: 160, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
            {meta.icon}
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>{meta.icon}</span>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 17, color: '#111' }}>{scan.item}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{timeAgo(scan.scannedAt)}</p>
            </div>
            <span style={{ marginLeft: 'auto', background: '#e8f5e9', color: '#2e7d32', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20, border: '1px solid #c8e6c9' }}>
              {scan.category}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 12, background: '#f0f0f0', color: '#555', padding: '3px 10px', borderRadius: 12 }}>
              {scan.confidence} confidence
            </span>
          </div>

          {scan.reason && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Why</p>
              <p style={{ margin: 0, fontSize: 13, color: '#444', lineHeight: 1.55 }}>{scan.reason}</p>
            </div>
          )}

          {scan.disposal && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>How to dispose</p>
              <p style={{ margin: 0, fontSize: 13, color: '#444', lineHeight: 1.55 }}>{scan.disposal}</p>
            </div>
          )}

          <button onClick={onClose} style={{ width: '100%', padding: '10px', background: '#1b4d1e', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main History Component ────────────────────────────────────────
export default function History() {
  const navigate = useNavigate();
  const [scans, setScans]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedScan, setSelectedScan] = useState(null);

  // Load user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    fetch(`http://localhost:8080/api/scanner/history/${user.id}`)
      .then((res) => { if (!res.ok) throw new Error('Failed to load history'); return res.json(); })
      .then((data) => { setScans(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const filtered = activeFilter === 'all'
    ? scans
    : scans.filter((s) => getCategoryKey(s.category) === activeFilter);

  const countFor = (key) => key === 'all' ? scans.length : scans.filter((s) => getCategoryKey(s.category) === key).length;
  const activeCat = FILTERS.find((f) => f.key === activeFilter);

  const recycledCount = scans.filter((s) => getCategoryKey(s.category) === 'recyclable').length;
  const recyclingRate = scans.length ? Math.round((recycledCount / scans.length) * 100) : 0;

  return (
    <div className="history-page">

      {selectedScan && <ScanDetailModal scan={selectedScan} onClose={() => setSelectedScan(null)} />}

      {/* ── Header ── */}
      <div className="history-header">
        <div>
          <h1 className="history-header__title">Scan History 🕐</h1>
          <p className="history-header__sub">All your scanned items in one place.</p>
        </div>
        <button className="history-header__scan-btn" onClick={() => navigate('/scanner')}>
          📷 Scan new Item
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="history-summary">
        <div className="history-summary__card history-summary__card--dark">
          <span className="history-summary__icon">📷</span>
          <div className="history-summary__value">{scans.length}</div>
          <div className="history-summary__label">Total Scans</div>
        </div>
        <div className="history-summary__card">
          <span className="history-summary__icon">♻️</span>
          <div className="history-summary__value">{recycledCount}</div>
          <div className="history-summary__label">Recyclable Items</div>
        </div>
        <div className="history-summary__card">
          <span className="history-summary__icon">📊</span>
          <div className="history-summary__value">{recyclingRate}%</div>
          <div className="history-summary__label">Recycling Rate</div>
        </div>
        <div className="history-summary__card">
          <span className="history-summary__icon">🌍</span>
          <div className="history-summary__value">{scans.length} items</div>
          <div className="history-summary__label">Items Tracked</div>
        </div>
      </div>

      {/* ── Category Filter Bar ── */}
      <div className="history-filters">
        {FILTERS.map(({ key, label, icon }) => (
          <button key={key} className={`filter-chip ${activeFilter === key ? 'active' : ''}`} onClick={() => setActiveFilter(key)}>
            {icon} {label}
            <span className="chip-count">{countFor(key)}</span>
          </button>
        ))}
      </div>

      <p className="active-filter-label">
        Showing: <span>{activeCat?.label} items</span>
      </p>

      {/* ── Loading / Error ── */}
      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading your scan history…</div>}
      {error && <div style={{ textAlign: 'center', padding: 40, color: '#ef4444' }}>Error: {error}</div>}

      {/* ── Empty State ── */}
      {!loading && !error && filtered.length === 0 && (
        <div className="history-empty">
          <div className="history-empty__icon">🗂️</div>
          <h3 className="history-empty__title">No {activeCat?.label.toLowerCase()} items yet</h3>
          <p className="history-empty__desc">Scan some waste to see it here.</p>
          <button className="history-empty__btn" onClick={() => navigate('/scanner')}>📷 Scan your first item</button>
        </div>
      )}

      {/* ── Scan Grid ── */}
      {!loading && !error && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginTop: 8 }}>
          {filtered.map((scan) => {
            const meta = CATEGORY_META[scan.category] || CATEGORY_META['Unknown'];
            return (
              <div key={scan.id} onClick={() => setSelectedScan(scan)}
                style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.07)'; }}
              >
                {/* Thumbnail */}
                {scan.imageData ? (
                  <img src={`data:image/jpeg;base64,${scan.imageData}`} alt={scan.item}
                    style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: 140, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                    {meta.icon}
                  </div>
                )}

                {/* Info */}
                <div style={{ padding: '12px 14px' }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 14, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {scan.item}
                  </p>
                  <p style={{ margin: '0 0 8px', fontSize: 11, color: '#aaa' }}>{timeAgo(scan.scannedAt)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, background: '#e8f5e9', color: '#2e7d32', padding: '3px 8px', borderRadius: 10, fontWeight: 500 }}>
                      {meta.icon} {scan.category}
                    </span>
                    <span style={{ fontSize: 11, color: '#888' }}>{scan.confidence}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
 );
}