import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from './hooks/useTranslation';
import './dashboard.css';

// ── Stat helpers ──────────────────────────────────────────────────
function isThisWeek(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return d >= startOfWeek;
}

function isThisMonth(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function computeStats(scans) {
  const valid = scans.filter((s) => !s.invalidScan);

  const total      = valid.length;
  const thisWeek   = valid.filter((s) => isThisWeek(s.scannedAt)).length;
  const thisMonth  = valid.filter((s) => isThisMonth(s.scannedAt)).length;

  const recycled   = valid.filter((s) => s.recyclable).length;
  const rate       = total > 0 ? Math.round((recycled / total) * 100) : 0;

  // Category breakdown for recycled items
  const catCount = (keyword) =>
    valid.filter((s) => s.recyclable && s.category?.toLowerCase().includes(keyword)).length;

  // Average waste-diverted % across all valid scans
  const avgDiverted =
    total > 0
      ? Math.round(valid.reduce((sum, s) => sum + (s.wasteDiverted ?? 0), 0) / total)
      : 0;

  // Rough CO₂ estimate: ~2.5 kg CO₂ per item recycled
  const co2Saved = (recycled * 2.5).toFixed(1);

  // Category rate helpers
  const catRate = (keyword) =>
    total > 0
      ? Math.round(
          (valid.filter((s) => s.category?.toLowerCase().includes(keyword)).length / total) * 100
        )
      : 0;

  return {
    total, thisWeek, thisMonth,
    recycled,
    rate,
    catCount,
    avgDiverted,
    co2Saved,
    catRate,
  };
}

// ── Fetch hook ────────────────────────────────────────────────────
function useDashboardData(userId) {
  const [scans,   setScans]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const controller = new AbortController();

    fetch(`http://localhost:8080/api/scanner/history/${userId}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load data (${res.status})`);
        return res.json();
      })
      .then((data) => { setScans(Array.isArray(data) ? data : []); setLoading(false); })
      .catch((err) => {
        if (err.name !== 'AbortError') { setError(err.message); setLoading(false); }
      });

    return () => controller.abort();
  }, [userId]);

  return { scans, loading, error };
}

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ data, isExpanded, isShrunk, onClick }) {
  return (
    <article
      className={[
        'stat-card',
        data.primary   ? 'stat-card--primary'  : '',
        isExpanded     ? 'stat-card--expanded' : '',
        isShrunk       ? 'stat-card--shrunk'   : '',
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="stat-card-default">
        <span className="stat-card-icon">{data.icon}</span>
        <div className="stat-value">{data.value}</div>
        <div className="stat-label">{data.label}</div>
        <span className={`stat-badge stat-badge--${data.badgeType}`}>{data.badge}</span>
      </div>

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

// ── Dashboard ─────────────────────────────────────────────────────
export default function Dashboard({ user, notify }) {
  const { t, lang } = useTranslation();
  const navigate     = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const welcomeShown = useRef(false);

  const { scans, loading, error } = useDashboardData(user?.id);

  useEffect(() => {
    if (welcomeShown.current) return;
    welcomeShown.current = true;
    notify?.info(
      t('startScanning'),
      { title: `${t('welcomeBack')}, ${user?.firstName || t('ecoWarrior')}! 👋` }
    );
  }, [notify, user?.firstName, lang, t]);

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  const handleScanClick = () => {
    notify?.success('Opening scanner…', { title: "Let's go! 📷" });
    navigate('/scanner');
  };

  // ── Compute live stats ────────────────────────────────────────
  const {
    total, thisWeek, thisMonth,
    recycled,
    rate,
    catCount,
    avgDiverted,
    co2Saved,
    catRate,
  } = computeStats(scans);

  const hasData = total > 0;

  const CARD_DETAILS = {
    scans: {
      icon: '📷',
      label: t('totalScans'),
      value: String(total),
      badge: hasData ? `${thisWeek} this week` : t('noScansYet'),
      badgeType: hasData ? 'green' : 'light',
      primary: false,
      details: [
        { label: t('thisWeek'),  value: String(thisWeek) },
        { label: t('thisMonth'), value: String(thisMonth) },
        { label: t('allTime'),   value: String(total) },
      ],
      tip: t('startScanning'),
    },
    recycled: {
      icon: '♻️',
      label: t('itemsRecycled'),
      value: String(recycled),
      badge: hasData ? `${rate}% recyclable` : t('getStarted'),
      badgeType: hasData ? 'green' : 'light',
      primary: false,
      details: [
        { label: 'Recyclable',    value: String(catCount('recyclable')) },
        { label: 'Biodegradable', value: String(catCount('biodegradable')) },
        { label: 'Hazardous',     value: String(catCount('hazardous')) },
        { label: 'E-Waste',       value: String(catCount('e-waste') + catCount('ewaste')) },
      ],
      tip: 'Recycle more items to see a full breakdown by category.',
    },
    rate: {
      icon: '📊',
      label: t('recyclingRate'),
      value: `${rate}%`,
      badge: hasData
        ? rate >= 70 ? '🌟 Excellent!' : rate >= 40 ? '👍 Good progress' : '📈 Keep going'
        : t('buildYourRate'),
      badgeType: hasData ? (rate >= 70 ? 'green' : 'yellow') : 'light',
      primary: false,
      details: [
        { label: 'Recyclable',    value: `${catRate('recyclable')}%` },
        { label: 'Non-Recyclable',value: `${catRate('residual') + catRate('non')}%` },
        { label: 'Hazardous',     value: `${catRate('hazardous')}%` },
      ],
      tip: t('recyclingRateImproves'),
    },
    waste: {
      icon: '🌍',
      label: t('wasteDiverted'),
      value: hasData ? `${avgDiverted}%` : '0%',
      badge: hasData ? `${recycled} items diverted` : t('yourImpactStartsHere'),
      badgeType: hasData ? 'green' : 'light',
      primary: false,
      details: [
        { label: 'Avg. Diversion Rate', value: `${avgDiverted}%` },
        { label: 'Items Diverted',       value: String(recycled) },
        { label: 'Est. CO₂ Saved',       value: `${co2Saved} kg` },
      ],
      tip: t('everyKilogramDiverted'),
    },
  };

  return (
    <div className="dashboard-container">
      <div className="page-shell">

        <header className="page-header">
          <div className="welcome-block">
            <h1>
              {t('welcomeBack')}, {user?.firstName || t('ecoWarrior')}! 👋
              <span className="welcome-icon">🌱</span>
            </h1>
            <p>{t('startScanning')}</p>
          </div>
          <button className="btn-scan" onClick={handleScanClick}>
            
            {t('scanNewItem')}
          </button>
        </header>

        {/* ── Loading / Error banners ── */}
        {loading && (
          <div className="onboarding-banner">
            <span className="banner-icon">⏳</span>
            <p>Loading your eco stats…</p>
          </div>
        )}

        {error && !loading && (
          <div className="onboarding-banner" style={{ borderColor: '#fca5a5', background: '#fef2f2' }}>
            <span className="banner-icon">⚠️</span>
            <p>Could not load your stats: {error}</p>
          </div>
        )}

        {!loading && !error && !hasData && (
          <div className="onboarding-banner">
            <span className="banner-icon">💡</span>
            <p>
              <strong>Welcome to EcoSnap!</strong> Hit <em>{t('scanNewItem')}</em> to scan
              your first recyclable waste and start building your eco-impact.
            </p>
          </div>
        )}

        {/* ── Stats grid ── */}
        <section className={`stats-grid ${expanded ? 'has-expanded' : ''}`}>
          {Object.entries(CARD_DETAILS).map(([id, data]) => (
            <StatCard
              key={id}
              data={data}
              isExpanded={expanded === id}
              isShrunk={expanded !== null && expanded !== id}
              onClick={() => toggle(id)}
            />
          ))}
        </section>

      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-links">
            <div className="footer-col"><ul><li><Link to="/about">{t('aboutUs')}</Link></li></ul></div>
            <div className="footer-col"><ul><li><Link to="/contact">{t('contactUs')}</Link></li></ul></div>
            <div className="footer-col"><ul><li><Link to="/privacy">{t('privacyPolicy')}</Link></li></ul></div>
            <div className="footer-col"><ul><li><Link to="/terms">{t('termsOfUse')}</Link></li></ul></div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} EcoSnap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}