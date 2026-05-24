import { NavLink } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from './hooks/useTranslation';
import logo from './Logo/EcoSnap_LOGO_4.png';
import './dashboard.css';
import './navbar.css';

const API = 'http://localhost:8080/api/notifications';

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return 'Yesterday';
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function Navbar({ user: propUser }) {
  // eslint-disable-next-line no-unused-vars
  const { t, lang } = useTranslation();
  const [user, setUser] = useState(propUser || null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const panelRef = useRef(null);
  const intervalRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Fetch from backend ───────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API}?userId=${user.id}`);
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      // fail silently
    }
  }, [user?.id]);

  // ── Poll every 10 seconds ────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, 10000);
    return () => clearInterval(intervalRef.current);
  }, [fetchNotifications, user?.id]);

  // ── Load user ────────────────────────────────────────
  useEffect(() => {
    if (!propUser) {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(storedUser);
    } else {
      setUser(propUser);
    }
  }, [propUser]);

  // ── Close on outside click ───────────────────────────
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Mark single as read ──────────────────────────────
  const markRead = async (id) => {
    try {
      await fetch(`${API}/${id}/read`, { method: 'PUT' });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {}
  };

  // ── Mark all as read ─────────────────────────────────
  const markAllRead = async () => {
    if (!user?.id) return;
    try {
      await fetch(`${API}/mark-all-read?userId=${user.id}`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {}
  };

  // ── Clear all (local only) ───────────────────────────
  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <nav className="nav-wrapper">

      {/* ── Logo ─────────────────────────────────────── */}
      <div className="nav-logo-wrap">
        <NavLink to="/dashboard">
          <img className="nav-logo-img" src={logo} alt="EcoSnap Logo" />
        </NavLink>
      </div>

      {/* ── Nav Links ────────────────────────────────── */}
      <div className="nav-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => isActive ? 'nav-item nav-item--active' : 'nav-item'}
        >
          <span>{t('dashboard')}</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => isActive ? 'nav-item nav-item--active' : 'nav-item'}
        >
          <span>{t('history')}</span>
        </NavLink>
        <NavLink
          to="/tipsandfacts"
          className={({ isActive }) => isActive ? 'nav-item nav-item--active' : 'nav-item'}
        >
          <span>{t('tipsAndFacts')}</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => isActive ? 'nav-item nav-item--active' : 'nav-item'}
        >
          <span>{t('settings')}</span>
        </NavLink>
      </div>

      {/* ── Notification Bell ────────────────────────── */}
      <div className="nav-notif-wrap" ref={panelRef}>
        <button
          className="nav-notif-btn"
          onClick={() => setNotifOpen(prev => !prev)}
          aria-label="Notifications"
        >
          🔔
          {unreadCount > 0 && (
            <span className="nav-notif-badge">{unreadCount}</span>
          )}
        </button>

        {notifOpen && (
          <div className="notif-panel">
            <div className="notif-panel__header">
              <span className="notif-panel__title">{t('notifications')}</span>
              <div className="notif-panel__actions">
                {unreadCount > 0 && (
                  <button className="notif-action-btn" onClick={markAllRead}>
                    {t('markAllRead')}
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    className="notif-action-btn notif-action-btn--clear"
                    onClick={clearAll}
                  >
                    {t('clearAll')}
                  </button>
                )}
              </div>
            </div>

            <div className="notif-panel__list">
              {notifications.length === 0 ? (
                <div className="notif-empty">
                  <span>🌿</span>
                  <p>{t('youreAllCaughtUp')}</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
                    onClick={() => markRead(n.id)}
                  >
                    <div className="notif-item__icon">🌿</div>
                    <div className="notif-item__body">
                      <p className="notif-item__title">EcoSnap</p>
                      <p className="notif-item__message">{n.message}</p>
                      <p className="notif-item__time">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && <span className="notif-item__dot" />}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── User Profile ─────────────────────────────── */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? 'nav-item nav-item--active' : 'nav-item nav-user'
        }
      >
        <span>{user?.firstName || 'Guest'} {user?.lastName || ''}</span>
        <div
          className="nav-avatar"
          style={
            user?.photoUrl
              ? { backgroundImage: `url(${user.photoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : {}
          }
        >
          {user?.photoUrl ? '' : '👤'}
        </div>
      </NavLink>

    </nav>
  );
}