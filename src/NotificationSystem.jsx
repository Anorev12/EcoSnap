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

function NotificationItem({ n, onDismiss }) {
  const style = STYLES[n.type] || STYLES.info;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        background: "#ffffff",
        border: "0.5px solid #e0e0e0",
        borderLeft: `3px solid ${style.bar}`,
        borderRadius: "10px",
        padding: "12px 14px",
        marginBottom: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        animation: n.exiting
          ? "notif-out 0.35s ease forwards"
          : "notif-in 0.3s cubic-bezier(.22,.68,0,1.3)",
        maxWidth: "360px",
        width: "100%",
      }}
    >
      <span style={{ marginTop: "1px", flexShrink: 0 }}>{style.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {n.title && (
          <p style={{ margin: 0, fontWeight: 500, fontSize: "14px", color: "#111" }}>
            {n.title}
          </p>
        )}
        <p style={{ margin: 0, fontSize: "13px", color: "#555", lineHeight: 1.5 }}>
          {n.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(n.id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "2px",
          color: "#aaa",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <style>{`
        @keyframes notif-in {
          from { opacity: 0; transform: translateX(40px) scale(0.97); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes notif-out {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to { opacity: 0; transform: translateX(40px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}

export function NotificationContainer({ notifications, onDismiss }) {
  return (
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
  );
}