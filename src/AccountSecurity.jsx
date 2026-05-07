import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './accountsecurity.css';

export default function AccountSecurity({ user, deleteUserAccount }) {
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);

  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This cannot be undone."
    );
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

  const securityTips = [
    { icon: '🔑', tip: 'Use a unique password not used on other sites.' },
    { icon: '📵', tip: 'Never share your login credentials with anyone.' },
    { icon: '🔒', tip: 'Enable two-factor authentication for extra protection.' },
  ];

  return (
    <div className="support-content">

      <div className="page-header">
        <h2>Account Security</h2>
        <p>Manage your login credentials and keep your EcoSnap profile protected.</p>
      </div>

      <div className="security-grid">

        <div className="security-card">
          <div className="card-icon-wrap icon-green">
            <span role="img" aria-hidden="true">🔐</span>
          </div>
          <div className="card-body">
            <h3>Password</h3>
            <p>Update your password regularly to keep your account secure.</p>
            <button
              className="sec-btn primary"
              onClick={() => navigate('/settings', { state: { scrollTo: 'password' } })}
            >
              Change password →
            </button>
          </div>
        </div>

        <div className="security-card">
          <div className="card-icon-wrap icon-blue">
            <span role="img" aria-hidden="true">📲</span>
          </div>
          <div className="card-body">
            <h3>Two-factor authentication</h3>
            <p>Add a second layer of security to verify your identity on login.</p>
            <button className="sec-btn outline">Enable 2FA →</button>
          </div>
        </div>

        <div className="security-card">
          <div className="card-icon-wrap icon-amber">
            <span role="img" aria-hidden="true">🖥️</span>
          </div>
          <div className="card-body">
            <h3>Active sessions</h3>
            <p>Review and sign out of devices where your account is currently logged in.</p>
            <button className="sec-btn outline">Manage sessions →</button>
          </div>
        </div>

      </div>

      <div className="tips-section">
        <h4>Security tips</h4>
        <div className="tips-list">
          {securityTips.map((item, i) => (
            <div className="tip-row" key={i}>
              <span className="tip-icon" role="img" aria-hidden="true">{item.icon}</span>
              <p>{item.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
          <div className="danger-zone">
      <div className="danger-header">
        <span role="img" aria-hidden="true">⚠️</span>
        <h4>Danger zone</h4>
      </div>
      <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
      
      <div className="confirmation-wrapper">
        <label className="checkbox-container">
          <input 
            type="checkbox" 
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
          />
          <span className="checkbox-text">I understand that this action is permanent and irreversible.</span>
        </label>
      </div>

      <button
        className="sec-btn danger"
        onClick={handleDeleteAccount}
        disabled={deleting || !isConfirmed}
      >
        {deleting ? 'Deleting...' : 'Delete account'}
      </button>
    </div>

    </div>
  );
}