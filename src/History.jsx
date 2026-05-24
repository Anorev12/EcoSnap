import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './history.css';

const CATEGORIES = [
  { key: 'all',     label: 'All',     icon: '🗂️' },
  { key: 'plastic', label: 'Plastic', icon: '🧴' },
  { key: 'paper',   label: 'Paper',   icon: '📄' },
  { key: 'glass',   label: 'Glass',   icon: '🫙' },
  { key: 'metal',   label: 'Metal',   icon: '🥫' },
  { key: 'organic', label: 'Organic', icon: '🍃' },
  { key: 'ewaste',  label: 'E-Waste', icon: '🔋' },
];

// ── Map backend ScanHistory → frontend shape ──────────────────────────────────
function mapScan(raw) {
  // Normalise category: lowercase, strip spaces, "e-waste" → "ewaste"
  const categoryKey = (raw.category ?? '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace('e-waste', 'ewaste')
    .replace('ewaste', 'ewaste'); // idempotent

  // Format scannedAt (ISO string from Spring) to "DD Mon YYYY"
  const date = raw.scannedAt
    ? new Date(raw.scannedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  return {
    id:       raw.id,
    name:     raw.item ?? 'Unknown item',
    category: categoryKey,
    date,
    confidence: raw.confidence ?? null,
    reason:     raw.reason   ?? null,
    disposal:   raw.disposal ?? null,
    // weight and recycled are not stored on the backend yet;
    // default to 0 / false until the entity is extended.
    weight:   raw.weight   ?? 0,
    recycled: raw.recycled ?? false,
  };
}

// ── Fetch hook ────────────────────────────────────────────────────────────────
function useScanHistory() {
  const [scans,   setScans]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // Auth token – adjust key name to match what your login flow stores
        const token = localStorage.getItem('token');

        const res = await fetch('/api/scan-history', {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          throw new Error(`Server error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        // API may return { content: [...] } (Page) or a plain array
        const list = Array.isArray(data) ? data : (data.content ?? []);
        setScans(list.map(mapScan));
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return { scans, loading, error };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function History() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const { scans: allScans, loading, error } = useScanHistory();

  const filtered =
    activeFilter === 'all'
      ? allScans
      : allScans.filter((s) => s.category === activeFilter);

  const recycledCount  = filtered.filter((s) => s.recycled).length;
  const totalWeight    = filtered.reduce((sum, s) => sum + s.weight, 0);
  const recyclingRate  = filtered.length
    ? Math.round((recycledCount / filtered.length) * 100)
    : 0;

  const countFor = (key) =>
    key === 'all'
      ? allScans.length
      : allScans.filter((s) => s.category === key).length;

  const activeCat = CATEGORIES.find((c) => c.key === activeFilter);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="history-page">
        <div className="history-loading">
          <span className="history-loading__spinner" />
          <p>Loading your scan history…</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="history-page">
        <div className="history-empty">
          <div className="history-empty__icon">⚠️</div>
          <h3 className="history-empty__title">Failed to load history</h3>
          <p className="history-empty__desc">{error}</p>
          <button
            className="history-empty__btn"
            onClick={() => window.location.reload()}
          >
            🔄 Try again
          </button>
        </div>
      </div>
    );
  }

  // ── Normal render ──────────────────────────────────────────────────────────
  return (
    <div className="history-page">

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
          <div className="history-summary__value">{filtered.length}</div>
          <div className="history-summary__label">Total Scans</div>
        </div>
        <div className="history-summary__card">
          <span className="history-summary__icon">♻️</span>
          <div className="history-summary__value">{recycledCount}</div>
          <div className="history-summary__label">Items Recycled</div>
        </div>
        <div className="history-summary__card">
          <span className="history-summary__icon">📊</span>
          <div className="history-summary__value">{recyclingRate}%</div>
          <div className="history-summary__label">Recycling Rate</div>
        </div>
        <div className="history-summary__card">
          <span className="history-summary__icon">🌍</span>
          <div className="history-summary__value">{totalWeight.toFixed(2)} kg</div>
          <div className="history-summary__label">Waste Diverted</div>
        </div>
      </div>

      {/* ── Category Filter Bar ── */}
      <div className="history-filters">
        {CATEGORIES.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`filter-chip ${activeFilter === key ? 'active' : ''}`}
            onClick={() => setActiveFilter(key)}
          >
            {icon} {label}
            <span className="chip-count">{countFor(key)}</span>
          </button>
        ))}
      </div>

      <p className="active-filter-label">
        Showing: <span>{activeCat.label} items</span>
      </p>

      {/* ── Scan List or Empty State ── */}
      {filtered.length === 0 ? (
        <div className="history-empty">
          <div className="history-empty__icon">🗂️</div>
          <h3 className="history-empty__title">
            No {activeCat.label.toLowerCase()} items yet
          </h3>
          <p className="history-empty__desc">
            Scan some {activeCat.label.toLowerCase()} waste to see it here.
          </p>
          <button className="history-empty__btn" onClick={() => navigate('/scanner')}>
            📷 Scan your first item
          </button>
        </div>
      ) : (
        <div className="history-list">
          {filtered.map((scan) => (
            <div key={scan.id} className="scan-item">
              <div className={`scan-item__icon scan-item__icon--${scan.category}`}>
                {CATEGORIES.find((c) => c.key === scan.category)?.icon ?? '🗂️'}
              </div>
              <div className="scan-item__info">
                <p className="scan-item__name">{scan.name}</p>
                <p className="scan-item__meta">
                  {scan.date}
                  {scan.confidence ? ` · ${scan.confidence} confidence` : ''}
                  {scan.weight > 0 ? ` · ${scan.weight.toFixed(3)} kg` : ''}
                </p>
              </div>
              <span className={`scan-item__badge scan-item__badge--${scan.category}`}>
                {scan.category}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}