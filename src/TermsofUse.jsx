import React from 'react';
import './termsofuse.css';

export default function TermsOfUse() {
  return (
    <div className="terms-container">
      <header className="terms-header">
        <h1>Terms of Use</h1>
        <p>Last Updated: April 14, 2026</p>
      </header>

      <section className="terms-body">
        <div className="terms-section">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using EcoSnap, you agree to comply with and be bound by these Terms of Use. 
            If you do not agree, please refrain from using the application.
          </p>
        </div>

        <div className="terms-section">
          <h3>2. User Responsibilities</h3>
          <p>
            As a user of EcoSnap, you agree to:
          </p>
          <ul>
            <li>Provide accurate information when creating an account.</li>
            <li>Use the AI scanning feature solely for identifying waste materials.</li>
            <li>Refrain from uploading offensive or harmful content.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h3>3. Intellectual Property</h3>
          <p>
            All content, including the EcoSnap logo, AI models, and interface design, is the property of 
            EcoSnap and is protected by copyright laws in the Philippines.
          </p>
        </div>

        <div className="terms-section">
          <h3>4. Limitation of Liability</h3>
          <p>
            While we strive for 100% accuracy in our waste classification, EcoSnap is not liable for 
            misidentification of materials. Always follow local Cebu City disposal guidelines when in doubt.
          </p>
        </div>

        <div className="terms-section">
          <h3>5. Changes to Terms</h3>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the app 
            following changes constitutes acceptance of the new terms.
          </p>
        </div>
      </section>

      <footer className="terms-footer">
        <button className="accept-btn">I Understand</button>
      </footer>
    </div>
  );
}