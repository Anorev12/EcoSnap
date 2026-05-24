import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from './hooks/useTranslation';
import './dashboard.css';

function StatCard({ data, isExpanded, isShrunk, onClick }) {
  return (
    <article
      className={[
        'stat-card',
        data.primary ? 'stat-card--primary' : '',
        isExpanded ? 'stat-card--expanded' : '',
        isShrunk ? 'stat-card--shrunk' : '',
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
        <span className={`stat-badge stat-badge--${data.badgeType}`}>
          {data.badge}
        </span>
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

export default function Dashboard({ user, notify }) {
  // eslint-disable-next-line no-unused-vars
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const welcomeShown = useRef(false);

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
    notify?.success("Opening scanner…", { title: "Let's go! 📷" });
    navigate('/scanner');
  };

  // Build CARD_DETAILS dynamically with translations
  const CARD_DETAILS = {
    scans: {
      icon: '📷',
      label: t('totalScans'),
      value: '0',
      badge: t('noScansYet'),
      badgeType: 'light',
      primary: false,
      details: [
        { label: t('thisWeek'), value: '0' },
        { label: t('thisMonth'), value: '0' },
        { label: t('allTime'), value: '0' },
      ],
      tip: t('startScanning'),
    },
    recycled: {
      icon: '♻️',
      label: t('itemsRecycled'),
      value: '0',
      badge: t('getStarted'),
      badgeType: 'light',
      primary: false,
      details: [
        { label: t('plastic'), value: '0' },
        { label: t('paper'), value: '0' },
        { label: t('glass'), value: '0' },
        { label: t('metal'), value: '0' },
      ],
      tip: 'Recycle more items to see a breakdown by material type.',
    },
    rate: {
      icon: '📊',
      label: t('recyclingRate'),
      value: '0%',
      badge: t('buildYourRate'),
      badgeType: 'light',
      primary: false,
      details: [
        { label: t('recyclable'), value: '0%' },
        { label: 'Non-Recyclable', value: '0%' },
        { label: t('hazardous'), value: '0%' },
      ],
      tip: t('recyclingRateImproves'),
    },
    waste: {
      icon: '🌍',
      label: t('wasteDiverted'),
      value: '0 kg',
      badge: t('yourImpactStartsHere'),
      badgeType: 'light',
      primary: false,
      details: [
        { label: 'From Landfill', value: '0 kg' },
        { label: 'CO₂ Saved', value: '0 kg' },
        { label: 'Water Saved', value: '0 L' },
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
            <span className="scan-icon">📷</span>
            {t('scanNewItem')}
          </button>
        </header>

        <div className="onboarding-banner">
          <span className="banner-icon">💡</span>
          <p>
            <strong>Welcome to EcoSnap!</strong> Hit <em>{t('scanNewItem')}</em> to scan
            your first recyclable waste and start building your eco-impact.
          </p>
        </div>

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
            <div className="footer-col">
              <ul><li><Link to="/about">{t('aboutUs')}</Link></li></ul>
            </div>
            <div className="footer-col">
              <ul><li><Link to="/contact">{t('contactUs')}</Link></li></ul>
            </div>
            <div className="footer-col">
              <ul><li><Link to="/privacy">{t('privacyPolicy')}</Link></li></ul>
            </div>
            <div className="footer-col">
              <ul><li><Link to="/terms">{t('termsOfUse')}</Link></li></ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} EcoSnap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}