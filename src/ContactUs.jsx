import './contactus.css';
import { Link } from 'react-router-dom';

export default function ContactUs() {
  return (
    <div className="contact-container">
      {/* Hero Section */}
      <div className="contact-hero">
        <h1>Hi, how can we help?</h1>
        <div className="search-wrapper">
          <input type="text" placeholder="Search for eco-tips, recycling guides..." />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <div className="contact-content">
        {/* Sidebar */}
        <aside className="contact-sidebar">
          <nav>
            <ul>
              <li className="active">General Support</li>
              <li><Link to= {"/scanningissues"}>Scanning Issues</Link></li>
              <li><Link to ={"/accountsecurity"}>Account Security</Link></li>
              <li><Link to ={"/privacypolicy"}>Privacy Policy</Link></li>
              <li><Link to ={"/resources"}>Resources</Link></li>
            </ul>
          </nav>
        </aside>

        {/* Main Article Area */}
        <main className="contact-main">
          <section className="article-header">
            <h2>[Customer Service] How do I contact EcoSnap Support?</h2>
            <p className="subtitle">For the <strong>Eco-Guide version</strong> of this article, click here.</p>
          </section>

          <section className="contact-channels">
            <p>EcoSnap Support can be reached through the following channels:</p>
            <ul>
              <li><span className="highlight">Live Chat:</span> 24/7 via the app</li>
              <li><span className="highlight">Email Support:</span> Response within 24 hours</li>
            </ul>

            <div className="note-box">
              <span className="note-icon">💡</span>
              <p>
                <strong>Note:</strong> For urgent recycling center inquiries, you can reach out directly to our 
                <a href="#partners"> Partner Network</a>.
              </p>
            </div>
          </section>

          <section className="instruction">
            <h3>Chat with EcoSnap</h3>
            <p>Go to the <strong>Settings tab</strong> &gt; <strong>Help Center</strong> &gt; <strong>Start Chatting</strong>.</p>
            <div className="image-placeholder">
              [Mobile App UI Preview]
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}