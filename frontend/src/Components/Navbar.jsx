import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // get user initials
  let initials = isAdmin ? 'AD' : 'U'; // default fallback
  try {
    const userStr = localStorage.getItem('user');
    const guestStr = sessionStorage.getItem('careerpath_student');
    let name = '';
    
    if (userStr) {
      const user = JSON.parse(userStr);
      name = user.name || user.firstName || user.username || user.email || '';
    } else if (guestStr) {
      const guest = JSON.parse(guestStr);
      name = guest.name || guest.email || '';
    }
    
    if (name && name.includes('@')) {
      initials = name.substring(0, 2).toUpperCase();
    } else if (name) {
      const parts = name.trim().split(' ').filter(Boolean);
      if (parts.length >= 2) {
        initials = (parts[0][0] + parts[1][0]).toUpperCase();
      } else if (parts.length === 1) {
        initials = parts[0].substring(0, 2).toUpperCase();
      }
    }
  } catch (e) {
    console.error("Error parsing user data for avatar", e);
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-breadcrumb">CareerPath /</span>
        <span className="navbar-page-title">
          {isAdmin ? 'Admin Panel' : 'Student Portal'}
        </span>
      </div>
      <div className="navbar-right">
        <div className="role-switch">
          <button
            className="role-btn active"
            onClick={() => navigate(isAdmin ? '/admin-dashboard' : '/student-dashboard')}
          >
            ⬅️ Back to Portal
          </button>
        </div>
        <div className="user-avatar">{initials}</div>
      </div>
    </nav>
  );
};

export default Navbar;
