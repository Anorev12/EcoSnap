import React, { useState } from 'react';
import './tipsfacts.css';

// ─── Data ─────────────────────────────────────────────────────────

const ALL_TIPS = [
  {
    id: 1,
    category: "Plastics",
    title: "Plastic Recycling",
    description: "Always check the number inside the recycling symbol. Numbers 1 and 2 are most commonly accepted by curbside programs.",
    icon: "♻️",
    accentColor: "#90ee90",
    fact: "Only 9% of all plastic ever produced has been recycled.",
  },
  {
    id: 2,
    category: "Organics",
    title: "Composting Basics",
    description: "Fruit peels, vegetable scraps, and coffee grounds are great for composting. Avoid meat and dairy to prevent pests.",
    icon: "🌱",
    accentColor: "#90ee90",
    fact: "Composting can divert up to 30% of household waste from landfills.",
  },
  {
    id: 3,
    category: "Hazardous",
    title: "Hazardous Waste",
    description: "Batteries, electronics, and chemicals must be taken to special drop-off centers — never throw in regular trash.",
    icon: "⚠️",
    accentColor: "#90ee90",
    fact: "One AA battery can contaminate 1 square meter of soil for 50 years.",
  },
  {
    id: 4,
    category: "Plastics",
    title: "Single-Use Plastics",
    description: "Straws, plastic bags, and cutlery take 400–1,000 years to decompose. Switch to reusable alternatives whenever possible.",
    icon: "🥤",
    accentColor: "#90ee90",
    fact: "The world uses 5 trillion plastic bags per year.",
  },
  {
    id: 5,
    category: "Electronics",
    title: "E-Waste Disposal",
    description: "Old phones, laptops, and chargers contain toxic metals like lead and mercury. Bring them to certified e-waste drop-off points.",
    icon: "📱",
    accentColor: "#90ee90",
    fact: "E-waste is the fastest-growing waste stream in the world.",
  },
  {
    id: 6,
    category: "Paper",
    title: "Paper Recycling",
    description: "Flatten cardboard boxes and remove food residue before recycling. Wet or greasy paper (e.g. pizza boxes) cannot be recycled.",
    icon: "📦",
    accentColor: "#90ee90",
    fact: "Recycling one ton of paper saves 17 trees and 7,000 gallons of water.",
  },
  {
    id: 7,
    category: "Glass",
    title: "Glass Recycling",
    description: "Glass can be recycled endlessly without loss of quality. Rinse containers and remove lids before placing in the recycling bin.",
    icon: "🍶",
    accentColor: "#90ee90",
    fact: "A glass bottle takes over 1 million years to decompose in a landfill.",
  },
  {
    id: 8,
    category: "Organics",
    title: "Food Waste Reduction",
    description: "Plan meals ahead, store food properly, and use leftovers creatively. Reducing food waste is one of the highest-impact eco actions.",
    icon: "🥗",
    accentColor: "#90ee90",
    fact: "Food waste accounts for 8–10% of global greenhouse gas emissions.",
  },
  {
    id: 9,
    category: "Hazardous",
    title: "Paint & Chemicals",
    description: "Never pour paint or household chemicals down the drain. Check your local council for collection events or permanent drop-off sites.",
    icon: "🪣",
    accentColor: "#90ee90",
    fact: "Latex paint can be recycled into new paint at specialized facilities.",
  },
  {
    id: 10,
    category: "General",
    title: "The 5 R's of Waste",
    description: "Refuse what you don't need, Reduce what you use, Reuse what you have, Recycle what's left, and Rot (compost) the rest.",
    icon: "🌍",
    accentColor: "#90ee90",
    fact: "Applying all 5 R's can cut personal waste by up to 80%.",
  },
  {
    id: 11,
    category: "Electronics",
    title: "Printer Cartridges",
    description: "Empty ink and toner cartridges can be refilled or returned to manufacturers. Many office supply stores offer free cartridge recycling.",
    icon: "🖨️",
    accentColor: "#90ee90",
    fact: "It takes about 1 quart of oil to manufacture one laser toner cartridge.",
  },
  {
    id: 12,
    category: "General",
    title: "Landfill Basics",
    description: "Modern landfills are lined to prevent leachate, but they still produce methane gas. Minimizing landfill waste is critical for climate.",
    icon: "🏔️",
    accentColor: "#90ee90",
    fact: "Landfills are the third-largest source of methane emissions in the US.",
  },
];

const CATEGORIES = ["All", "Plastics", "Organics", "Hazardous", "Electronics", "Paper", "Glass", "General"];

// ─── EcoCard ──────────────────────────────────────────────────────

const EcoCard = ({ tip, isBookmarked, onToggleBookmark }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="eco-card">
      <div className="card-accent" style={{ backgroundColor: tip.accentColor }} />
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
          <span className="card-emoji">{tip.icon}</span>
        </div>

        <h4>{tip.title}</h4>

        {flipped ? (
          <div className="fact-box">
            <span className="fact-label">💡 Did you know?</span>
            <p>{tip.fact}</p>
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

// ─── Main Component ───────────────────────────────────────────────

export default function TipsAndFacts() {
  const [bookmarks, setBookmarks]           = useState([]);
  const [activeTab, setActiveTab]           = useState("tips");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery]       = useState("");

  const toggleBookmark = (id) =>
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );

  const filtered = ALL_TIPS.filter((tip) => {
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
        <h3>{activeTab === "bookmarks" ? "📖 Saved Tips" : "Today's Eco Tip"}</h3>
        <div className="header-right">
          <button
            className={`tab-btn${activeTab === "tips" ? " active" : ""}`}
            onClick={() => { setActiveTab("tips"); setActiveCategory("All"); }}
          >
            All Tips
          </button>
          <button
            className={`tab-btn${activeTab === "bookmarks" ? " active" : ""}`}
            onClick={() => setActiveTab("bookmarks")}
          >
            🔖 Saved
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
          placeholder="🔍  Search tips and facts…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ── Category filter (only on All Tips tab) ── */}
      {activeTab === "tips" && (
        <div className="category-row">
          {CATEGORIES.map((cat) => (
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

      {/* ── Cards ── */}
      {filtered.length > 0 ? (
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
            ? "You haven't saved any tips yet. Tap 🏷️ on a card to bookmark it!"
            : "No tips match your search."}
        </div>
      )}

    </div>
  );
}