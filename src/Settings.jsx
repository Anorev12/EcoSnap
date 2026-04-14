import { useNavigate,Link } from 'react-router-dom';
import "./settings.css";

export default function Settings() {
    const navigate = useNavigate();
     const handleLogout = () => {
    navigate("/login");
  };
  return (
    <div className="settings-page">
      

      {/* BODY */}
      <div className="settings-body">
        
        {/* SIDEBAR */}
        <div className="sidebar">
          <h3>Account</h3>
          <ul>
            <li className="active">Profile</li>
            <li>Account & Security</li>
          </ul>

          <h3>Preferences</h3>
          <ul>
            <li>Notifications</li>
            <li>Appearance</li>
            <li>Language & Region</li>
          </ul>

          <h3>App</h3>
          <ul>
            <li>Privacy & Data</li>
            <li>Storage & Usage</li>
            <li>Active Sessions</li>
          </ul>

          <h3>Support</h3>
          <ul>
            <li><Link to="/about">About EcoSnap</Link></li>
          </ul>

          <button className="logout" onClick={handleLogout}>Log Out</button>
        </div>

        {/* CONTENT */}
        <div className="content">
          {/* Empty gray area (as in your screenshot) */}
        </div>

      </div>
    </div>
  );
}