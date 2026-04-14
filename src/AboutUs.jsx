import './aboutus.css';
import { useNavigate } from 'react-router-dom'; 

export default function AboutUs() {
  const navigate = useNavigate();
     const handleScanner = () => {
    navigate("/scanner");
     }
  const stats = [
    { value: "2M+", label: "Items Scanned" },
    { value: "500K", label: "kg Waste Diverted" },
    { value: "80K+", label: "Active Users" },
    { value: "98%", label: "Scan Accuracy" },
  ];
 
  const steps = [
    { step: "1", icon: "📸", title: "Snap a Photo", desc: "Point your camera at any item — packaging, bottle, electronics, food container." },
    { step: "2", icon: "🤖", title: "AI Analysis", desc: "Our model identifies the material and checks local recycling guidelines for your area." },
    { step: "3", icon: "✅", title: "Clear Guidance", desc: "You get a simple answer: recycle, compost, landfill, or drop-off point." },
    { step: "4", icon: "📊", title: "Track Impact", desc: "Every scan contributes to your personal eco-impact dashboard." },
  ];
 
  return (
    <div className="about-wrapper">
 
 
      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <div className="about-hero-icon">🌱</div>
          <h1>
            Snap it. Know it. <span className="highlight">Green it.</span>
          </h1>
          <p>
            EcoSnap turns your phone into a recycling guide — making it effortless to do right by the planet, one scan at a time.
          </p>
        </div>
      </section>
 
      {/* STATS */}
      <section className="about-stats">
        {stats.map((s, i) => (
          <div key={i} className="about-stat-item">
            <div className="about-stat-value">{s.value}</div>
            <div className="about-stat-label">{s.label}</div>
          </div>
        ))}
      </section>
 
      {/* MISSION */}
      <section className="about-mission">
        <div className="about-mission-inner">
          <div className="about-mission-icon">🎯</div>
          <div className="about-mission-text">
            <h2>Our Mission</h2>
            <p>
              Recycling is confusing. Rules vary by city. Labels are cryptic. Most well-meaning people give up — and waste ends up in landfill.
            </p>
            <p>
              EcoSnap was built to fix that. Point your camera at any item and we'll instantly tell you how to dispose of it correctly in your area — no guessing, no greenwashing, just clarity.
            </p>
          </div>
        </div>
      </section>
 
      {/* HOW IT WORKS */}
      <section className="about-how">
        <div className="about-how-inner">
          <h2>How EcoSnap Works</h2>
          <div className="about-how-grid">
            {steps.map((item) => (
              <div key={item.step} className="about-how-card">
                <div className="about-how-step">{item.step}</div>
                <div className="about-how-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
 
      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta-icon">🌍</div>
        <h2>Ready to make an impact?</h2>
        <p>Join thousands of eco-conscious users already reducing waste with EcoSnap.</p>
        <button className="about-cta-btn" onClick={handleScanner} >📸 Scan your first item</button>
      </section>
    </div>
  );
}