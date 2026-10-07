import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, token, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-brand">
        <Link to="/">
          <span className="navbar-logo">🔄</span>
          <span>FindBack</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="navbar-links">

        {/* Logged-in user navigation */}
        {token && (
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/items"
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              Items
            </NavLink>

            <NavLink
              to="/my-reports"
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              My Activity
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              Dashboard
            </NavLink>

            {/* Profile Dropdown */}
            {user && (
              <div className="profile-menu">
                <button
                  type="button"
                  className="profile-button"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <span>👤</span>
                  <span>{user.name || 'User'}</span>
                  <span>{profileOpen ? '▲' : '▼'}</span>
                </button>

                {profileOpen && (
                  <div className="profile-dropdown">

                    <div className="profile-dropdown-email">
                      {user.email}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                    >
                      ✏️ Edit Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>

                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Logged-out user navigation */}
        {!token && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
            >
              Register
            </NavLink>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;