import React, { useState, useEffect } from 'react';
import { useTranslation } from './hooks/useTranslation';
import './tipsfacts.css';

const EcoCard = ({ tip, isBookmarked, onToggleBookmark }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="eco-card">
      <div className="card-accent" style={{ backgroundColor: tip.accentColor ?? "#90ee90" }} />
      <div className="card-content">

        <div className="card-top-row">
          <span className="card-category">{tip.category}</span>
          <button
            className={`bookmark-btn${isBookmarked ? " bookmarked" : ""}`}
            onClick={() => onToggleBookmark(tip.id)}
            title={isBookmarked ? "Remove bookmark" : "Bookmark this tip"}
          >
            {isBookmarked ? "🔖" : "🏷️"}
          </button>
        </div>

        <div className="icon-box">
          <span className="card-emoji">{tip.icon ?? "♻️"}</span>
        </div>

        <h4>{tip.title}</h4>

        {flipped ? (
          <div className="fact-box">
            <span className="fact-label">💡 Did you know?</span>
            <p>{tip.fact && tip.fact.trim() ? tip.fact : "No fun fact added yet."}</p>
          </div>
        ) : (
          <p>{tip.description}</p>
        )}

        <button className="flip-btn" onClick={() => setFlipped(!flipped)}>
          {flipped ? "← Back to tip" : "💡 Fun fact"}
        </button>

      </div>
    </div>
  );
};

export default function TipsAndFacts() {
  const { t } = useTranslation();
  const [tips, setTips]                     = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [bookmarks, setBookmarks]           = useState([]);
  const [activeTab, setActiveTab]           = useState("tips");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery]       = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/tips/active")
      .then((res) => {
        if (!res.ok) throw new Error(t('couldNotLoadTips'));
        return res.json();
      })
      .then((data) => { setTips(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [t]);

  const categories = ["All", ...new Set(tips.map((t) => t.category).filter(Boolean))];

  const toggleBookmark = (id) =>
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );

  const filtered = tips.filter((tip) => {
    const matchCat    = activeCategory === "All" || tip.category === activeCategory;
    const matchSearch =
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab    = activeTab === "bookmarks" ? bookmarks.includes(tip.id) : true;
    return matchCat && matchSearch && matchTab;
  });

  return (
    <div className="tips-facts-wrapper">

      {/* ── Header ── */}
      <div className="tips-header">
        <h3>{activeTab === "bookmarks" ? "📖 " + t('savedTips') : t('todaysEcoTip')}</h3>
        <div className="header-right">
          <button
            className={`tab-btn${activeTab === "tips" ? " active" : ""}`}
            onClick={() => { setActiveTab("tips"); setActiveCategory("All"); }}
          >
            {t('allTips')}
          </button>
          <button
            className={`tab-btn${activeTab === "bookmarks" ? " active" : ""}`}
            onClick={() => setActiveTab("bookmarks")}
          >
            🔖 {t('savedTips')}
            {bookmarks.length > 0 && (
              <span className="tab-badge">{bookmarks.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="search-row">
        <input
          className="search-input"
          type="text"
          placeholder={`🔍 ${t('searchTipsAndFacts')}…`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ── Category filter (only on All Tips tab) ── */}
      {activeTab === "tips" && !loading && !error && (
        <div className="category-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-chip${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ── Loading / Error states ── */}
      {loading && (
        <div className="empty-state">{t('loadingTips')}…</div>
      )}
      {error && (
        <div className="empty-state" style={{ color: "#e53e3e" }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Cards ── */}
      {!loading && !error && (
        filtered.length > 0 ? (
          <div className="cards-container">
            {filtered.map((tip) => (
              <EcoCard
                key={tip.id}
                tip={tip}
                isBookmarked={bookmarks.includes(tip.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            {activeTab === "bookmarks"
              ? t('youHaventSaved')
              : t('noTipsMatch')}
          </div>
        )
      )}

    </div>
  );
}