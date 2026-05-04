import { useNavigate } from "react-router-dom";
import './profile.css';

export default function Profile({ user }) {
  const navigate = useNavigate();

  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="profile-wrapper">
      <div className="profile-card">

        <div className="profile-avatar">
          <div
            className="avatar-circle"
            style={
              user.photoUrl
                ? { backgroundImage: `url(${user.photoUrl})`, backgroundSize: "cover" }
                : {}
            }
          >
            {user.photoUrl ? "" : initials}
          </div>
        </div>

        <div className="profile-info">

          <div className="profile-header">
            <h2>{user.firstName} {user.lastName}</h2>
            <button
              className="edit-btn"
              onClick={() => navigate("/settings")}
            >
              ✏️ EDIT
            </button>
          </div>

          <p className="info-item">{user.email}</p>
          <p className="info-item">{user.username}</p>
          {user.bio && <p className="info-item">{user.bio}</p>}
          <p className="info-item">Joined February 2026</p>
          <p className="info-item">24 scans total</p>

        </div>

      </div>
    </div>
  );
}