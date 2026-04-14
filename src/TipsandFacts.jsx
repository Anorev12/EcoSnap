import React from 'react';
import './tipsfacts.css';

// Reusable Card Component
const EcoCard = ({ title, description, icon, accentColor }) => (
  <div className="eco-card">
    <div className="card-accent" style={{ backgroundColor: accentColor }}></div>
    <div className="card-content">
      <div className="icon-box">
        <img src={icon} alt={title} />
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

export default function TipsAndFacts() {
  const tips = [
    {
      title: "Plastic Recycling",
      description: "Always check the number inside the recycling symbol. Numbers 1 and 2 are most commonly accepted.",
      icon: "/path-to-plastic-icon.png",
      accentColor: "#90ee90" // Light green accent
    },
    {
      title: "Composting Basics",
      description: "Fruit peels, vegetable scraps, and coffee grounds are great for composting. Avoid meat and dairy.",
      icon: "/path-to-compost-icon.png",
      accentColor: "#90ee90"
    },
    {
      title: "Hazardous Waste",
      description: "Batteries, electronics, and chemicals must be taken to special drop-off centers — never throw in regular trash.",
      icon: "/path-to-waste-icon.png",
      accentColor: "#90ee90"
    }
  ];

  return (
    <div className="tips-facts-wrapper">
      {/* Header section from your screenshot */}
      <div className="tips-header">
        <h3>Today's Eco Tip</h3>
        <button className="more-btn">
          More <span className="arrow-circle">→</span>
        </button>
      </div>

      <div className="cards-container">
        {tips.map((tip, index) => (
          <EcoCard key={index} {...tip} />
        ))}
      </div>
    </div>
  );
}