const STYLES = {
  success: {
    bar: "#22c55e",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8.5" stroke="#22c55e" />
        <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  error: {
    bar: "#ef4444",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8.5" stroke="#ef4444" />
        <path d="M6 6l6 6M12 6l-6 6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  warning: {
    bar: "#f59e0b",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L16.5 15H1.5L9 2z" stroke="#f59e0b" strokeWidth="1.2" strokeLinejoin="round" />
        <line x1="9" y1="7.5" x2="9" y2="11" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="13" r="0.75" fill="#f59e0b" />
      </svg>
    ),
  },
  info: {
    bar: "#3b82f6",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8.5" stroke="#3b82f6" />
        <line x1="9" y1="8" x2="9" y2="13" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="5.5" r="0.75" fill="#3b82f6" />
      </svg>
    ),
  },
};

const notifStyles = `
  @keyframes notif-in {
    from { opacity: 0; transform: translateX(40px) scale(0.97); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes notif-out {
    from { opacity: 1; transform: translateX(0) scale(1); }
    to   { opacity: 0; transform: translateX(40px) scale(0.95); }
  }

  .notif-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #1e1e1e;
    border: 0.5px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    max-width: 360px;
    width: 100%;
  }

  .notif-title {
    margin: 0;
    font-weight: 600;
    font-size: 14px;
    color: #f0f0f0;
  }

  .notif-message {
    margin: 0;
    font-size: 13px;
    color: #aaaaaa;
    line-height: 1.5;
  }

  .notif-dismiss {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    color: #666;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .notif-dismiss:hover {
    color: #aaa;
  }

  .notif-entering {
    animation: notif-in 0.3s cubic-bezier(.22,.68,0,1.3);
  }

  .notif-exiting {
    animation: notif-out 0.35s ease forwards;
  }
`;

function NotificationItem({ n, onDismiss }) {
  const style = STYLES[n.type] || STYLES.info;
  return (
    <div
      className={`notif-item ${n.exiting ? 'notif-exiting' : 'notif-entering'}`}
      style={{ borderLeft: `3px solid ${style.bar}` }}
    >
      <span style={{ marginTop: "1px", flexShrink: 0 }}>{style.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {n.title && <p className="notif-title">{n.title}</p>}
        <p className="notif-message">{n.message}</p>
      </div>
      <button
        className="notif-dismiss"
        onClick={() => onDismiss(n.id)}
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export function NotificationContainer({ notifications, onDismiss }) {
  return (
    <>
      <style>{notifStyles}</style>
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "flex-end",
          pointerEvents: "none",
        }}
      >
        {notifications.map((n) => (
          <div key={n.id} style={{ pointerEvents: "all" }}>
            <NotificationItem n={n} onDismiss={onDismiss} />
          </div>
        ))}
      </div>
    </>
  );
}