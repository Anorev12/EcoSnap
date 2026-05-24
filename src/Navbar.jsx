import { NavLink } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from './hooks/useTranslation';
import logo from './Logo/EcoSnap_LOGO_4.png';
import './dashboard.css';
import './navbar.css';

const API = 'http://localhost:8080/api/notifications';

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)     return 'Just now';
  if (diff < 3600)   return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return 'Yesterday';
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function Navbar({ user: propUser }) {
  const { t } = useTranslation();
  const [user, setUser]                 = useState(propUser || null);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [notifications, setNotifications] = useState([]);
  const panelRef    = useRef(null);
  const intervalRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Load user ────────────────────────────────────────────────
  useEffect(() => {
    if (!propUser) {
      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(stored);
    } else {
      setUser(propUser);
    }
  }, [propUser]);

  // ── Fetch all notifications for this user ────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API}/${user.id}`);   // ✅ /api/notifications/{userId}
      if (!res.ok) return;
      setNotifications(await res.json());
    } catch {
      // fail silently
    }
  }, [user?.id]);

  // ── Poll every 10 seconds ────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, 10_000);
    return () => clearInterval(intervalRef.current);
  }, [fetchNotifications, user?.id]);

  // ── Close panel on outside click ─────────────────────────────
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Mark single as read ──────────────────────────────────────
  const markRead = async (id) => {
    if (!user?.id) return;
    try {
      await fetch(`${API}/${user.id}/${id}/read`, { method: 'PUT' }); // ✅ /{userId}/{id}/read
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {}
  };

  // ── Mark all as read ─────────────────────────────────────────
  const markAllRead = async () => {
    if (!user?.id) return;
    try {
      await fetch(`${API}/${user.id}/read-all`, { method: 'PUT' }); // ✅ /{userId}/read-all
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  // ── Clear all (backend + local) ──────────────────────────────
  const clearAll = async () => {
    if (!user?.id) return;
    try {
      await fetch(`${API}/${user.id}`, { method: 'DELETE' }); // ✅ DELETE /{userId}
    } catch {}
    setNotifications([]);
  };

  return (
    <nav className="nav-wrapper">

      {/* ── Logo ── */}
      <div className="nav-logo-wrap">
        <NavLink to="/dashboard">
          <img className="nav-logo-img" src={logo} alt="EcoSnap Logo" />
        </NavLink>
      </div>

      {/* ── Nav Links ── */}
      <div className="nav-links">
        <NavLink to="/dashboard"   className={({ isActive }) => isActive ? 'nav-item nav-item--active' : 'nav-item'}><span>{t('dashboard')}</span></NavLink>
        <NavLink to="/history"     className={({ isActive }) => isActive ? 'nav-item nav-item--active' : 'nav-item'}><span>{t('history')}</span></NavLink>
        <NavLink to="/tipsandfacts"className={({ isActive }) => isActive ? 'nav-item nav-item--active' : 'nav-item'}><span>{t('tipsAndFacts')}</span></NavLink>
        <NavLink to="/settings"    className={({ isActive }) => isActive ? 'nav-item nav-item--active' : 'nav-item'}><span>{t('settings')}</span></NavLink>
      </div>

      {/* ── Notification Bell ── */}
      <div className="nav-notif-wrap" ref={panelRef}>
        <button
          className="nav-notif-btn"
          onClick={() => setNotifOpen((prev) => !prev)}
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
                  <button className="notif-action-btn notif-action-btn--clear" onClick={clearAll}>
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
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
                    onClick={() => markRead(n.id)}
                  >
                    <div className="notif-item__icon">{n.icon ?? '🌿'}</div>
                    <div className="notif-item__body">
                      <p className="notif-item__title">{n.title ?? 'EcoSnap'}</p>
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

      {/* ── User Profile ── */}
      <NavLink
        to="/profile"
        className={({ isActive }) => isActive ? 'nav-item nav-item--active' : 'nav-item nav-user'}
      >
        <span>{user?.firstName || 'Guest'} {user?.lastName || ''}</span>
        <div
          className="nav-avatar"
          style={user?.photoUrl ? { backgroundImage: `url(${user.photoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          {user?.photoUrl ? '' : '👤'}
        </div>
      </NavLink>

    </nav>
  );
}