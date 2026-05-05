import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from './Logo/EcoSnap_LOGO_4.png';
import './admin.css';

const Icons = {
  dashboard: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  ),
  categories: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
    </svg>
  ),
  tips: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  ),
  api: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
};

const SIDEBAR = [
  {
    group: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: Icons.dashboard }],
  },
  {
    group: "Management",
    items: [
      { id: "categories", label: "Waste Categories", icon: Icons.categories },
      { id: "users",      label: "User Management",  icon: Icons.users },
    ],
  },
  {
    group: "Logs",
    items: [
      { id: "ai",  label: "AI Training Logs", icon: Icons.ai },
      { id: "api", label: "API Logs",          icon: Icons.api },
    ],
  },
  {
    group: "Content",
    items: [{ id: "tips", label: "Tips and Facts", icon: Icons.tips }],
  },
];

const ArrowUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);
const RefreshIcon = () => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

const STATS = [
  { value: "1,350", label: "Total Users",     change: "+12% This Month",    changeType: "up" },
  { value: "8,400", label: "Total Scans",      change: "+28% This Month",    changeType: "up" },
  { value: "6,205", label: "Recyclable Items", change: "73.5% of all scans", changeType: "up" },
  { value: "12",    label: "Waste Categories", change: "2 updated recently", changeType: "neutral" },
];
const BAR_DATA = [
  { day: "Mon", value: 55 }, { day: "Tue", value: 70 }, { day: "Wed", value: 60 },
  { day: "Thu", value: 65 }, { day: "Fri", value: 80 }, { day: "Sat", value: 90 }, { day: "Sun", value: 100 },
];

const DonutChart = () => {
  const r = 35, cx = 50, cy = 50, circumference = 2 * Math.PI * r;
  const segments = [
    { pct: 0.735, color: "#3cb35a" },
    { pct: 0.15,  color: "#60a5fa" },
    { pct: 0.115, color: "#f9a8d4" },
  ];
  let offset = 0;
  const arcs = segments.map((seg) => {
    const dashArray  = seg.pct * circumference;
    const dashOffset = -offset * circumference;
    offset += seg.pct;
    return { ...seg, dashArray, dashOffset };
  });
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 110, position: "relative" }}>
      <svg viewBox="0 0 100 100" width="110" height="110">
        {arcs.map((arc, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={arc.color} strokeWidth="14"
            strokeDasharray={`${arc.dashArray} ${circumference}`}
            strokeDashoffset={arc.dashOffset + circumference * 0.25}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
        ))}
      </svg>
      <div style={{ position: "absolute", textAlign: "center", fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a1a" }}>73.5%</div>
        <div style={{ fontSize: 8, color: "#6b7280", fontWeight: 600 }}>Recyclable</div>
      </div>
    </div>
  );
};

// ─── Dashboard Panel ──────────────────────────────────────────────
function DashboardPanel() {
  const maxBar = Math.max(...BAR_DATA.map((d) => d.value));
  return (
    <div className="adm-panel">
      <h2 className="adm-panel-title">Dashboard Overview</h2>
      <div className="adm-stats-grid">
        {STATS.map((stat) => (
          <div key={stat.label} className="adm-stat-card">
            <div className="adm-stat-value">{stat.value}</div>
            <div className="adm-stat-label">{stat.label}</div>
            <div className={`adm-stat-change adm-stat-change--${stat.changeType}`}>
              {stat.changeType === "up" ? <ArrowUpIcon /> : <RefreshIcon />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>
      <div className="adm-charts-grid">
        <div className="adm-section-card">
          <h4 className="adm-card-title">
            <svg viewBox="0 0 20 20" fill="#6b7280" width="15" height="15">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Scans Per Day (This Week)
          </h4>
          <div className="adm-bar-chart">
            {BAR_DATA.map((d, i) => {
              const h = (d.value / maxBar) * 78;
              return (
                <div key={d.day} className="adm-bar-col">
                  <div className="adm-bar" title={`${d.value} scans`}
                    style={{ height: h, background: i >= 4 ? "#3cb35a" : "#2d7a3a" }} />
                  <div className="adm-bar-label">{d.day}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="adm-section-card">
          <h4 className="adm-card-title">
            <svg viewBox="0 0 20 20" fill="#6b7280" width="15" height="15">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            Scan Categories
          </h4>
          <DonutChart />
          <div className="adm-donut-legend">
            {[
              { color: "#3cb35a", label: "Recyclable",     pct: "73.5%" },
              { color: "#60a5fa", label: "Non-Recyclable", pct: "15.0%" },
              { color: "#f9a8d4", label: "Other",          pct: "11.5%" },
            ].map((item) => (
              <div key={item.label} className="adm-legend-row">
                <div className="adm-legend-dot" style={{ background: item.color }} />
                <span className="adm-legend-label">{item.label}</span>
                <span className="adm-legend-pct">{item.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Panel: Waste Categories ──────────────────────────────────────
const CATEGORIES = [
  { id: 1,  name: "Plastic",       items: 2340, color: "#3b82f6", emoji: "🧴" },
  { id: 2,  name: "Paper",         items: 1870, color: "#f59e0b", emoji: "📄" },
  { id: 3,  name: "Glass",         items: 980,  color: "#06b6d4", emoji: "🫙" },
  { id: 4,  name: "Metal",         items: 760,  color: "#6b7280", emoji: "🥫" },
  { id: 5,  name: "E-Waste",       items: 430,  color: "#8b5cf6", emoji: "💻" },
  { id: 6,  name: "Organic",       items: 1120, color: "#22c55e", emoji: "🍂" },
  { id: 7,  name: "Hazardous",     items: 210,  color: "#ef4444", emoji: "⚠️" },
  { id: 8,  name: "Textile",       items: 340,  color: "#ec4899", emoji: "👕" },
  { id: 9,  name: "Rubber",        items: 180,  color: "#d97706", emoji: "🔵" },
  { id: 10, name: "Construction",  items: 290,  color: "#78716c", emoji: "🧱" },
  { id: 11, name: "Liquid",        items: 150,  color: "#0ea5e9", emoji: "💧" },
  { id: 12, name: "Mixed",         items: 520,  color: "#a3a3a3", emoji: "🗃️" },
];

function WasteCategoriesPanel() {
  const [cats, setCats]         = useState(CATEGORIES);
  const [editing, setEditing]   = useState(null);
  const [editName, setEditName] = useState("");

  const startEdit = (cat) => { setEditing(cat.id); setEditName(cat.name); };
  const saveEdit  = (id)  => {
    setCats(cats.map((c) => c.id === id ? { ...c, name: editName } : c));
    setEditing(null);
  };

  return (
    <div className="adm-panel">
      <div className="adm-panel-header">
        <h2 className="adm-panel-title">Waste Categories</h2>
        <button className="adm-btn-primary">+ Add Category</button>
      </div>
      <div className="adm-section-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Category</th><th>Items Scanned</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((cat) => (
              <tr key={cat.id}>
                <td>
                  <div className="adm-cat-name">
                    <span className="adm-cat-dot" style={{ background: cat.color }} />
                    {editing === cat.id ? (
                      <input className="adm-inline-input" value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(cat.id)}
                        autoFocus />
                    ) : (
                      <span>{cat.emoji} {cat.name}</span>
                    )}
                  </div>
                </td>
                <td><span className="adm-count">{cat.items.toLocaleString()}</span></td>
                <td><span className="adm-badge-active">Active</span></td>
                <td>
                  <div className="adm-action-row">
                    {editing === cat.id ? (
                      <button className="adm-btn-sm adm-btn-save" onClick={() => saveEdit(cat.id)}>Save</button>
                    ) : (
                      <button className="adm-btn-sm" onClick={() => startEdit(cat)}>Edit</button>
                    )}
                    <button className="adm-btn-sm adm-btn-danger"
                      onClick={() => setCats(cats.filter((c) => c.id !== cat.id))}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Panel: User Management ───────────────────────────────────────
const EMPTY_USER_FORM = { firstName: "", lastName: "", username: "", email: "", password: "" };

function AddUserModal({ onClose, onAdded }) {
  const [form, setForm]     = useState(EMPTY_USER_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState(null);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setErr("First name, last name, email and password are required.");
      return;
    }
    setSaving(true); setErr(null);
    fetch("http://localhost:8080/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || "Registration failed");
        onAdded(data); onClose();
      })
      .catch((e) => { setErr(e.message); setSaving(false); });
  };

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h3 className="adm-modal-title">Add New User</h3>
          <button className="adm-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="adm-modal-body">
          <div className="adm-modal-row">
            <div className="adm-modal-field">
              <label className="adm-modal-label">First Name *</label>
              <input className="adm-modal-input" name="firstName" value={form.firstName} onChange={handle} placeholder="Juan" />
            </div>
            <div className="adm-modal-field">
              <label className="adm-modal-label">Last Name *</label>
              <input className="adm-modal-input" name="lastName" value={form.lastName} onChange={handle} placeholder="dela Cruz" />
            </div>
          </div>
          <div className="adm-modal-field">
            <label className="adm-modal-label">Username</label>
            <input className="adm-modal-input" name="username" value={form.username} onChange={handle} placeholder="juandc (optional)" />
          </div>
          <div className="adm-modal-field">
            <label className="adm-modal-label">Email * <span className="adm-modal-hint">(use @ecosnapadmin.com for Admin role)</span></label>
            <input className="adm-modal-input" name="email" type="email" value={form.email} onChange={handle} placeholder="juan@gmail.com" />
          </div>
          <div className="adm-modal-field">
            <label className="adm-modal-label">Password *</label>
            <input className="adm-modal-input" name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" />
          </div>
          {err && <p className="adm-modal-error">{err}</p>}
        </div>
        <div className="adm-modal-footer">
          <button className="adm-btn-sm" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="adm-btn-primary" onClick={submit} disabled={saving}>
            {saving ? "Adding…" : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UserManagementPanel() {
  const [users, setUsers]         = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/users/all")
      .then((res) => { if (!res.ok) throw new Error(`Server error: ${res.status}`); return res.json(); })
      .then((data) => { setUsers(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const handleRemove = (id) => {
    fetch(`http://localhost:8080/api/users/delete/${id}`, { method: "DELETE" })
      .then((res) => { if (!res.ok) throw new Error("Failed to delete user"); })
      .then(() => setUsers((prev) => prev.filter((u) => u.id !== id)))
      .catch((err) => alert(err.message));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("default", { month: "short", year: "numeric" });
  };

  const filtered = users.filter((u) => {
    const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
    const email    = (u.email ?? "").toLowerCase();
    const q        = search.toLowerCase();
    return fullName.includes(q) || email.includes(q);
  });

  return (
    <div className="adm-panel">
      {showModal && <AddUserModal onClose={() => setShowModal(false)} onAdded={(u) => setUsers((p) => [...p, u])} />}
      <div className="adm-panel-header">
        <h2 className="adm-panel-title">User Management</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="adm-search-wrap">
            <input className="adm-search" placeholder="Search users…" value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="adm-btn-primary" onClick={() => setShowModal(true)}>+ Add User</button>
        </div>
      </div>
      <div className="adm-section-card">
        {loading && <p className="adm-empty">Loading users…</p>}
        {error   && <p className="adm-empty" style={{ color: "#ef4444" }}>Error: {error}</p>}
        {!loading && !error && (
          <table className="adm-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.firstName} {u.lastName}</strong></td>
                  <td className="adm-muted">{u.email}</td>
                  <td>
                    <span className={`adm-role-badge adm-role-badge--${(u.role ?? "user").toLowerCase()}`}>
                      {u.role ?? "User"}
                    </span>
                  </td>
                  <td className="adm-muted">{formatDate(u.createdAt)}</td>
                  <td>
                    <div className="adm-action-row">
                      <button className="adm-btn-sm adm-btn-danger" onClick={() => handleRemove(u.id)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !error && filtered.length === 0 && <p className="adm-empty">No users found.</p>}
      </div>
    </div>
  );
}

// ─── Panel: AI Training Logs ──────────────────────────────────────
const AI_LOGS = [
  { id: 1, timestamp: "2026-05-02 08:14", model: "v2.3.1", item: "Plastic bottle", result: "Recyclable",     confidence: 97 },
  { id: 2, timestamp: "2026-05-02 08:10", model: "v2.3.1", item: "Styrofoam cup",  result: "Non-Recyclable", confidence: 91 },
  { id: 3, timestamp: "2026-05-02 07:58", model: "v2.3.0", item: "Cardboard box",  result: "Recyclable",     confidence: 99 },
  { id: 4, timestamp: "2026-05-01 22:31", model: "v2.3.0", item: "Battery AA",     result: "Hazardous",      confidence: 88 },
  { id: 5, timestamp: "2026-05-01 21:05", model: "v2.3.0", item: "Glass jar",      result: "Recyclable",     confidence: 95 },
  { id: 6, timestamp: "2026-05-01 19:44", model: "v2.2.9", item: "Aluminum can",   result: "Recyclable",     confidence: 98 },
  { id: 7, timestamp: "2026-05-01 17:22", model: "v2.2.9", item: "Plastic bag",    result: "Non-Recyclable", confidence: 84 },
  { id: 8, timestamp: "2026-05-01 15:10", model: "v2.2.9", item: "Old phone",      result: "Hazardous",      confidence: 76 },
];
const RESULT_COLORS = { Recyclable: "#3cb35a", "Non-Recyclable": "#ef4444", Hazardous: "#f59e0b" };

function AILogsPanel() {
  return (
    <div className="adm-panel">
      <h2 className="adm-panel-title">AI Training Logs</h2>
      <div className="adm-section-card">
        <table className="adm-table">
          <thead>
            <tr><th>Timestamp</th><th>Model</th><th>Item Scanned</th><th>Result</th><th>Confidence</th></tr>
          </thead>
          <tbody>
            {AI_LOGS.map((log) => (
              <tr key={log.id}>
                <td className="adm-muted" style={{ fontFamily: "monospace", fontSize: 12 }}>{log.timestamp}</td>
                <td><span className="adm-model-badge">{log.model}</span></td>
                <td>{log.item}</td>
                <td>
                  <span className="adm-result-badge" style={{
                    background: RESULT_COLORS[log.result] + "22",
                    color: RESULT_COLORS[log.result],
                    border: `1px solid ${RESULT_COLORS[log.result]}44`,
                  }}>
                    {log.result}
                  </span>
                </td>
                <td>
                  <div className="adm-conf-row">
                    <div className="adm-conf-bar">
                      <div className="adm-conf-fill" style={{
                        width: `${log.confidence}%`,
                        background: log.confidence >= 90 ? "#3cb35a" : log.confidence >= 80 ? "#f59e0b" : "#ef4444",
                      }} />
                    </div>
                    <span className="adm-conf-num">{log.confidence}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Panel: API Logs (Live Backend) ──────────────────────────────
const METHOD_COLORS = { GET: "#3b82f6", POST: "#3cb35a", PUT: "#f59e0b", DELETE: "#ef4444" };
const STATUS_COLOR  = (s) => s < 300 ? "#3cb35a" : s < 400 ? "#f59e0b" : "#ef4444";

function APILogsPanel() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/logs")
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => { setLogs(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
  };

  return (
    <div className="adm-panel">
      <h2 className="adm-panel-title">API Logs</h2>
      <div className="adm-section-card">
        {loading && <p className="adm-empty">Loading logs…</p>}
        {error   && <p className="adm-empty" style={{ color: "#ef4444" }}>Error: {error}</p>}
        {!loading && !error && logs.length === 0 && (
          <p className="adm-empty">No API logs recorded yet.</p>
        )}
        {!loading && !error && logs.length > 0 && (
          <table className="adm-table">
            <thead>
              <tr><th>Time</th><th>Method</th><th>Endpoint</th><th>Status</th><th>Latency</th></tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="adm-muted" style={{ fontFamily: "monospace", fontSize: 12 }}>
                    {formatTime(log.timestamp)}
                  </td>
                  <td>
                    <span className="adm-method-badge" style={{
                      background: (METHOD_COLORS[log.method] ?? "#6b7280") + "22",
                      color: METHOD_COLORS[log.method] ?? "#6b7280",
                      border: `1px solid ${(METHOD_COLORS[log.method] ?? "#6b7280") + "44"}`,
                    }}>
                      {log.method}
                    </span>
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{log.endpoint}</td>
                  <td>
                    <span className="adm-status-badge" style={{
                      background: STATUS_COLOR(log.status) + "22",
                      color: STATUS_COLOR(log.status),
                      border: `1px solid ${STATUS_COLOR(log.status) + "44"}`,
                    }}>
                      {log.status}
                    </span>
                  </td>
                  <td className="adm-muted">{log.latencyMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Panel: Tips and Facts (Live Backend) ─────────────────────────
const EMPTY_TIP = { category: "", title: "", description: "", fact: "", icon: "♻️", active: true };
const TIP_CATEGORY_OPTIONS = ["General", "Plastics", "Organics", "Hazardous", "Electronics", "Paper", "Glass"];

function TipModal({ initial, onClose, onSaved }) {
  const [form, setForm]     = useState(initial ?? EMPTY_TIP);
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState(null);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () => {
    if (!form.title || !form.description || !form.category) {
      setErr("Title, category, and description are required.");
      return;
    }
    setSaving(true); setErr(null);
    const isEdit = !!form.id;
    const url    = isEdit
      ? `http://localhost:8080/api/tips/update/${form.id}`
      : "http://localhost:8080/api/tips/create";

    fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(`${res.status} — ${text || "Server error"}`);
          });
        }
        return res.json();
      })
      .then((saved) => { onSaved(saved, isEdit); onClose(); })
      .catch((e) => { setErr(e.message); setSaving(false); });
  };

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div className="adm-modal-header">
          <h3 className="adm-modal-title">{form.id ? "Edit Tip" : "Add New Tip"}</h3>
          <button className="adm-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="adm-modal-body">
          <div className="adm-modal-row">
            <div className="adm-modal-field" style={{ flex: "0 0 90px" }}>
              <label className="adm-modal-label">Icon</label>
              <input className="adm-modal-input" name="icon" value={form.icon} onChange={handle}
                placeholder="♻️" style={{ textAlign: "center", fontSize: 20 }} />
            </div>
            <div className="adm-modal-field">
              <label className="adm-modal-label">Category *</label>
              <select className="adm-modal-input" name="category" value={form.category} onChange={handle}>
                <option value="">— Select —</option>
                {TIP_CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="adm-modal-field">
            <label className="adm-modal-label">Title *</label>
            <input className="adm-modal-input" name="title" value={form.title} onChange={handle}
              placeholder="e.g. Plastic Recycling Tips" />
          </div>
          <div className="adm-modal-field">
            <label className="adm-modal-label">Description *</label>
            <textarea className="adm-modal-input" name="description" value={form.description} onChange={handle}
              placeholder="Main tip text shown to users…" rows={3}
              style={{ resize: "vertical", fontFamily: "inherit" }} />
          </div>
          <div className="adm-modal-field">
            <label className="adm-modal-label">Fun Fact <span className="adm-modal-hint">(optional — shown on card flip)</span></label>
            <textarea className="adm-modal-input" name="fact" value={form.fact} onChange={handle}
              placeholder="Did you know…" rows={2}
              style={{ resize: "vertical", fontFamily: "inherit" }} />
          </div>
          {err && <p className="adm-modal-error">{err}</p>}
        </div>
        <div className="adm-modal-footer">
          <button className="adm-btn-sm" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="adm-btn-primary" onClick={submit} disabled={saving}>
            {saving ? "Saving…" : form.id ? "Save Changes" : "Add Tip"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TipsPanel() {
  const [tips, setTips]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [modal, setModal]     = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/tips/all")
      .then((res) => { if (!res.ok) throw new Error("Failed to load tips"); return res.json(); })
      .then((data) => { setTips(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const handleSaved = (saved, isEdit) => {
    setTips((prev) =>
      isEdit ? prev.map((t) => t.id === saved.id ? saved : t) : [...prev, saved]
    );
  };

  const handleToggle = (id) => {
    fetch(`http://localhost:8080/api/tips/toggle/${id}`, { method: "PUT" })
      .then((res) => { if (!res.ok) throw new Error("Toggle failed"); return res.json(); })
      .then((updated) => setTips((prev) => prev.map((t) => t.id === updated.id ? updated : t)))
      .catch((e) => alert(e.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this tip? This cannot be undone.")) return;
    fetch(`http://localhost:8080/api/tips/delete/${id}`, { method: "DELETE" })
      .then((res) => { if (!res.ok) throw new Error("Delete failed"); })
      .then(() => setTips((prev) => prev.filter((t) => t.id !== id)))
      .catch((e) => alert(e.message));
  };

  return (
    <div className="adm-panel">
      {modal !== null && (
        <TipModal initial={modal} onClose={() => setModal(null)} onSaved={handleSaved} />
      )}
      <div className="adm-panel-header">
        <h2 className="adm-panel-title">Tips and Facts</h2>
        <button className="adm-btn-primary" onClick={() => setModal({ ...EMPTY_TIP })}>+ Add Tip</button>
      </div>
      <div className="adm-section-card">
        {loading && <p className="adm-empty">Loading tips…</p>}
        {error   && <p className="adm-empty" style={{ color: "#ef4444" }}>Error: {error}</p>}

        {!loading && !error && tips.map((tip) => (
          <div key={tip.id} className="adm-tip-row">
            <div className="adm-tip-info">
              <span className="adm-tip-category">
                {tip.icon && <span style={{ marginRight: 5 }}>{tip.icon}</span>}
                {tip.category}
              </span>
              <strong style={{ display: "block", fontSize: 13, marginBottom: 3, color: "#111" }}>
                {tip.title}
              </strong>
              <p className="adm-tip-text">{tip.description}</p>
              {tip.fact && (
                <p className="adm-tip-text" style={{ fontStyle: "italic", color: "#6b7280", marginTop: 2 }}>
                  💡 {tip.fact}
                </p>
              )}
            </div>
            <div className="adm-action-row" style={{ flexShrink: 0, gap: 8, alignItems: "center" }}>
              <label className="adm-toggle" title={tip.active ? "Active — click to deactivate" : "Inactive — click to activate"}>
                <input type="checkbox" checked={tip.active} onChange={() => handleToggle(tip.id)} />
                <span className="adm-toggle-slider" />
              </label>
              <button className="adm-btn-sm" onClick={() => setModal({ ...tip })}>Edit</button>
              <button className="adm-btn-sm adm-btn-danger" onClick={() => handleDelete(tip.id)}>Delete</button>
            </div>
          </div>
        ))}

        {!loading && !error && tips.length === 0 && (
          <p className="adm-empty">No tips yet. Click "+ Add Tip" to create one.</p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function EcoSnapDashboard({ user }) {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const PANEL_TITLES = {
    dashboard:  "Admin Analytics Dashboard",
    categories: "Waste Categories",
    users:      "User Management",
    ai:         "AI Training Logs",
    api:        "API Logs",
    tips:       "Tips and Facts",
  };

  return (
    <div className="adm-root">
      <div className="adm-topbar" />
      <div className="adm-layout">
        {/* ── SIDEBAR ── */}
        <aside className="adm-sidebar">
          <div className="adm-logo">
            <img className="nav-logo-img" src={logo} alt="EcoSnap Logo" />
          </div>
          <nav className="adm-nav">
            {SIDEBAR.map(({ group, items }) => (
              <div key={group} className="adm-nav-group">
                <div className="adm-nav-group-label">{group}</div>
                {items.map((item) => (
                  <button
                    key={item.id}
                    className={`adm-nav-item${active === item.id ? " adm-nav-item--active" : ""}`}
                    onClick={() => setActive(item.id)}
                  >
                    <span className="adm-nav-item-icon">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="adm-sidebar-footer">
            <div className="adm-admin-info">
              <svg viewBox="0 0 20 20" fill="rgba(255,255,255,0.7)" width="20" height="20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              {user?.firstName || "Administrator"}
            </div>
            <button className="adm-logout-btn" onClick={handleLogout}>Log Out</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="adm-main">
          <div className="adm-header">
            <h1 className="adm-header-title">{PANEL_TITLES[active]}</h1>
            <div className="adm-header-badge adm-badge-date">
              <div className="adm-header-badge-dot" style={{ background: "#3b82f6" }} />
              {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
            </div>
            <div className="adm-header-badge adm-badge-online">
              <div className="adm-header-badge-dot" style={{ background: "#3cb35a" }} />
              System Online
            </div>
          </div>
          <div className="adm-content">
            {active === "dashboard"  && <DashboardPanel />}
            {active === "categories" && <WasteCategoriesPanel />}
            {active === "users"      && <UserManagementPanel />}
            {active === "ai"         && <AILogsPanel />}
            {active === "api"        && <APILogsPanel />}
            {active === "tips"       && <TipsPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}