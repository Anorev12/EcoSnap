import './privacypolicy.css';

const sections = [
  {
    icon: '📷',
    title: '1. Information We Collect',
    content: [
      'Camera & Image Data: EcoSnap accesses your device camera solely to identify recyclable materials. Images captured during a scan are processed in real-time and are never stored on our servers without your explicit consent.',
      'Account Information: When you register, we collect your name, email address, and a password (stored as an encrypted hash). This information is used only to manage your account.',
      'Usage Data: We collect anonymized data about how you use the app (e.g., number of scans, features used) to improve EcoSnaps performance and features.',
    ],
  },
  {
    icon: '🔍',
    title: '2. How We Use Your Information',
    content: [
      'To provide and improve the EcoSnap scanning and recycling tracking service.',
      'To personalize your experience, such as showing your scan history and recycling statistics.',
      'To send important service-related communications (e.g., account updates, security alerts).',
      'To analyze usage trends and improve app performance — always using anonymized, aggregated data.',
    ],
  },
  {
    icon: '🔒',
    title: '3. Data Security',
    content: [
      'We take data security seriously. All data transmitted between your device and our servers is encrypted using industry-standard TLS (Transport Layer Security).',
      'Passwords are never stored in plain text — they are hashed using bcrypt before being saved.',
      'We regularly review our security practices and update them to protect against new threats.',
    ],
  },
  {
    icon: '🤝',
    title: '4. Sharing Your Information',
    content: [
      'We do not sell, trade, or rent your personal information to third parties.',
      'We may share anonymized, aggregated data with research partners to advance sustainability efforts.',
      'We may disclose information if required by law or to protect the rights and safety of EcoSnap and its users.',
    ],
  },
  {
    icon: '🧒',
    title: "5. Children's Privacy",
    content: [
      'EcoSnap is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13.',
      'If you believe a child has provided us with personal information, please contact us immediately so we can take appropriate action.',
    ],
  },
  {
    icon: '✏️',
    title: '6. Your Rights & Choices',
    content: [
      'Access & Correction: You may view and update your account information at any time through the Settings page.',
      'Data Deletion: You may request deletion of your account and all associated data by contacting us at support@ecosnap.app.',
      'Opt-Out: You may opt out of non-essential communications by updating your notification preferences in Settings.',
    ],
  },
  {
    icon: '🔄',
    title: '7. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this page.',
      'We encourage you to review this policy periodically. Continued use of EcoSnap after changes constitutes acceptance of the updated policy.',
    ],
  },
  {
    icon: '📬',
    title: '8. Contact Us',
    content: [
      'If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us:',
      'Email: support@ecosnap.app',
      'Website: www.ecosnap.app/contact',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="pp-page">
      <div className="pp-hero">
        <div className="pp-hero__badge">Legal</div>
        <h1 className="pp-hero__title">Privacy Policy</h1>
        <p className="pp-hero__subtitle">
          Your privacy matters to us. This policy explains what data EcoSnap collects,
          how we use it, and the choices you have.
        </p>
        <p className="pp-hero__date">Last Updated: April 2026</p>
      </div>

      <div className="pp-intro">
        <div className="pp-intro__icon">🌿</div>
        <p>
          At <strong>EcoSnap</strong>, we are committed to protecting your personal
          information and your right to privacy. This Privacy Policy describes how we
          collect, use, and safeguard your data when you use our application and services.
          Please read it carefully.
        </p>
      </div>

      <div className="pp-sections">
        {sections.map((sec, i) => (
          <div className="pp-section" key={i}>
            <div className="pp-section__header">
              <span className="pp-section__icon">{sec.icon}</span>
              <h2 className="pp-section__title">{sec.title}</h2>
            </div>
            <ul className="pp-section__list">
              {sec.content.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pp-footer-note">
        <span>🌍</span>
        <p>
          By using EcoSnap, you agree to the collection and use of information in
          accordance with this policy. Thank you for trusting us with your data and
          for helping make the world a greener place.
        </p>
      </div>
    </div>
  );
}