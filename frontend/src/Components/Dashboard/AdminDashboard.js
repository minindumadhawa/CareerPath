import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import ManageStudents from './ManageStudents';
import ManageCompanies from './ManageCompanies';
import AICVFilter from './AICVFilter';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <Link to="/">CareerPath</Link>
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
             <span className="nav-icon">💼</span> All Internships
          </a>
          <a href="#reports" className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('reports'); }}>
             <span className="nav-icon">📑</span> Reports & Analytics
          </a>
          <a href="#ai-filter" className={`nav-item ${activeTab === 'ai-filter' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('ai-filter'); }}>
             <span className="nav-icon">🤖</span> AI CV Filter
          </a>
        </nav>
        
        <div className="sidebar-footer">
           <a href="#settings" className="nav-item">
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
               <div className="avatar admin-avatar">AD</div>
               <span>Super Admin</span>
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
          </div>

          <div className="dashboard-grid admin-grid">
            {/* Stats Cards */}
            <div className="stat-card">
               <h3>Total Students</h3>
               <div className="stat-value">10,245</div>
               <p className="stat-subtitle text-indigo">+120 this week</p>
            </div>
            <div className="stat-card">
               <h3>Registered Companies</h3>
               <div className="stat-value">512</div>
               <p className="stat-subtitle text-indigo">+8 this week</p>
            </div>
            <div className="stat-card">
               <h3>Active Internships</h3>
               <div className="stat-value">2,108</div>
               <p className="stat-subtitle text-success">Healthy ecosystem</p>
            </div>
            <div className="stat-card">
               <h3>System Status</h3>
               <div className="stat-value">100%</div>
               <p className="stat-subtitle text-success">All services operational</p>
            </div>
          </div>

          <div className="dashboard-columns">
             {/* Left Column - Recent Registrations */}
             <div className="dashboard-col flex-2">
                <div className="section-card">
                   <div className="card-header">
                     <h2>Recent Registrations</h2>
                     <a href="#users" className="view-all">Manage All Users</a>
                   </div>
                   
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
                       <tr>
                         <td>
                           <div className="entity-cell">
                             <div className="cand-avatar bg-blue">S</div>
                             <div>
                               <div className="entity-name">sam.wilson@university.edu</div>
                               <div className="entity-sub">Sam Wilson</div>
                             </div>
                           </div>
                         </td>
                         <td><span className="role-tag student">Student</span></td>
                         <td>Just now</td>
                         <td><span className="badge active">Active</span></td>
                         <td><button className="btn-table">Manage</button></td>
                       </tr>
                       <tr>
                         <td>
                           <div className="entity-cell">
                             <div className="cand-avatar bg-teal">T</div>
                             <div>
                               <div className="entity-name">hr@techinnovators.com</div>
                               <div className="entity-sub">Tech Innovators LLC</div>
                             </div>
                           </div>
                         </td>
                         <td><span className="role-tag company">Company</span></td>
                         <td>2 hours ago</td>
                         <td><span className="badge warning">Needs Verification</span></td>
                         <td><button className="btn-table">Verify</button></td>
                       </tr>
                       <tr>
                         <td>
                           <div className="entity-cell">
                             <div className="cand-avatar bg-purple">E</div>
                             <div>
                               <div className="entity-name">emma.r@college.edu</div>
                               <div className="entity-sub">Emma Roberts</div>
                             </div>
                           </div>
                         </td>
                         <td><span className="role-tag student">Student</span></td>
                         <td>Yesterday</td>
                         <td><span className="badge active">Active</span></td>
                         <td><button className="btn-table">Manage</button></td>
                       </tr>
                     </tbody>
                   </table>
                </div>
             </div>
             
             {/* Right Column - Quick Actions & Alerts */}
             <div className="dashboard-col flex-1">
                <div className="section-card alert-card">
                   <div className="card-header">
                     <h2>System Alerts</h2>
                   </div>
                   <div className="alert-list">
                      <div className="alert-item warning">
                         <div className="alert-icon">⚠️</div>
                         <div className="alert-info">
                           <h4>15 Companies Pending Verification</h4>
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
                   
                   <div className="quick-actions mt-4">
                     <h3>Quick Actions</h3>
                     <button className="btn-outline-admin mt-2">Generate Monthly Report</button>
                     <button className="btn-outline-admin mt-2">Broadcast Message</button>
                   </div>
                </div>
             </div>
          </div>
          </>
          )}
          {activeTab === 'students' && <ManageStudents />}
          {activeTab === 'companies' && <ManageCompanies />}
          {activeTab === 'ai-filter' && <AICVFilter />}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
