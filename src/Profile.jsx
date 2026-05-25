import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "./hooks/useTranslation";
import './profile.css';

export default function Profile({ user }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalScans: 0,
    recyclableCount: 0,
    biodegradableCount: 0,
    hazardousCount: 0,
    eWasteCount: 0,
    residualCount: 0,
  });
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:8080/api/scanner/history/${user.id}`)
        .then(res => res.json())
        .then(data => {
          const totalScans = data.length;
          const recyclable = data.filter(s => s.category === "Recyclable").length;
          const biodegradable = data.filter(s => s.category === "Biodegradable").length;
          const hazardous = data.filter(s => s.category === "Hazardous").length;
          const eWaste = data.filter(s => s.category === "E-Waste").length;
          const residual = data.filter(s => s.category === "Residual / Non-Recyclable").length;

          setStats({
            totalScans,
            recyclableCount: recyclable,
            biodegradableCount: biodegradable,
            hazardousCount: hazardous,
            eWasteCount: eWaste,
            residualCount: residual,
          });

          setRecentScans(data.slice(0, 5));
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch scan history:", err);
          setLoading(false);
        });
    }
  }, [user?.id]);

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  const co2Saved = (stats.recyclableCount * 0.5 + stats.biodegradableCount * 0.3).toFixed(1);
  const itemsSorted = stats.totalScans;
  const treesHelped = (stats.recyclableCount / 8).toFixed(1);

  const getAchievements = () => {
    const achievements = [];
    if (stats.totalScans >= 1) achievements.push({ icon: "🌱", label: t('firstStep'), description: t('completedFirstScan'), id: 1 });
    if (stats.totalScans >= 10) achievements.push({ icon: "♻️", label: t('ecoScout'), description: `10 ${t('scansCompleted')}`, id: 2 });
    if (stats.totalScans >= 25) achievements.push({ icon: "🌍", label: t('planetGuardian'), description: t('scansCompleted25'), id: 3 });
    if (stats.totalScans >= 50) achievements.push({ icon: "🏆", label: t('wasteWarrior'), description: t('scansCompleted50'), id: 4 });
    if (stats.totalScans >= 100) achievements.push({ icon: "👑", label: t('ecoChampion'), description: t('scansCompleted100'), id: 5 });
    if (stats.recyclableCount >= 10) achievements.push({ icon: "📦", label: t('recycler'), description: t('recyclablesLabel'), id: 6 });
    if (stats.biodegradableCount >= 10) achievements.push({ icon: "🌿", label: t('composter'), description: t('compostablesLabel'), id: 7 });
    if (stats.hazardousCount + stats.eWasteCount >= 5) achievements.push({ icon: "⚠️", label: t('safetyFirst'), description: t('hazardousItemsLabel'), id: 8 });
    return achievements;
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case "Recyclable": return "#4CAF50";
      case "Biodegradable": return "#8BC34A";
      case "Hazardous": return "#F44336";
      case "E-Waste": return "#FF9800";
      case "Residual / Non-Recyclable": return "#9E9E9E";
      default: return "#757575";
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case "Recyclable": return "♻️";
      case "Biodegradable": return "🌿";
      case "Hazardous": return "⚠️";
      case "E-Waste": return "📱";
      case "Residual / Non-Recyclable": return "🗑️";
      default: return "📦";
    }
  };

  const formatDate = (date) => {
    if (!date) return t('recently');
    const options = { year: "numeric", month: "long" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const achievements = getAchievements();

  return (
    <div className="profile-wrapper">
      {/* Profile Header Card */}
      <div className="profile-card">
        <div className="profile-container">
          {/* Avatar Section */}
          <div className="profile-avatar">
            <div
              className="avatar-circle"
              style={
                user?.photoUrl
                  ? { backgroundImage: `url(${user.photoUrl})`, backgroundSize: "cover" }
                  : {}
              }
            >
              {!user?.photoUrl && initials}
            </div>
          </div>

          {/* Info Section */}
          <div className="profile-info">
            <div className="profile-header">
              <div className="profile-text">
                <h2 className="profile-name">{user?.firstName} {user?.lastName}</h2>
                <p className="profile-username">@{user?.username}</p>
                <p className="profile-rank">🌿 {t('wasteClassificationSpecialist')}</p>
              </div>
              <button
                className="edit-btn"
                onClick={() => navigate("/settings")}
                title="Edit your profile"
              >
                ✏️ {t('edit')}
              </button>
            </div>

            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">📧</span>
                <span className="detail-value">{user?.email}</span>
              </div>
              {user?.bio && (
                <div className="detail-row bio-row">
                  <span className="detail-label">📝</span>
                  <span className="detail-value">{user.bio}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">📅</span>
                <span className="detail-value">{t('joined')} {formatDate(stats.joinDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact Section */}
      <div className="impact-section">
        <h3 className="section-title">{t('yourEnvironmental')}</h3>
        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-icon">🌱</div>
            <div className="impact-content">
              <div className="impact-number">{treesHelped}</div>
              <div className="impact-label">{t('treesHelped')}</div>
            </div>
          </div>

          <div className="impact-card">
            <div className="impact-icon">☁️</div>
            <div className="impact-content">
              <div className="impact-number">{co2Saved} kg</div>
              <div className="impact-label">{t('co2Saved')}</div>
            </div>
          </div>

          <div className="impact-card">
            <div className="impact-icon">📊</div>
            <div className="impact-content">
              <div className="impact-number">{itemsSorted}</div>
              <div className="impact-label">{t('itemsSorted')}</div>
            </div>
          </div>

          <div className="impact-card">
            <div className="impact-icon">⭐</div>
            <div className="impact-content">
              <div className="impact-number">{(stats.totalScans * 5).toLocaleString()}</div>
              <div className="impact-label">{t('impactPoints')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <h3 className="section-title">{t('yourScanningStats')}</h3>
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalScans}</div>
              <div className="stat-label">{t('totalScansProfile')}</div>
            </div>
          </div>

          <div className="stat-card stat-recyclable">
            <div className="stat-icon">♻️</div>
            <div className="stat-content">
              <div className="stat-number">{stats.recyclableCount}</div>
              <div className="stat-label">{t('recyclableProfile')}</div>
              <div className="stat-percent">{stats.totalScans > 0 ? Math.round(stats.recyclableCount / stats.totalScans * 100) : 0}%</div>
            </div>
          </div>

          <div className="stat-card stat-biodegradable">
            <div className="stat-icon">🌿</div>
            <div className="stat-content">
              <div className="stat-number">{stats.biodegradableCount}</div>
              <div className="stat-label">{t('biodegradableProfile')}</div>
              <div className="stat-percent">{stats.totalScans > 0 ? Math.round(stats.biodegradableCount / stats.totalScans * 100) : 0}%</div>
            </div>
          </div>

          <div className="stat-card stat-hazardous">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <div className="stat-number">{stats.hazardousCount + stats.eWasteCount}</div>
              <div className="stat-label">{t('hazardousEWaste')}</div>
              <div className="stat-percent">{stats.totalScans > 0 ? Math.round((stats.hazardousCount + stats.eWasteCount) / stats.totalScans * 100) : 0}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      {recentScans.length > 0 && (
        <div className="recent-section">
          <h3 className="section-title">{t('recentScans')}</h3>
          <div className="recent-list">
            {recentScans.map((scan, idx) => (
              <div key={idx} className="recent-item">
                <div className="recent-icon" style={{ background: getCategoryColor(scan.category) }}>
                  {getCategoryIcon(scan.category)}
                </div>
                <div className="recent-content">
                  <div className="recent-item-name">{scan.item}</div>
                  <div className="recent-item-category">{scan.category}</div>
                </div>
                <div className="recent-confidence">
                  <span className={`confidence-badge ${scan.confidence.toLowerCase()}`}>
                    {scan.confidence}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="achievements-section">
          <h3 className="section-title">{t('achievements')} ({achievements.length})</h3>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-text">
                  <div className="achievement-name">{achievement.label}</div>
                  <div className="achievement-desc">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="actions-section">
        <button
          className="action-btn action-scan"
          onClick={() => navigate("/scanner")}
        >
          {t('startScanning')}
        </button>
        <button
          className="action-btn action-history"
          onClick={() => navigate("/history")}
        >
          {t('scanHistoryBtn')}
        </button>
        <button
          className="action-btn action-settings"
          onClick={() => navigate("/settings")}
        >
          {t('settingsBtn')}
        </button>
      </div>
    </div>
  );
}