import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from './Logo/EcoSnap_LOGO_4.png';
import './admin.css';

const API = "http://localhost:8080";

const Icons = {
  dashboard: (<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>),
  categories: (<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>),
  users: (<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>),
  ai: (<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>),
  tips: (<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>),
  api: (<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>),
  feedback: (<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>),
};

const SIDEBAR = [
  { group: "Overview",   items: [{ id: "dashboard",  label: "Dashboard",        icon: Icons.dashboard }] },
  { group: "Management", items: [{ id: "categories", label: "Waste Categories",  icon: Icons.categories }, { id: "users", label: "User Management", icon: Icons.users }] },
  { group: "Logs",       items: [{ id: "ai",  label: "AI Training Logs", icon: Icons.ai }, { id: "api", label: "API Logs", icon: Icons.api }] },
  { group: "Content",    items: [{ id: "tips", label: "Tips and Facts", icon: Icons.tips }] },
  { group: "Feedback",   items: [{ id: "feedback", label: "User Feedbacks", icon: Icons.feedback }] },
];

const ArrowUpIcon = () => (<svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>);
const RefreshIcon = () => (<svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>);

// ─── Donut Chart ──────────────────────────────────────────────────
function DonutChart({ recyclablePct }) {
  const pct = recyclablePct ?? 0;
  const r = 35, cx = 50, cy = 50, circumference = 2 * Math.PI * r;
  const nonRecyclablePct = Math.max(0, 1 - pct - 0.115);
  const segments = [
    { pct, color: "#3cb35a" },
    { pct: nonRecyclablePct, color: "#60a5fa" },
    { pct: Math.min(0.115, 1 - pct - nonRecyclablePct), color: "#f9a8d4" },
  ];
  let offset = 0;
  const arcs = segments.map((seg) => {
    const dashArray = seg.pct * circumference;
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
            style={{ transition: "stroke-dasharray 0.5s ease" }} />
        ))}
      </svg>
      <div style={{ position: "absolute", textAlign: "center", fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a1a" }}>{(pct * 100).toFixed(1)}%</div>
        <div style={{ fontSize: 8, color: "#6b7280", fontWeight: 600 }}>Recyclable</div>
      </div>
    </div>
  );
}

// ─── Dashboard Panel ──────────────────────────────────────────────
function DashboardPanel() {
  const [stats, setStats]         = useState(null);
  const [barData, setBarData]     = useState([]);
  const [donutData, setDonutData] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/users/all`).then((r) => r.json()),
      fetch(`${API}/api/scanner/history/all`).then((r) => r.json()),
    ])
      .then(([users, scans]) => {
        const totalUsers  = users.length;
        const validScans  = scans.filter((s) => !s.invalidScan);
        const totalScans  = validScans.length;
        const recyclable  = validScans.filter((s) => s.category?.toLowerCase() === "recyclable").length;
        const recyclablePct = totalScans > 0 ? ((recyclable / totalScans) * 100).toFixed(1) : "0.0";
        const categories  = [...new Set(validScans.map((s) => s.category).filter(Boolean))];

        setStats([
          { value: totalUsers.toLocaleString(),  label: "Total Users",      change: "Registered accounts",     changeType: "up" },
          { value: totalScans.toLocaleString(),   label: "Total Scans",      change: "Valid waste scans",        changeType: "up" },
          { value: recyclable.toLocaleString(),   label: "Recyclable Items", change: `${recyclablePct}% of all scans`, changeType: "up" },
          { value: categories.length.toString(),  label: "Waste Categories", change: "Distinct types detected",  changeType: "neutral" },
        ]);

        const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const counts = Array(7).fill(0);
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        validScans.forEach((s) => {
          const d = new Date(s.scannedAt);
          if (d >= startOfWeek) counts[d.getDay()] += 1;
        });
        setBarData(DAY_LABELS.map((day, i) => ({ day, value: counts[i] })));

        const nonRecyclable = validScans.filter((s) => s.category?.toLowerCase() === "residual / non-recyclable").length;
        const other = totalScans - recyclable - nonRecyclable;
        setDonutData({
          recyclablePct: totalScans > 0 ? recyclable / totalScans : 0,
          items: [
            { color: "#3cb35a", label: "Recyclable",     pct: totalScans > 0 ? `${recyclablePct}%` : "0%" },
            { color: "#60a5fa", label: "Non-Recyclable", pct: totalScans > 0 ? `${((nonRecyclable / totalScans) * 100).toFixed(1)}%` : "0%" },
            { color: "#f9a8d4", label: "Other",          pct: totalScans > 0 ? `${((other / totalScans) * 100).toFixed(1)}%` : "0%" },
          ],
        });
        setLoading(false);
      })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <div className="adm-panel"><p className="adm-empty">Loading dashboard…</p></div>;
  if (error)   return <div className="adm-panel"><p className="adm-empty" style={{ color: "#ef4444" }}>Error: {error}</p></div>;

  const maxBar = Math.max(...barData.map((d) => d.value), 1);

  return (
    <div className="adm-panel">
      <h2 className="adm-panel-title">Dashboard Overview</h2>
      <div className="adm-stats-grid">
        {stats.map((stat) => (
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
            <svg viewBox="0 0 20 20" fill="#6b7280" width="15" height="15"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
            Scans Per Day (This Week)
          </h4>
          <div className="adm-bar-chart">
            {barData.map((d, i) => {
              const h = (d.value / maxBar) * 78;
              const today = new Date().getDay();
              return (
                <div key={d.day} className="adm-bar-col">
                  <div className="adm-bar" title={`${d.value} scans`}
                    style={{ height: Math.max(h, 2), background: i === today ? "#3cb35a" : "#2d7a3a" }} />
                  <div className="adm-bar-label">{d.day}</div>
                </div>
              );
            })}
          </div>
          {barData.every((d) => d.value === 0) && (
            <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 8 }}>No scans recorded this week yet.</p>
          )}
        </div>
        <div className="adm-section-card">
          <h4 className="adm-card-title">
            <svg viewBox="0 0 20 20" fill="#6b7280" width="15" height="15"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>
            Scan Categories
          </h4>
          <DonutChart recyclablePct={donutData?.recyclablePct ?? 0} />
          <div className="adm-donut-legend">
            {donutData?.items.map((item) => (
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

// ─── Waste Categories Panel (real API + full CRUD) ────────────────
const EMOJI_OPTIONS = ["♻️","🌿","🗑️","⚠️","🔌","🧴","📄","🫙","🥫","🍂","💻","💧","🧱","👕","❓","📦","🔵","🧪","🛢️","🪣"];
const DEFAULT_COLOR = "#3cb35a";

function CategoryModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?.id;
  const [form, setForm]     = useState(initial ?? { name: "", emoji: "♻️", color: DEFAULT_COLOR, active: true });
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState(null);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () => {
    if (!form.name?.trim()) { setErr("Category name is required."); return; }
    setSaving(true); setErr(null);
    const url    = isEdit ? `${API}/api/categories/${form.id}` : `${API}/api/categories`;
    const method = isEdit ? "PUT" : "POST";
    fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      .then((res) => res.json().then((d) => ({ ok: res.ok, d })))
      .then(({ ok, d }) => { if (!ok) throw new Error(d.message || "Save failed"); onSaved(d, isEdit); onClose(); })
      .catch((e) => { setErr(e.message); setSaving(false); });
  };

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="adm-modal-header">
          <h3 className="adm-modal-title">{isEdit ? "Edit Category" : "Add Category"}</h3>
          <button className="adm-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="adm-modal-body">
          <div className="adm-modal-row">
            <div className="adm-modal-field" style={{ flex: "0 0 90px" }}>
              <label className="adm-modal-label">Emoji</label>
              <select className="adm-modal-input" name="emoji" value={form.emoji} onChange={handle}
                style={{ fontSize: 20, textAlign: "center" }}>
                {EMOJI_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="adm-modal-field">
              <label className="adm-modal-label">
                Name * <span className="adm-modal-hint">(AI uses this exactly)</span>
              </label>
              <input className="adm-modal-input" name="name" value={form.name} onChange={handle}
                placeholder="e.g. Recyclable" />
            </div>
          </div>
          <div className="adm-modal-field">
            <label className="adm-modal-label">Color</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" name="color" value={form.color ?? DEFAULT_COLOR} onChange={handle}
                style={{ width: 40, height: 36, padding: 2, border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer" }} />
              <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>{form.color ?? DEFAULT_COLOR}</span>
            </div>
          </div>
          {err && <p className="adm-modal-error">{err}</p>}
        </div>
        <div className="adm-modal-footer">
          <button className="adm-btn-sm" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="adm-btn-primary" onClick={submit} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WasteCategoriesPanel() {
  const [cats, setCats]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [modal, setModal]     = useState(null);

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((r) => { if (!r.ok) throw new Error(`Server error ${r.status}`); return r.json(); })
      .then((data) => { setCats(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const handleSaved = (saved, isEdit) =>
    setCats((prev) => isEdit ? prev.map((c) => c.id === saved.id ? saved : c) : [...prev, saved]);

  const handleToggle = (id) => {
    fetch(`${API}/api/categories/${id}/toggle`, { method: "PUT" })
      .then((r) => r.json())
      .then((updated) => setCats((prev) => prev.map((c) => c.id === updated.id ? updated : c)))
      .catch((e) => setError(e.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this category? Existing scans with this label will keep it.")) return;
    fetch(`${API}/api/categories/${id}`, { method: "DELETE" })
      .then((r) => { if (!r.ok) throw new Error("Delete failed"); })
      .then(() => setCats((prev) => prev.filter((c) => c.id !== id)))
      .catch((e) => setError(e.message));
  };

  return (
    <div className="adm-panel">
      {modal !== null && (
        <CategoryModal
          initial={modal?.id ? modal : null}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      <div className="adm-panel-header">
        <h2 className="adm-panel-title">Waste Categories</h2>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <button className="adm-btn-primary" onClick={() => setModal({})}>+ Add Category</button>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>
            ⚠️ Active categories are used by the AI scanner
          </span>
        </div>
      </div>

      <div className="adm-section-card">
        {loading && <p className="adm-empty">Loading categories…</p>}
        {error   && <p className="adm-empty" style={{ color: "#ef4444" }}>Error: {error}</p>}
        {!loading && !error && cats.length === 0 && (
          <p className="adm-empty">No categories yet. Click "+ Add Category" to create one.</p>
        )}
        {!loading && !error && cats.length > 0 && (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Color</th>
                <th>Active (AI uses)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((cat) => (
                <tr key={cat.id} style={{ opacity: cat.active ? 1 : 0.45 }}>
                  <td>
                    <div className="adm-cat-name">
                      <span style={{ fontSize: 20 }}>{cat.emoji ?? "📦"}</span>
                      <span style={{ fontWeight: 500 }}>{cat.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4,
                                    background: cat.color ?? DEFAULT_COLOR,
                                    border: "1px solid rgba(0,0,0,0.1)" }} />
                      <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>
                        {cat.color ?? DEFAULT_COLOR}
                      </span>
                    </div>
                  </td>
                  <td>
                    <label className="adm-toggle" title={cat.active ? "Active – AI uses this" : "Inactive – AI skips this"}>
                      <input type="checkbox" checked={cat.active} onChange={() => handleToggle(cat.id)} />
                      <span className="adm-toggle-slider" />
                    </label>
                  </td>
                  <td>
                    <div className="adm-action-row">
                      <button className="adm-btn-sm" onClick={() => setModal(cat)}>Edit</button>
                      <button className="adm-btn-sm adm-btn-danger" onClick={() => handleDelete(cat.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── User Management Panel ────────────────────────────────────────
const EMPTY_USER_FORM = { firstName: "", lastName: "", username: "", email: "", password: "" };

function AddUserModal({ onClose, onAdded }) {
  const [form, setForm]     = useState(EMPTY_USER_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState(null);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) { setErr("First name, last name, email and password are required."); return; }
    setSaving(true); setErr(null);
    fetch(`${API}/api/users/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => { if (!ok) throw new Error(data.message || "Registration failed"); onAdded(data); onClose(); })
      .catch((e) => { setErr(e.message); setSaving(false); });
  };
  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header"><h3 className="adm-modal-title">Add New User</h3><button className="adm-modal-close" onClick={onClose}>✕</button></div>
        <div className="adm-modal-body">
          <div className="adm-modal-row">
            <div className="adm-modal-field"><label className="adm-modal-label">First Name *</label><input className="adm-modal-input" name="firstName" value={form.firstName} onChange={handle} placeholder="Juan" /></div>
            <div className="adm-modal-field"><label className="adm-modal-label">Last Name *</label><input className="adm-modal-input" name="lastName" value={form.lastName} onChange={handle} placeholder="dela Cruz" /></div>
          </div>
          <div className="adm-modal-field"><label className="adm-modal-label">Username</label><input className="adm-modal-input" name="username" value={form.username} onChange={handle} placeholder="juandc (optional)" /></div>
          <div className="adm-modal-field"><label className="adm-modal-label">Email * <span className="adm-modal-hint">(use @ecosnapadmin.com for Admin role)</span></label><input className="adm-modal-input" name="email" type="email" value={form.email} onChange={handle} placeholder="juan@gmail.com" /></div>
          <div className="adm-modal-field"><label className="adm-modal-label">Password *</label><input className="adm-modal-input" name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" /></div>
          {err && <p className="adm-modal-error">{err}</p>}
        </div>
        <div className="adm-modal-footer"><button className="adm-btn-sm" onClick={onClose} disabled={saving}>Cancel</button><button className="adm-btn-primary" onClick={submit} disabled={saving}>{saving ? "Adding…" : "Add User"}</button></div>
      </div>
    </div>
  );
}

function EmailChangeRequests({ users, onApprove, onReject }) {
  const pending = users.filter((u) => u.emailChangeRequested === true);
  if (pending.length === 0) return null;
  return (
    <div className="adm-section-card" style={{ marginBottom: 24, border: "1.5px solid #f59e0b", borderRadius: 12 }}>
      <h4 className="adm-card-title" style={{ color: "#b45309", marginBottom: 14 }}>⏳ Pending Email Change Requests ({pending.length})</h4>
      <table className="adm-table">
        <thead><tr><th>User</th><th>Current Email</th><th>Requested Email</th><th>Actions</th></tr></thead>
        <tbody>
          {pending.map((u) => (
            <tr key={u.id}>
              <td><strong>{u.firstName} {u.lastName}</strong></td>
              <td className="adm-muted">{u.email}</td>
              <td style={{ color: "#2563eb", fontWeight: 500 }}>{u.pendingEmail}</td>
              <td><div className="adm-action-row"><button className="adm-btn-sm adm-btn-save" onClick={() => onApprove(u.id)}>✅ Approve</button><button className="adm-btn-sm adm-btn-danger" onClick={() => onReject(u.id)}>❌ Reject</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserManagementPanel() {
  const [users, setUsers]         = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    fetch(`${API}/api/users/all`)
      .then((res) => { if (!res.ok) throw new Error(`Server error: ${res.status}`); return res.json(); })
      .then((data) => { setUsers(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const handleRemove  = (id) => { fetch(`${API}/api/users/delete/${id}`, { method: "DELETE" }).then((res) => { if (!res.ok) throw new Error("Failed to delete user"); }).then(() => setUsers((p) => p.filter((u) => u.id !== id))).catch((err) => setError(err.message)); };
  const handleApprove = (id) => { fetch(`${API}/api/users/${id}/approve-email-change`, { method: "POST" }).then((res) => { if (!res.ok) throw new Error("Approval failed"); return res.json(); }).then((updated) => { setUsers((p) => p.map((u) => u.id === updated.id ? updated : u)); showToast(`✅ Email change approved for ${updated.firstName} ${updated.lastName}`); }).catch((err) => setError(err.message)); };
  const handleReject  = (id) => { fetch(`${API}/api/users/${id}/reject-email-change`, { method: "POST" }).then((res) => { if (!res.ok) throw new Error("Rejection failed"); return res.json(); }).then((updated) => { setUsers((p) => p.map((u) => u.id === updated.id ? updated : u)); showToast(`❌ Email change request rejected for ${updated.firstName} ${updated.lastName}`, "error"); }).catch((err) => setError(err.message)); };

  const formatDate = (dateStr) => { if (!dateStr) return "—"; return new Date(dateStr).toLocaleString("default", { month: "short", year: "numeric" }); };
  const filtered = users.filter((u) => { const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase(); const email = (u.email ?? "").toLowerCase(); const q = search.toLowerCase(); return fullName.includes(q) || email.includes(q); });

  return (
    <div className="adm-panel">
      {toast && (<div style={{ position: "fixed", top: 20, right: 24, zIndex: 9999, background: toast.type === "error" ? "#fef2f2" : "#f0fdf4", color: toast.type === "error" ? "#b91c1c" : "#15803d", border: `1px solid ${toast.type === "error" ? "#fca5a5" : "#86efac"}`, borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>{toast.msg}</div>)}
      {showModal && <AddUserModal onClose={() => setShowModal(false)} onAdded={(u) => setUsers((p) => [...p, u])} />}
      <div className="adm-panel-header">
        <h2 className="adm-panel-title">User Management</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="adm-search-wrap"><input className="adm-search" placeholder="Search users…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <button className="adm-btn-primary" onClick={() => setShowModal(true)}>+ Add User</button>
        </div>
      </div>
      {!loading && !error && <EmailChangeRequests users={users} onApprove={handleApprove} onReject={handleReject} />}
      <div className="adm-section-card">
        {loading && <p className="adm-empty">Loading users…</p>}
        {error   && <p className="adm-empty" style={{ color: "#ef4444" }}>Error: {error}</p>}
        {!loading && !error && (
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.firstName} {u.lastName}</strong>{u.emailChangeRequested && <span style={{ marginLeft: 8, fontSize: 11, background: "#fef9c3", color: "#b45309", padding: "2px 6px", borderRadius: 4, border: "1px solid #fde047" }}>⏳ Email pending</span>}</td>
                  <td className="adm-muted">{u.email}</td>
                  <td><span className={`adm-role-badge adm-role-badge--${(u.role ?? "user").toLowerCase()}`}>{u.role ?? "User"}</span></td>
                  <td className="adm-muted">{formatDate(u.createdAt)}</td>
                  <td><div className="adm-action-row"><button className="adm-btn-sm adm-btn-danger" onClick={() => handleRemove(u.id)}>Remove</button></div></td>
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

// ─── AI Training Logs Panel ───────────────────────────────────────
const CONFIDENCE_COLOR = (c) => { const s = (c ?? "").toLowerCase(); if (s === "high") return "#3cb35a"; if (s === "medium") return "#f59e0b"; return "#ef4444"; };
const CONFIDENCE_NUM   = (c) => { const s = (c ?? "").toLowerCase(); if (s === "high") return 90 + Math.floor(Math.random() * 10); if (s === "medium") return 70 + Math.floor(Math.random() * 20); return 40 + Math.floor(Math.random() * 30); };

function AILogsPanel() {
  const [scans, setScans]         = useState([]);
  const [catMeta, setCatMeta]     = useState({});
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("all");

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/scanner/history/all`).then((r) => { if (!r.ok) throw new Error(`Server error: ${r.status}`); return r.json(); }),
      fetch(`${API}/api/categories`).then((r) => r.json()).catch(() => []),
    ]).then(([data, cats]) => {
      setScans(data.filter((s) => !s.invalidScan));
      // Build color map from admin-configured categories
      const meta = {};
      cats.forEach((c) => { meta[c.name] = { color: c.color ?? "#6b7280", emoji: c.emoji ?? "📦" }; });
      setCatMeta(meta);
      setLoading(false);
    }).catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const formatTime = (ts) => { if (!ts) return "—"; return new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }); };
  const categories = ["all", ...new Set(scans.map((s) => s.category).filter(Boolean))];
  const filtered = scans.filter((s) => {
    const matchCat = catFilter === "all" || s.category === catFilter;
    const q = search.toLowerCase();
    return matchCat && (!q || (s.item ?? "").toLowerCase().includes(q) || (s.category ?? "").toLowerCase().includes(q));
  });

  return (
    <div className="adm-panel">
      <div className="adm-panel-header">
        <h2 className="adm-panel-title">AI Training Logs</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
            className="adm-modal-input" style={{ padding: "6px 10px", fontSize: 13, width: "auto", minWidth: 160 }}>
            {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
          </select>
          <div className="adm-search-wrap">
            <input className="adm-search" placeholder="Search item…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="adm-section-card">
        {loading && <p className="adm-empty">Loading scan logs…</p>}
        {error   && <p className="adm-empty" style={{ color: "#ef4444" }}>Error: {error}</p>}
        {!loading && !error && filtered.length === 0 && <p className="adm-empty">No scan records found.</p>}
        {!loading && !error && filtered.length > 0 && (
          <table className="adm-table">
            <thead><tr><th>Timestamp</th><th>Item Detected</th><th>Category</th><th>Confidence</th><th>Recyclable</th><th>Waste Diverted</th></tr></thead>
            <tbody>
              {filtered.map((scan) => {
                const meta      = catMeta[scan.category] ?? { color: "#6b7280", emoji: "📦" };
                const confNum   = CONFIDENCE_NUM(scan.confidence);
                const confColor = CONFIDENCE_COLOR(scan.confidence);
                return (
                  <tr key={scan.id}>
                    <td className="adm-muted" style={{ fontFamily: "monospace", fontSize: 12, whiteSpace: "nowrap" }}>{formatTime(scan.scannedAt)}</td>
                    <td style={{ fontWeight: 500, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{scan.item ?? "—"}</td>
                    <td>
                      <span className="adm-result-badge" style={{ background: meta.color + "22", color: meta.color, border: `1px solid ${meta.color}44` }}>
                        {meta.emoji} {scan.category ?? "Unknown"}
                      </span>
                    </td>
                    <td>
                      <div className="adm-conf-row">
                        <div className="adm-conf-bar"><div className="adm-conf-fill" style={{ width: `${confNum}%`, background: confColor }} /></div>
                        <span className="adm-conf-num" style={{ color: confColor }}>{scan.confidence ?? "—"}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {scan.recyclable ? <span style={{ color: "#16a34a", fontWeight: 600 }}>✅</span> : <span style={{ color: "#dc2626", fontWeight: 600 }}>❌</span>}
                    </td>
                    <td>
                      {scan.wasteDiverted != null ? (
                        <div className="adm-conf-row">
                          <div className="adm-conf-bar"><div className="adm-conf-fill" style={{ width: `${scan.wasteDiverted}%`, background: scan.wasteDiverted >= 75 ? "#22c55e" : scan.wasteDiverted >= 40 ? "#f59e0b" : "#ef4444" }} /></div>
                          <span className="adm-conf-num">{scan.wasteDiverted}%</span>
                        </div>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && !error && filtered.length > 0 && (
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12, textAlign: "right" }}>
            Showing {filtered.length} of {scans.length} scan{scans.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── API Logs Panel ───────────────────────────────────────────────
const METHOD_COLORS = { GET: "#3b82f6", POST: "#3cb35a", PUT: "#f59e0b", DELETE: "#ef4444" };
const STATUS_COLOR  = (s) => s < 300 ? "#3cb35a" : s < 400 ? "#f59e0b" : "#ef4444";

function APILogsPanel() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  useEffect(() => {
    fetch(`${API}/api/logs`)
      .then((res) => { if (!res.ok) throw new Error(`Server error: ${res.status}`); return res.json(); })
      .then((data) => { setLogs(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);
  const formatTime = (ts) => { if (!ts) return "—"; return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }); };
  return (
    <div className="adm-panel">
      <h2 className="adm-panel-title">API Logs</h2>
      <div className="adm-section-card">
        {loading && <p className="adm-empty">Loading logs…</p>}
        {error   && <p className="adm-empty" style={{ color: "#ef4444" }}>Error: {error}</p>}
        {!loading && !error && logs.length === 0 && <p className="adm-empty">No API logs recorded yet.</p>}
        {!loading && !error && logs.length > 0 && (
          <table className="adm-table">
            <thead><tr><th>Time</th><th>Method</th><th>Endpoint</th><th>Status</th><th>Latency</th></tr></thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="adm-muted" style={{ fontFamily: "monospace", fontSize: 12 }}>{formatTime(log.timestamp)}</td>
                  <td><span className="adm-method-badge" style={{ background: (METHOD_COLORS[log.method] ?? "#6b7280") + "22", color: METHOD_COLORS[log.method] ?? "#6b7280", border: `1px solid ${(METHOD_COLORS[log.method] ?? "#6b7280") + "44"}` }}>{log.method}</span></td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{log.endpoint}</td>
                  <td><span className="adm-status-badge" style={{ background: STATUS_COLOR(log.status) + "22", color: STATUS_COLOR(log.status), border: `1px solid ${STATUS_COLOR(log.status) + "44"}` }}>{log.status}</span></td>
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

// ─── Tips Panel ───────────────────────────────────────────────────
const EMPTY_TIP = { category: "", title: "", description: "", fact: "", icon: "♻️", active: true };
const TIP_CATEGORY_OPTIONS = ["General", "Plastics", "Organics", "Hazardous", "Electronics", "Paper", "Glass"];

function TipModal({ initial, onClose, onSaved }) {
  const [form, setForm]     = useState(initial ?? EMPTY_TIP);
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState(null);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = () => {
    if (!form.title || !form.description || !form.category) { setErr("Title, category, and description are required."); return; }
    setSaving(true); setErr(null);
    const isEdit = !!form.id;
    const url = isEdit ? `${API}/api/tips/update/${form.id}` : `${API}/api/tips/create`;
    fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      .then((res) => { if (!res.ok) return res.text().then((text) => { throw new Error(`${res.status} — ${text || "Server error"}`); }); return res.json(); })
      .then((saved) => { onSaved(saved, isEdit); onClose(); })
      .catch((e) => { setErr(e.message); setSaving(false); });
  };
  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div className="adm-modal-header"><h3 className="adm-modal-title">{form.id ? "Edit Tip" : "Add New Tip"}</h3><button className="adm-modal-close" onClick={onClose}>✕</button></div>
        <div className="adm-modal-body">
          <div className="adm-modal-row">
            <div className="adm-modal-field" style={{ flex: "0 0 90px" }}><label className="adm-modal-label">Icon</label><input className="adm-modal-input" name="icon" value={form.icon} onChange={handle} placeholder="♻️" style={{ textAlign: "center", fontSize: 20 }} /></div>
            <div className="adm-modal-field"><label className="adm-modal-label">Category *</label><select className="adm-modal-input" name="category" value={form.category} onChange={handle}><option value="">— Select —</option>{TIP_CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          <div className="adm-modal-field"><label className="adm-modal-label">Title *</label><input className="adm-modal-input" name="title" value={form.title} onChange={handle} placeholder="e.g. Plastic Recycling Tips" /></div>
          <div className="adm-modal-field"><label className="adm-modal-label">Description *</label><textarea className="adm-modal-input" name="description" value={form.description} onChange={handle} placeholder="Main tip text shown to users…" rows={3} style={{ resize: "vertical", fontFamily: "inherit" }} /></div>
          <div className="adm-modal-field"><label className="adm-modal-label">Fun Fact <span className="adm-modal-hint">(optional)</span></label><textarea className="adm-modal-input" name="fact" value={form.fact} onChange={handle} placeholder="Did you know…" rows={2} style={{ resize: "vertical", fontFamily: "inherit" }} /></div>
          {err && <p className="adm-modal-error">{err}</p>}
        </div>
        <div className="adm-modal-footer"><button className="adm-btn-sm" onClick={onClose} disabled={saving}>Cancel</button><button className="adm-btn-primary" onClick={submit} disabled={saving}>{saving ? "Saving…" : form.id ? "Save Changes" : "Add Tip"}</button></div>
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
    fetch(`${API}/api/tips/all`)
      .then((res) => { if (!res.ok) throw new Error("Failed to load tips"); return res.json(); })
      .then((data) => { setTips(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);
  const handleSaved  = (saved, isEdit) => setTips((prev) => isEdit ? prev.map((t) => t.id === saved.id ? saved : t) : [...prev, saved]);
  const handleToggle = (id) => { fetch(`${API}/api/tips/toggle/${id}`, { method: "PUT" }).then((res) => { if (!res.ok) throw new Error("Toggle failed"); return res.json(); }).then((updated) => setTips((prev) => prev.map((t) => t.id === updated.id ? updated : t))).catch((e) => setError(e.message)); };
  const handleDelete = (id) => {
    if (!window.confirm("Delete this tip? This cannot be undone.")) return;
    fetch(`${API}/api/tips/delete/${id}`, { method: "DELETE" }).then((res) => { if (!res.ok) throw new Error("Delete failed"); }).then(() => setTips((prev) => prev.filter((t) => t.id !== id))).catch((e) => setError(e.message));
  };
  return (
    <div className="adm-panel">
      {modal !== null && <TipModal initial={modal} onClose={() => setModal(null)} onSaved={handleSaved} />}
      <div className="adm-panel-header"><h2 className="adm-panel-title">Tips and Facts</h2><button className="adm-btn-primary" onClick={() => setModal({ ...EMPTY_TIP })}>+ Add Tip</button></div>
      <div className="adm-section-card">
        {loading && <p className="adm-empty">Loading tips…</p>}
        {error   && <p className="adm-empty" style={{ color: "#ef4444" }}>Error: {error}</p>}
        {!loading && !error && tips.map((tip) => (
          <div key={tip.id} className="adm-tip-row">
            <div className="adm-tip-info">
              <span className="adm-tip-category">{tip.icon && <span style={{ marginRight: 5 }}>{tip.icon}</span>}{tip.category}</span>
              <strong style={{ display: "block", fontSize: 13, marginBottom: 3, color: "#111" }}>{tip.title}</strong>
              <p className="adm-tip-text">{tip.description}</p>
              {tip.fact && <p className="adm-tip-text" style={{ fontStyle: "italic", color: "#6b7280", marginTop: 2 }}>💡 {tip.fact}</p>}
            </div>
            <div className="adm-action-row" style={{ flexShrink: 0, gap: 8, alignItems: "center" }}>
              <label className="adm-toggle" title={tip.active ? "Active" : "Inactive"}><input type="checkbox" checked={tip.active} onChange={() => handleToggle(tip.id)} /><span className="adm-toggle-slider" /></label>
              <button className="adm-btn-sm" onClick={() => setModal({ ...tip })}>Edit</button>
              <button className="adm-btn-sm adm-btn-danger" onClick={() => handleDelete(tip.id)}>Delete</button>
            </div>
          </div>
        ))}
        {!loading && !error && tips.length === 0 && <p className="adm-empty">No tips yet. Click "+ Add Tip" to create one.</p>}
      </div>
    </div>
  );
}

// ─── Feedbacks Panel ──────────────────────────────────────────────
const STAR_COLORS = { 5: "#22c55e", 4: "#84cc16", 3: "#f59e0b", 2: "#f97316", 1: "#ef4444" };

function FeedbacksPanel() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [filter, setFilter]       = useState("all");

  useEffect(() => {
    fetch(`${API}/api/feedback/all`)
      .then((res) => { if (!res.ok) throw new Error("Failed to load feedbacks"); return res.json(); })
      .then((data) => { setFeedbacks(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const handleResolve = (id) => { fetch(`${API}/api/feedback/${id}/resolve`, { method: "PUT" }).then((res) => { if (!res.ok) throw new Error("Failed to resolve"); return res.json(); }).then((updated) => setFeedbacks((prev) => prev.map((f) => f.id === updated.id ? updated : f))).catch((e) => setError(e.message)); };
  const handleDelete  = (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    fetch(`${API}/api/feedback/${id}`, { method: "DELETE" }).then((res) => { if (!res.ok) throw new Error("Delete failed"); }).then(() => setFeedbacks((prev) => prev.filter((f) => f.id !== id))).catch((e) => setError(e.message));
  };

  const formatDate = (dateStr) => { if (!dateStr) return "—"; return new Date(dateStr).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }); };
  const filtered = filter === "all" ? feedbacks : filter === "unresolved" ? feedbacks.filter((f) => !f.resolved) : feedbacks.filter((f) => f.resolved);
  const unresolvedCount = feedbacks.filter((f) => !f.resolved).length;

  return (
    <div className="adm-panel">
      <div className="adm-panel-header">
        <h2 className="adm-panel-title">User Feedbacks</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "unresolved", "resolved"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={filter === f ? "adm-btn-primary" : "adm-btn-sm"} style={{ textTransform: "capitalize" }}>
              {f}{f === "unresolved" && unresolvedCount > 0 ? ` (${unresolvedCount})` : ""}
            </button>
          ))}
        </div>
      </div>
      <div className="adm-section-card">
        {loading && <p className="adm-empty">Loading feedbacks…</p>}
        {error   && <p className="adm-empty" style={{ color: "#ef4444" }}>Error: {error}</p>}
        {!loading && !error && filtered.length === 0 && <p className="adm-empty">No feedbacks found.</p>}
        {!loading && !error && filtered.map((fb) => (
          <div key={fb.id} style={{ borderBottom: "1px solid #f0f0f0", padding: "16px 0", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#2e7d32", fontSize: 15, flexShrink: 0 }}>{fb.userName?.[0]?.toUpperCase() ?? "?"}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                <strong style={{ fontSize: 14, color: "#111" }}>{fb.userName}</strong>
                <span style={{ fontSize: 12, color: "#888" }}>{fb.userEmail}</span>
                <span style={{ fontSize: 12, color: "#aaa" }}>{formatDate(fb.submittedAt)}</span>
                {fb.resolved ? <span style={{ fontSize: 11, background: "#dcfce7", color: "#16a34a", padding: "2px 8px", borderRadius: 4, border: "1px solid #bbf7d0" }}>✅ Resolved</span> : <span style={{ fontSize: 11, background: "#fef9c3", color: "#b45309", padding: "2px 8px", borderRadius: 4, border: "1px solid #fde047" }}>⏳ Open</span>}
              </div>
              <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                {[1, 2, 3, 4, 5].map((s) => (<span key={s} style={{ fontSize: 16, color: s <= fb.rating ? (STAR_COLORS[fb.rating] ?? "#f59e0b") : "#e5e7eb" }}>★</span>))}
                <span style={{ fontSize: 12, color: "#888", marginLeft: 6 }}>{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][fb.rating]}</span>
              </div>
              {fb.categories && (<div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>{fb.categories.split(",").map((cat) => cat.trim()).filter(Boolean).map((cat) => (<span key={cat} style={{ fontSize: 11, background: "#f0faf3", color: "#2e7d32", border: "1px solid #c8e6c9", borderRadius: 4, padding: "2px 8px" }}>{cat}</span>))}</div>)}
              {fb.message && <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.55 }}>{fb.message}</p>}
            </div>
            <div className="adm-action-row" style={{ flexShrink: 0, flexDirection: "column", gap: 6 }}>
              {!fb.resolved && <button className="adm-btn-sm adm-btn-save" onClick={() => handleResolve(fb.id)}>Mark resolved</button>}
              <button className="adm-btn-sm adm-btn-danger" onClick={() => handleDelete(fb.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Profile Edit Modal ───────────────────────────────────────────
function ProfileEditModal({ user, onClose, onSaved }) {
  const [tab, setTab]                   = useState("profile");
  const [profileForm, setProfileForm]   = useState({ firstName: user?.firstName || "", lastName: user?.lastName || "", email: user?.email || "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving]             = useState(false);
  const [err, setErr]                   = useState(null);
  const [success, setSuccess]           = useState(null);

  const handleProfileChange  = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const submitProfileUpdate = () => {
    if (!profileForm.firstName || !profileForm.lastName || !profileForm.email) { setErr("All fields are required."); return; }
    setSaving(true); setErr(null); setSuccess(null);
    fetch(`${API}/api/users/${user.id}/profile`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profileForm) })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => { if (!ok) throw new Error(data.message || "Update failed"); setSuccess("Profile updated successfully!"); onSaved(data); setTimeout(() => onClose(), 1500); })
      .catch((e) => { setErr(e.message); setSaving(false); });
  };

  const submitPasswordChange = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) { setErr("All password fields are required."); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setErr("New passwords do not match."); return; }
    if (passwordForm.newPassword.length < 6) { setErr("New password must be at least 6 characters."); return; }
    setSaving(true); setErr(null); setSuccess(null);
    fetch(`${API}/api/users/${user.id}/change-password`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }) })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => { if (!ok) throw new Error(data.message || "Password change failed"); setSuccess("Password changed successfully!"); setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); setTimeout(() => onClose(), 1500); })
      .catch((e) => { setErr(e.message); setSaving(false); });
  };

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
        <div className="adm-modal-header"><h3 className="adm-modal-title">Account Settings</h3><button className="adm-modal-close" onClick={onClose}>✕</button></div>
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", background: "#fafafa" }}>
          {["profile", "password"].map((t) => (
            <button key={t} onClick={() => { setTab(t); setErr(null); setSuccess(null); }} style={{ flex: 1, padding: "12px 16px", border: "none", background: "transparent", cursor: "pointer", fontWeight: tab === t ? 600 : 500, color: tab === t ? "#2563eb" : "#6b7280", borderBottom: tab === t ? "2px solid #2563eb" : "none", transition: "all 0.2s" }}>
              {t === "profile" ? "Profile" : "Change Password"}
            </button>
          ))}
        </div>
        <div className="adm-modal-body">
          {tab === "profile" && (<>
            <div className="adm-modal-field"><label className="adm-modal-label">First Name *</label><input className="adm-modal-input" name="firstName" value={profileForm.firstName} onChange={handleProfileChange} placeholder="Juan" /></div>
            <div className="adm-modal-field"><label className="adm-modal-label">Last Name *</label><input className="adm-modal-input" name="lastName" value={profileForm.lastName} onChange={handleProfileChange} placeholder="dela Cruz" /></div>
            <div className="adm-modal-field"><label className="adm-modal-label">Email *</label><input className="adm-modal-input" name="email" type="email" value={profileForm.email} onChange={handleProfileChange} placeholder="admin@ecosnapadmin.com" /></div>
          </>)}
          {tab === "password" && (<>
            <div className="adm-modal-field"><label className="adm-modal-label">Current Password *</label><input className="adm-modal-input" name="currentPassword" type="password" value={passwordForm.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" /></div>
            <div className="adm-modal-field"><label className="adm-modal-label">New Password *</label><input className="adm-modal-input" name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="••••••••" /></div>
            <div className="adm-modal-field"><label className="adm-modal-label">Confirm Password *</label><input className="adm-modal-input" name="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={handlePasswordChange} placeholder="••••••••" /></div>
          </>)}
          {err     && <p className="adm-modal-error">{err}</p>}
          {success && <p style={{ color: "#16a34a", fontSize: 13, fontWeight: 500, marginTop: 10 }}>✅ {success}</p>}
        </div>
        <div className="adm-modal-footer">
          <button className="adm-btn-sm" onClick={onClose} disabled={saving}>Close</button>
          <button className="adm-btn-primary" onClick={tab === "profile" ? submitProfileUpdate : submitPasswordChange} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function EcoSnapDashboard({ user }) {
  const navigate = useNavigate();
  const [active, setActive]                     = useState("dashboard");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser]           = useState(user);

  const handleLogout       = () => { localStorage.removeItem("user"); navigate("/login"); };
  const handleProfileSaved = (updatedUser) => { setCurrentUser(updatedUser); localStorage.setItem("user", JSON.stringify(updatedUser)); };

  const PANEL_TITLES = { dashboard: "Admin Analytics Dashboard", categories: "Waste Categories", users: "User Management", ai: "AI Training Logs", api: "API Logs", tips: "Tips and Facts", feedback: "User Feedbacks" };

  return (
    <div className="adm-root">
      {showProfileModal && <ProfileEditModal user={currentUser} onClose={() => setShowProfileModal(false)} onSaved={handleProfileSaved} />}
      <div className="adm-topbar" />
      <div className="adm-layout">
        <aside className="adm-sidebar">
          <div className="adm-logo"><img className="nav-logo-img" src={logo} alt="EcoSnap Logo" /></div>
          <nav className="adm-nav">
            {SIDEBAR.map(({ group, items }) => (
              <div key={group} className="adm-nav-group">
                <div className="adm-nav-group-label">{group}</div>
                {items.map((item) => (
                  <button key={item.id} className={`adm-nav-item${active === item.id ? " adm-nav-item--active" : ""}`} onClick={() => setActive(item.id)}>
                    <span className="adm-nav-item-icon">{item.icon}</span>{item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="adm-sidebar-footer">
            <button className="adm-admin-info" onClick={() => setShowProfileModal(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, width: "100%" }} title="Click to edit profile">
              <svg viewBox="0 0 20 20" fill="rgba(255,255,255,0.7)" width="20" height="20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
              {currentUser?.firstName || "Administrator"}
            </button>
            <button className="adm-logout-btn" onClick={handleLogout}>Log Out</button>
          </div>
        </aside>
        <main className="adm-main">
          <div className="adm-header">
            <h1 className="adm-header-title">{PANEL_TITLES[active]}</h1>
            <div className="adm-header-badge adm-badge-date"><div className="adm-header-badge-dot" style={{ background: "#3b82f6" }} />{new Date().toLocaleString("default", { month: "long", year: "numeric" })}</div>
            <div className="adm-header-badge adm-badge-online"><div className="adm-header-badge-dot" style={{ background: "#3cb35a" }} />System Online</div>
          </div>
          <div className="adm-content">
            {active === "dashboard"  && <DashboardPanel />}
            {active === "categories" && <WasteCategoriesPanel />}
            {active === "users"      && <UserManagementPanel />}
            {active === "ai"         && <AILogsPanel />}
            {active === "api"        && <APILogsPanel />}
            {active === "tips"       && <TipsPanel />}
            {active === "feedback"   && <FeedbacksPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}