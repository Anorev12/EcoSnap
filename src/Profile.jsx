import { useNavigate } from "react-router-dom";
import './profile.css';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="profile-wrapper">
      <div className="profile-card">

        <div className="profile-avatar">
          <div className="avatar-circle">👤</div>
        </div>

        <div className="profile-info">

          <div className="profile-header">
            <h2>John Doe</h2>

            <button 
              className="edit-btn"
              onClick={() => navigate("/settings")}
            >
              ✏️ EDIT
            </button>
          </div>

          <p className="info-item">john.doe@gmail.com</p>
          <p className="info-item">Cebu City, PH</p>
          <p className="info-item">Joined February 2026</p>
          <p className="info-item">24 scans total</p>

        </div>

      </div>
    </div>
  );
}