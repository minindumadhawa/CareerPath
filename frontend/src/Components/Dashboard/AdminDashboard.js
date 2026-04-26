import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import ManageStudents from './ManageStudents';
import ManageCompanies from './ManageCompanies';
import AICVFilter from './AICVFilter';
import AdminSettings from './AdminSettings';
import AllApplications from './AllApplications';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    internships: 0,
    pendingVerifications: 0,
    recentUsers: []
  });
  const [loadingStats, setLoadingStats] = useState(true);

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/admin/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };
  
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Super Admin' };
  const initials = user.name ? user.name.substring(0, 2).toUpperCase() : 'AD';

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/favicon.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb', letterSpacing: '-0.5px' }}>CareerPath</span>
          </Link>
          <span className="badge-admin">Admin Portal</span>
        </div>
        <nav className="sidebar-nav">
          <a href="#overview" className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}>
             <span className="nav-icon">📈</span> System Overview
          </a>
          <a href="#students" className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('students'); }}>
             <span className="nav-icon">🎓</span> Manage Students
          </a>
          <a href="#companies" className={`nav-item ${activeTab === 'companies' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('companies'); }}>
             <span className="nav-icon">🏢</span> Manage Companies
          </a>
          <a href="#internships" className={`nav-item ${activeTab === 'internships' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('internships'); }}>
             <span className="nav-icon">💼</span> All Applications
          </a>
          <a href="#ai-filter" className={`nav-item ${activeTab === 'ai-filter' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('ai-filter'); }}>
             <span className="nav-icon">🤖</span> AI CV Filter
          </a>
          <Link to="/admin/dashboard" className="nav-item">
             <span className="nav-icon">🎓</span> Career Guidance System
          </Link>
        </nav>
        
        <div className="sidebar-footer">
           <a href="#settings" className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}>
             <span className="nav-icon">⚙️</span> System Settings
           </a>
           <button onClick={handleLogout} className="logout-btn">
             <span className="nav-icon">🚪</span> Log Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
           <div className="search-bar">
             <span className="search-icon">🔍</span>
             <input type="text" placeholder="Search system records (users, jobs, IDs)..." />
           </div>
           <div className="header-actions">
             <button className="btn-add-admin">+ New Admin</button>
             <button className="icon-btn" aria-label="Notifications">🔔</button>
             <div className="user-profile">
               <div className="avatar admin-avatar">{initials}</div>
               <span>{user.name}</span>
             </div>
           </div>
        </header>

        {/* Content Area */}
        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <>
              <div className="welcome-banner admin-banner">
                <div className="welcome-text">
                   <h1>System Administration ⚙️</h1>
                   <p>Monitor platform health, verify companies, and manage all CareerPath activity.</p>
                </div>
                <div className="banner-stats">
                   <div className="b-stat"><span>Server Status</span> <strong className="text-success">Online</strong></div>
                   <div className="b-stat"><span>CPU Load</span> <strong>24%</strong></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="admin-grid modern-stats-grid">
                 <div className="stat-card">
                    <div className="stat-icon bg-indigo">👥</div>
                    <div className="stat-info">
                      <div className="stat-value">{stats.students.toLocaleString()}</div>
                      <h3>Total Students</h3>
                      <p className="stat-subtitle text-indigo">Platform users</p>
                    </div>
                 </div>
                 <div className="stat-card">
                    <div className="stat-icon bg-blue">🏢</div>
                    <div className="stat-info">
                      <div className="stat-value">{stats.companies}</div>
                      <h3>Registered Companies</h3>
                      <p className="stat-subtitle text-indigo">Verified & pending</p>
                    </div>
                 </div>
                 <div className="stat-card">
                    <div className="stat-icon bg-green">💼</div>
                    <div className="stat-info">
                      <div className="stat-value">{stats.internships}</div>
                      <h3>Active Internships</h3>
                      <p className="stat-subtitle text-success">Open positions</p>
                    </div>
                 </div>
                <div className="stat-card">
                   <div className="stat-icon bg-teal">⚡</div>
                   <div className="stat-info">
                     <div className="stat-value">100%</div>
                     <h3>System Uptime</h3>
                     <p className="stat-subtitle text-success">All services operational</p>
                   </div>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="quick-action-cards">
                  <div className="qa-card" onClick={() => setActiveTab('companies')}>
                     <div className="qa-icon">🏢</div>
                     <h4>Verify Companies</h4>
                     <p>{stats.pendingVerifications} pending verifications</p>
                  </div>
                 <div className="qa-card" onClick={() => setActiveTab('ai-filter')}>
                    <div className="qa-icon">🤖</div>
                    <h4>AI CV Filter</h4>
                    <p>Run ranking algorithms</p>
                 </div>
                 <div className="qa-card" onClick={() => setActiveTab('settings')}>
                    <div className="qa-icon">⚙️</div>
                    <h4>System Settings</h4>
                    <p>Manage platform rules</p>
                 </div>
              </div>

              <div className="dashboard-columns mt-4">
                 {/* Left Column - Alerts */}
                 <div className="dashboard-col flex-1">
                    <div className="section-card alert-card">
                       <div className="card-header">
                         <h2>System Alerts</h2>
                       </div>
                       <div className="alert-list">
                           <div className="alert-item warning">
                              <div className="alert-icon">⚠️</div>
                              <div className="alert-info">
                                <h4>{stats.pendingVerifications} Companies Pending Verification</h4>
                                <p>Please review submitted documents.</p>
                              </div>
                           </div>
                          <div className="alert-item success">
                             <div className="alert-icon">✅</div>
                             <div className="alert-info">
                               <h4>Database Backup Complete</h4>
                               <p>Last triggered at 03:00 AM.</p>
                             </div>
                          </div>
                          <div className="alert-item info">
                             <div className="alert-icon">ℹ️</div>
                             <div className="alert-info">
                               <h4>New App Version v2.1</h4>
                               <p>Ready for deployment tonight.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Right Column - Recent Registrations */}
                 <div className="dashboard-col flex-2">
                    <div className="section-card">
                       <div className="card-header">
                         <h2>Recent Registrations</h2>
                         <button className="btn-table" onClick={() => setActiveTab('students')}>Manage Users</button>
                       </div>
                       
                       <div className="table-responsive">
                         <table className="data-table admin-table">
                           <thead>
                             <tr>
                               <th>User / Entity</th>
                               <th>Role</th>
                               <th>Date Joined</th>
                               <th>Status</th>
                               <th>Actions</th>
                             </tr>
                           </thead>
                           <tbody>
                              {stats.recentUsers.map(u => (
                                <tr key={u._id}>
                                  <td>
                                    <div className="entity-cell">
                                      <div className={`cand-avatar bg-${u.role === 'student' ? 'blue' : 'teal'}`}>
                                        {(u.fullName || u.name || 'U')[0].toUpperCase()}
                                      </div>
                                      <div>
                                        <div className="entity-name">{u.email}</div>
                                        <div className="entity-sub">{u.fullName || u.name || 'N/A'}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td><span className={`role-tag ${u.role}`}>{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span></td>
                                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                  <td><span className={`badge ${u.isVerified !== false ? 'active' : 'warning'}`}>{u.isVerified !== false ? 'Active' : 'Pending'}</span></td>
                                  <td><button className="btn-table" onClick={() => setActiveTab(u.role === 'student' ? 'students' : 'companies')}>Manage</button></td>
                                </tr>
                              ))}
                            </tbody>
                         </table>
                       </div>
                    </div>
                 </div>
              </div>
            </>
          )}
          {activeTab === 'students' && <ManageStudents />}
          {activeTab === 'companies' && <ManageCompanies />}
          {activeTab === 'internships' && <AllApplications />}
          {activeTab === 'ai-filter' && <AICVFilter />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
