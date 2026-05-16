import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./settings.css";

// ─── API helpers ──────────────────────────────────────────────────

const updateUserProfile = async (id, userData) => {
  const response = await fetch(`http://localhost:8080/api/users/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Update failed");
  }
  return response.json();
};

const requestEmailChange = async (id, newEmail) => {
  const response = await fetch(`http://localhost:8080/api/users/${id}/request-email-change`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newEmail }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }
  return response.json();
};

const deleteUserAccount = async (id) => {
  const response = await fetch(`http://localhost:8080/api/users/delete/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Delete failed");
  }
  return response.json();
};

const submitFeedback = async (feedbackData) => {
  const response = await fetch("http://localhost:8080/api/feedback/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedbackData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to submit feedback");
  }
  return response.json();
};

// ─── Theme helpers ────────────────────────────────────────────────

const getTheme = () => {
  const stored = localStorage.getItem("theme");
  if (stored) return stored;
  const bodyTheme = document.body.getAttribute("data-theme");
  if (bodyTheme) return bodyTheme;
  return "light";
};

// ✅ Now syncs BOTH <html> and <body> so CSS vars fire instantly on refresh
const setThemeAndPersist = (theme) => {
  localStorage.setItem("theme", theme);

  let resolved = theme;
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    resolved = prefersDark ? "dark" : "light";
  }

  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.style.colorScheme = resolved;
  document.body.setAttribute("data-theme", resolved);
};

// ─── Profile Panel ────────────────────────────────────────────────

function ProfilePanel({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...user, bio: user.bio ?? "" });
  const [preview, setPreview] = useState(user.photoUrl);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const fileInputRef = useRef(null);

  // ✅ Keeps a mutable ref to the latest user to avoid stale closures
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    setForm({ ...user, bio: user.bio ?? "" });
    setPreview(user.photoUrl);
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:8080/api/users/get/${user.id}`)
      .then((res) => res.json())
      .then((fresh) => {
        const merged = { ...userRef.current, ...fresh };
        setUser(merged);
        localStorage.setItem("user", JSON.stringify(merged));
      })
      .catch(() => {});
  }, [user?.id, setUser]);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setForm({ ...form, photoUrl: url });
  };

  const canChangeUsername = () => {
    if (!user.lastUsernameChange) return true;
    const last = new Date(user.lastUsernameChange);
    const nextAllowed = new Date(last);
    nextAllowed.setMonth(nextAllowed.getMonth() + 1);
    return new Date() >= nextAllowed;
  };

  const nextUsernameChangeDate = () => {
    if (!user.lastUsernameChange) return null;
    const last = new Date(user.lastUsernameChange);
    const next = new Date(last);
    next.setMonth(next.getMonth() + 1);
    return next.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const handleSave = async () => {
    if (form.username !== user.username && !canChangeUsername()) {
      setMsg({ type: "error", text: `You can only change your username once per month. Next allowed: ${nextUsernameChangeDate()}` });
      return;
    }
    try {
      setSaving(true);
      setMsg(null);
      const updated = await updateUserProfile(user.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        bio: form.bio,
        photoUrl: form.photoUrl,
      });
      const merged = { ...user, ...updated };
      setUser(merged);
      localStorage.setItem("user", JSON.stringify(merged));
      setIsEditing(false);
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to save profile." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...user, bio: user.bio ?? "" });
    setPreview(user.photoUrl);
    setIsEditing(false);
    setMsg(null);
  };

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Profile</h2>
        <p className="panel-subtitle">Manage your personal information</p>
      </div>
      <div className="section-card">
        <div className="avatar-row">
          <div
            className="avatar"
            style={
              preview || user.photoUrl
                ? { backgroundImage: `url(${preview || user.photoUrl})`, backgroundSize: "cover", color: "transparent" }
                : {}
            }
          >
            {!preview && !user.photoUrl && initials}
          </div>
          <div className="avatar-info">
            <p className="avatar-name">{user.firstName} {user.lastName}</p>
            <span className="avatar-sub">{user.email}</span>
            <br />
            {isEditing && (
              <>
                <button className="btn-sm" onClick={() => fileInputRef.current.click()}>Change photo</button>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
              </>
            )}
          </div>
        </div>
        <div className="row2">
          <div className="field"><label>First name</label><input value={form.firstName} onChange={update("firstName")} disabled={!isEditing} /></div>
          <div className="field"><label>Last name</label><input value={form.lastName} onChange={update("lastName")} disabled={!isEditing} /></div>
        </div>
        <div className="field">
          <label>Bio</label>
          <input value={form.bio} onChange={update("bio")} placeholder="Tell us a little about yourself…" disabled={!isEditing} />
        </div>
        <div className="field">
          <label>Username</label>
          <input value={form.username} onChange={update("username")} disabled={!isEditing || !canChangeUsername()} />
          {isEditing && !canChangeUsername() && (
            <p style={{ fontSize: 12, color: "#f59e0b", marginTop: 4 }}>
              Username can only be changed once per month. Next allowed: {nextUsernameChangeDate()}
            </p>
          )}
          {isEditing && canChangeUsername() && (
            <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>You can change your username once per month.</p>
          )}
        </div>
        <div className="field">
          <label>Email</label>
          <input value={user.email} disabled={true} />
          <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
            To change your email, go to Account &amp; Security and submit a request to the admin.
          </p>
        </div>
      </div>
      {msg && <p className={`msg ${msg.type}`}>{msg.type === "success" ? "✓ " : "✕ "}{msg.text}</p>}
      {!isEditing ? (
        <button className="save-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
      ) : (
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="save-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
          <button className="btn-sm" onClick={handleCancel} style={{ padding: "10px 20px" }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

// ─── Security Panel ───────────────────────────────────────────────

function SecurityPanel({ user, setUser }) {
  const navigate = useNavigate();

  // ✅ Keeps a mutable ref to the latest user to avoid stale closures
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:8080/api/users/get/${user.id}`)
      .then((res) => res.json())
      .then((fresh) => {
        const merged = { ...userRef.current, ...fresh };
        setUser(merged);
        localStorage.setItem("user", JSON.stringify(merged));
      })
      .catch(() => {});
  }, [user?.id, setUser]);

  const [newEmail, setNewEmail]       = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMsg, setEmailMsg]       = useState(null);

  const handleRequestEmailChange = async () => {
    if (!newEmail.trim()) { setEmailMsg({ type: "error", text: "Please enter a new email address." }); return; }
    if (newEmail === user.email) { setEmailMsg({ type: "error", text: "That's already your current email." }); return; }
    try {
      setEmailSaving(true);
      setEmailMsg(null);
      const updated = await requestEmailChange(user.id, newEmail);
      const merged = { ...user, ...updated };
      setUser(merged);
      localStorage.setItem("user", JSON.stringify(merged));
      setEmailMsg({ type: "success", text: "Request submitted! The admin will review and approve your email change." });
      setNewEmail("");
    } catch (err) {
      setEmailMsg({ type: "error", text: err.message || "Failed to submit request." });
    } finally {
      setEmailSaving(false);
    }
  };

  const [pw, setPw]             = useState({ next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg]       = useState(null);
  const updatePw = (k) => (e) => setPw({ ...pw, [k]: e.target.value });

  const handleUpdatePassword = async () => {
    if (!pw.next) { setPwMsg({ type: "error", text: "New password cannot be empty." }); return; }
    if (pw.next.length < 6) { setPwMsg({ type: "error", text: "Password must be at least 6 characters." }); return; }
    if (pw.next !== pw.confirm) { setPwMsg({ type: "error", text: "Passwords do not match." }); return; }
    try {
      setPwSaving(true);
      setPwMsg(null);
      await updateUserProfile(user.id, { ...user, password: pw.next });
      setPw({ next: "", confirm: "" });
      setPwMsg({ type: "success", text: "Password updated successfully." });
    } catch (err) {
      setPwMsg({ type: "error", text: err.message || "Failed to update password." });
    } finally {
      setPwSaving(false);
    }
  };

  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to permanently delete your account? This cannot be undone.");
    if (!confirmed) return;
    try {
      setDeleting(true);
      await deleteUserAccount(user.id);
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    } catch (err) {
      alert(err.message || "Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Account &amp; Security</h2>
        <p className="panel-subtitle">Manage your account security and preferences</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Email Address</h4>
        <div className="field"><label>Current email</label><input type="email" value={user.email} disabled /></div>
        {user.emailChangeRequested ? (
          <div style={{ background: "#fef9c3", border: "1px solid #fde047", borderRadius: 8, padding: "12px 16px", marginBottom: 12 }}>
            <p style={{ fontSize: 13, color: "#854d0e", margin: 0 }}>
              Pending request: You requested to change your email to <strong>{user.pendingEmail}</strong>. Waiting for admin approval.
            </p>
          </div>
        ) : (
          <>
            <div className="field">
              <label>New email address</label>
              <input type="email" placeholder="Enter new email" value={newEmail} onChange={(e) => { setNewEmail(e.target.value); setEmailMsg(null); }} />
            </div>
            <p style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>
              Email changes require admin approval. Your current email stays active until approved.
            </p>
            {emailMsg && <p className={`msg ${emailMsg.type}`}>{emailMsg.type === "success" ? "✓ " : "✕ "}{emailMsg.text}</p>}
            <button className="btn-sm" onClick={handleRequestEmailChange} disabled={emailSaving}>
              {emailSaving ? "Submitting..." : "Request email change"}
            </button>
          </>
        )}
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Password</h4>
        <div className="field"><label>New password</label><input type="password" placeholder="••••••••" value={pw.next} onChange={updatePw("next")} /></div>
        <div className="field"><label>Confirm new password</label><input type="password" placeholder="••••••••" value={pw.confirm} onChange={updatePw("confirm")} /></div>
        {pwMsg && <p className={`msg ${pwMsg.type}`}>{pwMsg.type === "success" ? "✓ " : "✕ "}{pwMsg.text}</p>}
        <button className="save-btn" onClick={handleUpdatePassword} disabled={pwSaving}>{pwSaving ? "Updating..." : "Update password"}</button>
      </div>
      <div className="section-card danger-zone">
        <h4 className="card-section-title">Danger zone</h4>
        <div className="toggle-row">
          <div><div className="toggle-label">Delete account</div><div className="toggle-sub">Permanently remove your account and all data</div></div>
          <button className="danger-link" onClick={handleDeleteAccount} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────

function Toggle({ defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="toggle">
      <input type="checkbox" checked={on} onChange={() => setOn(!on)} />
      <span className="slider-t" />
    </label>
  );
}

// ─── Notifications Panel ──────────────────────────────────────────

function NotificationsPanel() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Notifications</h2>
        <p className="panel-subtitle">Control how you receive updates</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Push notifications</h4>
        <div className="toggle-row"><div><div className="toggle-label">Scan reminders</div><div className="toggle-sub">Daily nudge to scan items</div></div><Toggle defaultChecked /></div>
        <div className="toggle-row"><div><div className="toggle-label">Eco tips</div><div className="toggle-sub">Weekly sustainability tips</div></div><Toggle defaultChecked /></div>
        <div className="toggle-row"><div><div className="toggle-label">Community updates</div><div className="toggle-sub">New posts from people you follow</div></div><Toggle /></div>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Email notifications</h4>
        <div className="toggle-row"><div><div className="toggle-label">Newsletter</div><div className="toggle-sub">Monthly EcoSnap digest</div></div><Toggle defaultChecked /></div>
        <div className="toggle-row"><div><div className="toggle-label">Product announcements</div><div className="toggle-sub">New features and updates</div></div><Toggle /></div>
      </div>
    </div>
  );
}

// ─── Appearance Panel ─────────────────────────────────────────────

function AppearancePanel() {
  const [theme, setTheme] = useState(() => getTheme());
  const [fontSize, setFontSize] = useState("medium");
  const [accent, setAccent] = useState("#22c55e");
  const accents = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#ec4899"];

  useEffect(() => {
    setThemeAndPersist(theme);
  }, [theme]);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Appearance</h2>
        <p className="panel-subtitle">Customize how EcoSnap looks</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Theme</h4>
        <div className="theme-grid">
          {["light", "dark", "system"].map((t) => (
            <div key={t} className={`theme-opt${theme === t ? " sel" : ""}`} onClick={() => setTheme(t)}>
              <span className="theme-icon">{t === "light" ? "☀️" : t === "dark" ? "🌙" : "⚙️"}</span>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Text size</h4>
        <div className="field"><label>Font size</label><select value={fontSize} onChange={(e) => setFontSize(e.target.value)}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></div>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Accent color</h4>
        <div className="accent-row">
          {accents.map((c) => (
            <div key={c} className={`accent-swatch${accent === c ? " sel" : ""}`} style={{ background: c, border: accent === c ? `2px solid ${c}` : "2px solid transparent" }} onClick={() => setAccent(c)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Language Panel ───────────────────────────────────────────────

function LanguagePanel() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Language &amp; Region</h2>
        <p className="panel-subtitle">Set your language and location preferences</p>
      </div>
      <div className="section-card">
        <div className="field"><label>Language</label><select defaultValue="en"><option value="en">English (US)</option><option value="fil">Filipino</option><option value="es">Español</option><option value="ja">日本語</option></select></div>
        <div className="field"><label>Region</label><select defaultValue="ph"><option value="ph">Philippines</option><option value="us">United States</option><option value="jp">Japan</option></select></div>
        <div className="field"><label>Time zone</label><select defaultValue="manila"><option value="manila">Asia/Manila (UTC+8)</option><option value="ny">America/New_York (UTC-5)</option><option value="tokyo">Asia/Tokyo (UTC+9)</option></select></div>
        <div className="field"><label>Date format</label><select defaultValue="mdy"><option value="mdy">MM/DD/YYYY</option><option value="dmy">DD/MM/YYYY</option><option value="ymd">YYYY-MM-DD</option></select></div>
      </div>
      <button className="save-btn">Save preferences</button>
    </div>
  );
}

// ─── Privacy Panel ────────────────────────────────────────────────

function PrivacyPanel() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Privacy &amp; Data</h2>
        <p className="panel-subtitle">Control your data and privacy settings</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Data sharing</h4>
        <div className="toggle-row"><div><div className="toggle-label">Analytics</div><div className="toggle-sub">Help improve EcoSnap with usage data</div></div><Toggle defaultChecked /></div>
        <div className="toggle-row"><div><div className="toggle-label">Personalized suggestions</div><div className="toggle-sub">Use scan history for recommendations</div></div><Toggle defaultChecked /></div>
        <div className="toggle-row"><div><div className="toggle-label">Location data</div><div className="toggle-sub">Used for nearby recycling centers</div></div><Toggle /></div>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Your data</h4>
        <div className="toggle-row"><div><div className="toggle-label">Export my data</div><div className="toggle-sub">Download a copy of your EcoSnap data</div></div><button className="btn-sm">Export</button></div>
      </div>
    </div>
  );
}

// ─── Storage Panel ────────────────────────────────────────────────

function StoragePanel() {
  const used = 68, total = 200;
  const pct = Math.round((used / total) * 100);
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Storage &amp; Usage</h2>
        <p className="panel-subtitle">Manage your storage space</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Storage used</h4>
        <div className="storage-label-row"><span className="storage-sub">{used} MB of {total} MB used</span><span className="storage-pct">{pct}%</span></div>
        <div className="storage-bar"><div className="storage-fill" style={{ width: `${pct}%` }} /></div>
        <div className="storage-grid">
          <div className="metric-card"><div className="metric-label">Scan history</div><div className="metric-value">52 MB</div></div>
          <div className="metric-card"><div className="metric-label">Cached images</div><div className="metric-value">16 MB</div></div>
        </div>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Clear data</h4>
        <div className="toggle-row"><div><div className="toggle-label">Clear cached images</div><div className="toggle-sub">Frees up 16 MB</div></div><button className="btn-sm">Clear</button></div>
        <div className="toggle-row"><div><div className="toggle-label">Clear scan history</div><div className="toggle-sub">Cannot be undone</div></div><button className="danger-link">Clear</button></div>
      </div>
    </div>
  );
}

// ─── Sessions Panel ───────────────────────────────────────────────

function SessionsPanel() {
  const sessions = [
    { id: 1, icon: "📱", name: "iPhone 15 · EcoSnap iOS", detail: "Manila, PH · Active now", current: true },
    { id: 2, icon: "💻", name: "Chrome on Windows", detail: "Iloilo, PH · 2 days ago", current: false },
    { id: 3, icon: "📱", name: "Samsung Galaxy S23", detail: "Cebu, PH · 1 week ago", current: false },
  ];
  const [list, setList] = useState(sessions);
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Active Sessions</h2>
        <p className="panel-subtitle">Manage your logged-in devices</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Logged-in devices</h4>
        {list.map((s) => (
          <div className="session-row" key={s.id}>
            <div className="session-icon">{s.icon}</div>
            <div className="session-info"><p className="session-name">{s.name}</p><span className="session-detail">{s.detail}</span></div>
            {s.current ? <span className="badge">Current</span> : <button className="danger-link" onClick={() => setList(list.filter((x) => x.id !== s.id))}>Revoke</button>}
          </div>
        ))}
      </div>
      <button className="btn-sm danger" onClick={() => setList(list.filter((s) => s.current))}>Revoke all other sessions</button>
    </div>
  );
}

// ─── Feedback Panel ───────────────────────────────────────────────

const FEEDBACK_CATEGORIES = ["General", "UI / Design", "Performance", "Scan Accuracy", "Tips & Facts", "Bug Report", "Feature Request", "Other"];
const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

function FeedbackPanel({ user }) {
  const [hoverRating, setHoverRating]       = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCats, setSelectedCats]     = useState([]);
  const [feedbackText, setFeedbackText]     = useState("");
  const [submitting, setSubmitting]         = useState(false);
  const [status, setStatus]                 = useState(null);

  const toggleCat = (cat) =>
    setSelectedCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);

  const handleSubmit = async () => {
    if (!selectedRating) {
      setStatus({ type: "error", text: "Please select a star rating." });
      return;
    }
    try {
      setSubmitting(true);
      setStatus(null);
      await submitFeedback({
        userName: user ? `${user.firstName} ${user.lastName}` : "Anonymous",
        userEmail: user?.email ?? "",
        rating: selectedRating,
        categories: selectedCats.join(", "),
        message: feedbackText.trim(),
        submittedAt: new Date().toISOString(),
      });
      setSelectedRating(0);
      setSelectedCats([]);
      setFeedbackText("");
      setStatus({ type: "success", text: "Thank you! Your feedback has been submitted." });
    } catch (err) {
      setStatus({ type: "error", text: err.message || "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (status?.type === "success") {
      const t = setTimeout(() => setStatus(null), 5000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const displayRating = hoverRating || selectedRating;

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Feedback</h2>
        <p className="panel-subtitle">Help us improve EcoSnap</p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Overall experience</h4>
        <div className="feedback-stars">
          {[1, 2, 3, 4, 5].map((val) => (
            <span
              key={val}
              className={`feedback-star${displayRating >= val ? " active" : ""}`}
              onMouseEnter={() => setHoverRating(val)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => { setSelectedRating(val); setStatus(null); }}
            >★</span>
          ))}
        </div>
        <p className="feedback-rating-label">
          {displayRating ? RATING_LABELS[displayRating] : "Tap a star to rate"}
        </p>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">What is your feedback about?</h4>
        <div className="feedback-chips">
          {FEEDBACK_CATEGORIES.map((cat) => (
            <button key={cat} className={`feedback-chip${selectedCats.includes(cat) ? " selected" : ""}`} onClick={() => toggleCat(cat)}>{cat}</button>
          ))}
        </div>
      </div>
      <div className="section-card">
        <h4 className="card-section-title">Tell us more (optional)</h4>
        <div className="field">
          <textarea
            className="feedback-textarea"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Share your thoughts, suggestions, or report an issue…"
          />
        </div>
      </div>
      <div className="feedback-submit-row">
        <button className="save-btn" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit feedback"}
        </button>
        {status && (
          <span className={`msg ${status.type}`}>{status.type === "success" ? "✓ " : "✕ "}{status.text}</span>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar config ───────────────────────────────────────────────

const SIDEBAR = [
  { group: "Account",      items: [{ id: "profile", label: "Profile" }, { id: "security", label: "Security" }] },
  { group: "Preferences",  items: [{ id: "notifications", label: "Notifications" }, { id: "appearance", label: "Appearance" }, { id: "language", label: "Language" }] },
  { group: "App",          items: [{ id: "privacy", label: "Privacy" }, { id: "storage", label: "Storage" }, { id: "sessions", label: "Sessions" }, { id: "feedback", label: "Feedback" }] },
  { group: "Support",      items: [{ id: "about", label: "About EcoSnap", isLink: true, to: "/about" }] },
];

// ─── Main Settings component ──────────────────────────────────────

export default function Settings({ user, setUser }) {
  const navigate = useNavigate();
  const [active, setActive] = useState("profile");

  useEffect(() => {
    const savedTheme = getTheme();
    setThemeAndPersist(savedTheme);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="settings-page">
      <div className="settings-body">
        <div className="sidebar">
          {SIDEBAR.map(({ group, items }) => (
            <div key={group}>
              <h3>{group}</h3>
              <ul>
                {items.map(({ id, label, isLink, to }) => (
                  <li key={id} className={active === id ? "active" : ""} onClick={() => !isLink && setActive(id)}>
                    {isLink ? <Link to={to}>{label}</Link> : label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button className="logout" onClick={handleLogout}>Log Out</button>
        </div>
        <div className="content">
          {active === "profile"       && <ProfilePanel user={user} setUser={setUser} />}
          {active === "security"      && <SecurityPanel user={user} setUser={setUser} />}
          {active === "notifications" && <NotificationsPanel />}
          {active === "appearance"    && <AppearancePanel />}
          {active === "language"      && <LanguagePanel />}
          {active === "privacy"       && <PrivacyPanel />}
          {active === "storage"       && <StoragePanel />}
          {active === "sessions"      && <SessionsPanel />}
          {active === "feedback"      && <FeedbackPanel user={user} />}
        </div>
      </div>
    </div>
  );
}