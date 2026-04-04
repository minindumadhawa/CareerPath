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
    <header className="dashboard-header">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Search career resources, quizzes..." />
      </div>
      
      <div className="header-actions">
        {isAdmin && <button className="btn-add-admin">+ New Resource</button>}
        <button className="icon-btn" aria-label="Notifications">🔔</button>
        <div className="user-profile">
          <div className="avatar" style={isAdmin ? {backgroundColor: '#4338ca'} : {}}>{initials}</div>
          <span>{isAdmin ? 'Admin' : 'Student'}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
