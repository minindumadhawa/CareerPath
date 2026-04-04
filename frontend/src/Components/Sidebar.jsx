import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const studentLinks = [
    { to: '/student/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/student/leadership', icon: '🏆', label: 'Leadership Programs' },
    { to: '/student/technical', icon: '💻', label: 'Technical Resources' },
    { to: '/student/quizzes', icon: '📝', label: 'Skill Tests' },
    { to: '/student/progress', icon: '📊', label: 'My Progress' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/leadership/add', icon: '➕', label: 'Add Leadership Program' },
    { to: '/admin/leadership/manage', icon: '🏆', label: 'Manage Leadership' },
    { to: '/admin/technical/add', icon: '➕', label: 'Add Technical Resource' },
    { to: '/admin/technical/manage', icon: '💻', label: 'Manage Technical' },
    { to: '/admin/quiz/add', icon: '➕', label: 'Add Quiz' },
    { to: '/admin/quiz/manage', icon: '📝', label: 'Manage Quizzes' },
    { to: '/admin/quiz/results', icon: '📈', label: 'Quiz Results' },
    { to: '/admin/enrollments', icon: '👥', label: 'Enrollment Report' },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">
        <NavLink to="/" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>CareerPath</NavLink>
        {isAdmin && <span className="badge-admin" style={{ marginLeft: 8, fontSize: '0.7rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: 10 }}>Admin Panel</span>}
      </div>
      
      <nav className="sidebar-nav">
        {isAdmin ? (
          <>
            <div style={{ padding: '1rem 1rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Career Guidance Admin</div>
            {adminLinks.map(link => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </>
        ) : (
          <>
            <div style={{ padding: '1rem 1rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Career Guidance</div>
            {studentLinks.map(link => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <NavLink to={isAdmin ? '/admin-dashboard' : '/student-dashboard'} className="nav-item" style={{ background: '#f1f5f9' }}>
          <span className="nav-icon">⬅️</span> Back to Portal
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
