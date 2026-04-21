import { useState } from "react";
import "./userfeedback.css";

const CATEGORIES = [
  "General",
  "UI / Design",
  "Performance",
  "Scan Accuracy",
  "Tips & Facts",
  "Bug Report",
  "Feature Request",
  "Other",
];

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const NAV_LINKS = [
  { label: "Dashboard", icon: "🏠" },
  { label: "History", icon: "🌿" },
  { label: "Tips & Facts", icon: "📋" },
  { label: "Settings", icon: "⚙️", active: true },
];

const SIDEBAR_SECTIONS = [
  {
    label: "Account",
    items: ["Profile", "Account & Security"],
  },
  {
    label: "Preferences",
    items: ["Notifications", "Appearance", "Language & Region"],
  },
  {
    label: "App",
    items: ["Privacy & Data", "Storage & Usage", "Active Sessions", "Feedback"],
  },
  {
    label: "Support",
    items: ["About EcoSnap"],
  },
];

export default function FeedbackPage() {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  };

  const displayRating = hoverRating || selectedRating;

  return (
    <div className="ecosnap-root">
      {/* TOP NAV */}
      <nav className="topnav">
        <div className="logo">
          Ec<span>o</span>Sn<span>a</span>p
        </div>
        <div className="nav-links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              className={`nav-link${link.active ? " active" : ""}`}
            >
              {link.icon} {link.label}
            </a>
          ))}
        </div>
        <div className="nav-user">
          John Doe
          <div className="nav-avatar">JD</div>
        </div>
      </nav>

      {/* LAYOUT */}
      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          {SIDEBAR_SECTIONS.map((section) => (
            <div className="sidebar-section" key={section.label}>
              <div className="sidebar-label">{section.label}</div>
              {section.items.map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`sidebar-item${
                    item === "Feedback" ? " active" : ""
                  }${item === "About EcoSnap" ? " support-link" : ""}`}
                >
                  {item}
                </a>
              ))}
            </div>
          ))}
          <button className="logout-btn">Log Out</button>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="page-title">Feedback</div>
          <div className="card">

            {/* STAR RATING */}
            <div className="section-label">
              How would you rate your overall experience?
            </div>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((val) => (
                <span
                  key={val}
                  className={`star${displayRating >= val ? " active" : ""}`}
                  onMouseEnter={() => setHoverRating(val)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setSelectedRating(val)}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="rating-label">
              {displayRating
                ? RATING_LABELS[displayRating]
                : "Tap a star to rate"}
            </div>

            <hr className="divider" />

            {/* CATEGORY CHIPS */}
            <div className="section-label">
              What is your feedback about?
            </div>
            <div className="chips">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`chip${
                    selectedCategories.includes(cat) ? " selected" : ""
                  }`}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <hr className="divider" />

            {/* MESSAGE */}
            <div className="section-label">Tell us more (optional)</div>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share your thoughts, suggestions, or report an issue..."
            />

            {/* SUBMIT */}
            <div className="submit-row">
              <button className="submit-btn" onClick={handleSubmit}>
                Submit feedback
              </button>
              {toastVisible && (
                <div className="toast">
                  ✅ Thank you! Your feedback has been submitted.
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}