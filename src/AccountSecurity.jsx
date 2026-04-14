import './accountsecurity.css';

export default function AccountSecurity() {
  return (
    <div className="support-content">
      <h2>[Security] Protecting your EcoSnap Profile</h2>
      <p>Manage your data and login credentials.</p>
      <button className="security-btn">Change Password</button>
      <button className="security-btn outline">Enable Two-Factor Auth</button>
    </div>
  );
}