import { NavLink } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
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
  const [user, setUser] = useState(propUser || null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const panelRef = useRef(null);
  const intervalRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Fetch from backend ───────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      // backend not reachable — fail silently
    }
  }, []);

  // ── Poll every 10 seconds ────────────────────────────
  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, 10000);
    return () => clearInterval(intervalRef.current);
  }, [fetchNotifications]);

  // ── Load user ────────────────────────────────────────
  useEffect(() => {
    if (!propUser) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
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
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {}
  };

  // ── Mark all as read ─────────────────────────────────
  const markAllRead = async () => {
    try {
      await fetch(`${API}/read-all`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {}
  };

  // ── Clear all ────────────────────────────────────────
  const clearAll = async () => {
    try {
      await fetch(API, { method: 'DELETE' });
      setNotifications([]);
    } catch (err) {}
  };

  return (
    <nav className="nav-wrapper">

      <div className="nav-logo-wrap">
        <NavLink to="/dashboard">
          <img className="nav-logo-img" src={logo} alt="EcoSnap Logo" />
        </NavLink>
      </div>

      <div className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item nav-item--active" : "nav-item"}>
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => isActive ? "nav-item nav-item--active" : "nav-item"}>
          <span className="nav-icon">🕐</span>
          <span>History</span>
        </NavLink>
        <NavLink to="/tipsandfacts" className={({ isActive }) => isActive ? "nav-item nav-item--active" : "nav-item"}>
          <span className="nav-icon">📋</span>
          <span>Tips & Facts</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item nav-item--active" : "nav-item"}>
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
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
              <span className="notif-panel__title">Notifications</span>
              <div className="notif-panel__actions">
                {unreadCount > 0 && (
                  <button className="notif-action-btn" onClick={markAllRead}>Mark all read</button>
                )}
                {notifications.length > 0 && (
                  <button className="notif-action-btn notif-action-btn--clear" onClick={clearAll}>Clear all</button>
                )}
              </div>
            </div>

            <div className="notif-panel__list">
              {notifications.length === 0 ? (
                <div className="notif-empty">
                  <span>🌿</span>
                  <p>You're all caught up!</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
                    onClick={() => markRead(n.id)}
                  >
                    <div className="notif-item__icon">{n.icon}</div>
                    <div className="notif-item__body">
                      <p className="notif-item__title">{n.title}</p>
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
        className={({ isActive }) => isActive ? "nav-item nav-item--active" : "nav-item nav-user"}
      >
        <span>{user?.firstName || "Guest"} {user?.lastName || ""}</span>
        <div
          className="nav-avatar"
          style={user?.photoUrl ? { backgroundImage: `url(${user.photoUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        >
          {user?.photoUrl ? "" : "👤"}
        </div>
      </NavLink>

    </nav>
  );
}