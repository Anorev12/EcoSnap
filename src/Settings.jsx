import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./settings.css";

// ─── Sub-components ───────────────────────────────────────────────

function ProfilePanel() {
  const [form, setForm] = useState({
    firstName: "Juan",
    lastName: "Dela Cruz",
    bio: "",
    username: "@juandc",
  });
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="panel">
      <h2 className="panel-title">Profile</h2>

      <div className="section-card">
        <div className="avatar-row">
          <div className="avatar">JD</div>
          <div className="avatar-info">
            <p className="avatar-name">
              {form.firstName} {form.lastName}
            </p>
            <span className="avatar-sub">juan@example.com</span>
            <br />
            <button className="btn-sm">Change photo</button>
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label>First name</label>
            <input value={form.firstName} onChange={update("firstName")} />
          </div>
          <div className="field">
            <label>Last name</label>
            <input value={form.lastName} onChange={update("lastName")} />
          </div>
        </div>
        <div className="field">
          <label>Bio</label>
          <input
            value={form.bio}
            onChange={update("bio")}
            placeholder="Tell us a little about yourself…"
          />
        </div>
        <div className="field">
          <label>Username</label>
          <input value={form.username} onChange={update("username")} />
        </div>
      </div>

      <button className="save-btn">Save changes</button>
    </div>
  );
}

function SecurityPanel() {
  const [email, setEmail] = useState("juan@example.com");
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const updatePw = (k) => (e) => setPw({ ...pw, [k]: e.target.value });

  return (
    <div className="panel">
      <h2 className="panel-title">Account &amp; Security</h2>

      <div className="section-card">
        <h4 className="card-section-title">Email</h4>
        <div className="field">
          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="btn-sm">Update email</button>
      </div>

      <div className="section-card">
        <h4 className="card-section-title">Password</h4>
        <div className="field">
          <label>Current password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={pw.current}
            onChange={updatePw("current")}
          />
        </div>
        <div className="field">
          <label>New password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={pw.next}
            onChange={updatePw("next")}
          />
        </div>
        <div className="field">
          <label>Confirm new password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={pw.confirm}
            onChange={updatePw("confirm")}
          />
        </div>
        <button className="save-btn">Update password</button>
      </div>

      <div className="section-card">
        <h4 className="card-section-title">Danger zone</h4>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Delete account</div>
            <div className="toggle-sub">
              Permanently remove your account and all data
            </div>
          </div>
          <button className="danger-link">Delete</button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={on}
        onChange={() => setOn(!on)}
      />
      <span className="slider-t" />
    </label>
  );
}

function NotificationsPanel() {
  return (
    <div className="panel">
      <h2 className="panel-title">Notifications</h2>

      <div className="section-card">
        <h4 className="card-section-title">Push notifications</h4>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Scan reminders</div>
            <div className="toggle-sub">Daily nudge to scan items</div>
          </div>
          <Toggle defaultChecked />
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Eco tips</div>
            <div className="toggle-sub">Weekly sustainability tips</div>
          </div>
          <Toggle defaultChecked />
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Community updates</div>
            <div className="toggle-sub">New posts from people you follow</div>
          </div>
          <Toggle />
        </div>
      </div>

      <div className="section-card">
        <h4 className="card-section-title">Email notifications</h4>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Newsletter</div>
            <div className="toggle-sub">Monthly EcoSnap digest</div>
          </div>
          <Toggle defaultChecked />
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Product announcements</div>
            <div className="toggle-sub">New features and updates</div>
          </div>
          <Toggle />
        </div>
      </div>
    </div>
  );
}

function AppearancePanel() {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");
  const [accent, setAccent] = useState("#22c55e");
  const accents = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#ec4899"];

  return (
    <div className="panel">
      <h2 className="panel-title">Appearance</h2>

      <div className="section-card">
        <h4 className="card-section-title">Theme</h4>
        <div className="theme-grid">
          {["light", "dark", "system"].map((t) => (
            <div
              key={t}
              className={`theme-opt${theme === t ? " sel" : ""}`}
              onClick={() => setTheme(t)}
            >
              <span className="theme-icon">
                {t === "light" ? "☀️" : t === "dark" ? "🌙" : "⚙️"}
              </span>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>
      </div>

      <div className="section-card">
        <h4 className="card-section-title">Text size</h4>
        <div className="field">
          <label>Font size</label>
          <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      <div className="section-card">
        <h4 className="card-section-title">Accent color</h4>
        <div className="accent-row">
          {accents.map((c) => (
            <div
              key={c}
              className={`accent-swatch${accent === c ? " sel" : ""}`}
              style={{
                background: c,
                border: accent === c ? `2px solid ${c}` : "2px solid transparent",
              }}
              onClick={() => setAccent(c)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LanguagePanel() {
  return (
    <div className="panel">
      <h2 className="panel-title">Language &amp; Region</h2>

      <div className="section-card">
        <div className="field">
          <label>Language</label>
          <select defaultValue="en">
            <option value="en">English (US)</option>
            <option value="fil">Filipino</option>
            <option value="es">Español</option>
            <option value="ja">日本語</option>
          </select>
        </div>
        <div className="field">
          <label>Region</label>
          <select defaultValue="ph">
            <option value="ph">Philippines</option>
            <option value="us">United States</option>
            <option value="jp">Japan</option>
          </select>
        </div>
        <div className="field">
          <label>Time zone</label>
          <select defaultValue="manila">
            <option value="manila">Asia/Manila (UTC+8)</option>
            <option value="ny">America/New_York (UTC-5)</option>
            <option value="tokyo">Asia/Tokyo (UTC+9)</option>
          </select>
        </div>
        <div className="field">
          <label>Date format</label>
          <select defaultValue="mdy">
            <option value="mdy">MM/DD/YYYY</option>
            <option value="dmy">DD/MM/YYYY</option>
            <option value="ymd">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <button className="save-btn">Save preferences</button>
    </div>
  );
}

function PrivacyPanel() {
  return (
    <div className="panel">
      <h2 className="panel-title">Privacy &amp; Data</h2>

      <div className="section-card">
        <h4 className="card-section-title">Data sharing</h4>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Analytics</div>
            <div className="toggle-sub">Help improve EcoSnap with usage data</div>
          </div>
          <Toggle defaultChecked />
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Personalized suggestions</div>
            <div className="toggle-sub">Use scan history for recommendations</div>
          </div>
          <Toggle defaultChecked />
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Location data</div>
            <div className="toggle-sub">Used for nearby recycling centers</div>
          </div>
          <Toggle />
        </div>
      </div>

      <div className="section-card">
        <h4 className="card-section-title">Your data</h4>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Export my data</div>
            <div className="toggle-sub">Download a copy of your EcoSnap data</div>
          </div>
          <button className="btn-sm">Export</button>
        </div>
      </div>
    </div>
  );
}

function StoragePanel() {
  const used = 68;
  const total = 200;
  const pct = Math.round((used / total) * 100);

  return (
    <div className="panel">
      <h2 className="panel-title">Storage &amp; Usage</h2>

      <div className="section-card">
        <h4 className="card-section-title">Storage used</h4>
        <div className="storage-label-row">
          <span className="storage-sub">
            {used} MB of {total} MB used
          </span>
          <span className="storage-pct">{pct}%</span>
        </div>
        <div className="storage-bar">
          <div className="storage-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="storage-grid">
          <div className="metric-card">
            <div className="metric-label">Scan history</div>
            <div className="metric-value">52 MB</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Cached images</div>
            <div className="metric-value">16 MB</div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h4 className="card-section-title">Clear data</h4>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Clear cached images</div>
            <div className="toggle-sub">Frees up 16 MB</div>
          </div>
          <button className="btn-sm">Clear</button>
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Clear scan history</div>
            <div className="toggle-sub">Cannot be undone</div>
          </div>
          <button className="danger-link">Clear</button>
        </div>
      </div>
    </div>
  );
}

function SessionsPanel() {
  const sessions = [
    {
      id: 1,
      icon: "📱",
      name: "iPhone 15 · EcoSnap iOS",
      detail: "Manila, PH · Active now",
      current: true,
    },
    {
      id: 2,
      icon: "💻",
      name: "Chrome on Windows",
      detail: "Iloilo, PH · 2 days ago",
      current: false,
    },
    {
      id: 3,
      icon: "📱",
      name: "Samsung Galaxy S23",
      detail: "Cebu, PH · 1 week ago",
      current: false,
    },
  ];

  const [list, setList] = useState(sessions);
  const revoke = (id) => setList(list.filter((s) => s.id !== id));
  const revokeAll = () => setList(list.filter((s) => s.current));

  return (
    <div className="panel">
      <h2 className="panel-title">Active Sessions</h2>

      <div className="section-card">
        <h4 className="card-section-title">Logged-in devices</h4>
        {list.map((s) => (
          <div className="session-row" key={s.id}>
            <div className="session-icon">{s.icon}</div>
            <div className="session-info">
              <p className="session-name">{s.name}</p>
              <span className="session-detail">{s.detail}</span>
            </div>
            {s.current ? (
              <span className="badge">Current</span>
            ) : (
              <button className="danger-link" onClick={() => revoke(s.id)}>
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>

      <button className="btn-sm danger" onClick={revokeAll}>
        Revoke all other sessions
      </button>
    </div>
  );
}

// ─── Sidebar config ───────────────────────────────────────────────

const SIDEBAR = [
  {
    group: "Account",
    items: [
      { id: "profile", label: "Profile" },
      { id: "security", label: "Account & Security" },
    ],
  },
  {
    group: "Preferences",
    items: [
      { id: "notifications", label: "Notifications" },
      { id: "appearance", label: "Appearance" },
      { id: "language", label: "Language & Region" },
    ],
  },
  {
    group: "App",
    items: [
      { id: "privacy", label: "Privacy & Data" },
      { id: "storage", label: "Storage & Usage" },
      { id: "sessions", label: "Active Sessions" },
    ],
  },
  {
    group: "Support",
    items: [{ id: "about", label: "About EcoSnap", isLink: true, to: "/about" }],
  },
];

const PANELS = {
  profile: <ProfilePanel />,
  security: <SecurityPanel />,
  notifications: <NotificationsPanel />,
  appearance: <AppearancePanel />,
  language: <LanguagePanel />,
  privacy: <PrivacyPanel />,
  storage: <StoragePanel />,
  sessions: <SessionsPanel />,
};

// ─── Main Settings component ──────────────────────────────────────

export default function Settings() {
  const navigate = useNavigate();
  const [active, setActive] = useState("profile");

  const handleLogout = () => navigate("/login");

  return (
    <div className="settings-page">
      <div className="settings-body">

        {/* SIDEBAR */}
        <div className="sidebar">
          {SIDEBAR.map(({ group, items }) => (
            <div key={group}>
              <h3>{group}</h3>
              <ul>
                {items.map(({ id, label, isLink, to }) => (
                  <li
                    key={id}
                    className={active === id ? "active" : ""}
                    onClick={() => !isLink && setActive(id)}
                  >
                    {isLink ? <Link to={to}>{label}</Link> : label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button className="logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        {/* CONTENT */}
        <div className="content">
          {PANELS[active] ?? null}
        </div>

      </div>
    </div>
  );
}