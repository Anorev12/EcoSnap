import { NavLink } from 'react-router-dom';
import logo from './Logo/EcoSnap_LOGO_4.png';
import './dashboard.css';

export default function Navbar({ user }) {
  return (
    <nav className="nav-wrapper">

      <div className="nav-logo-wrap">
        <img className="nav-logo-img" src={logo} alt="EcoSnap Logo" />
      </div>

      <div className="nav-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item nav-item--active" : "nav-item"
          }
        >
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? "nav-item nav-item--active" : "nav-item"
          }
        >
          <span className="nav-icon">🕐</span>
          <span>History</span>
        </NavLink>

        <NavLink
          to="/tipsandfacts"
          className={({ isActive }) =>
            isActive ? "nav-item nav-item--active" : "nav-item"
          }
        >
          <span className="nav-icon">📋</span>
          <span>Tips & Facts</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "nav-item nav-item--active" : "nav-item"
          }
        >
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </NavLink>
      </div>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? "nav-item nav-item--active" : "nav-item nav-user"
        }
      >
        <span>{user.firstName} {user.lastName}</span>
        <div
          className="nav-avatar"
          style={
            user.photoUrl
              ? { backgroundImage: `url(${user.photoUrl})`, backgroundSize: "cover" }
              : {}
          }
        >
          {user.photoUrl ? "" : "👤"}
        </div>
      </NavLink>

    </nav>
  );
}