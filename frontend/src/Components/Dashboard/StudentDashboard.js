import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import StudentProfile from './StudentProfile';

function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    // Logic for logging out (clear local storage etc.)
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <Link to="/">CareerPath</Link>
        </div>
        <nav className="sidebar-nav">
          <a href="#dashboard" className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>
             <span className="nav-icon">📊</span> Overview
          </a>
          <a href="#profile" className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}>
             <span className="nav-icon">👤</span> My Profile
          </a>
          <a href="#applications" className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('applications'); }}>
             <span className="nav-icon">📝</span> Applications
          </a>
          <a href="#saved" className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('saved'); }}>
             <span className="nav-icon">⭐</span> Saved Internships
          </a>
          <a href="#interviews" className={`nav-item ${activeTab === 'interviews' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('interviews'); }}>
             <span className="nav-icon">🤝</span> Interviews
          </a>
        </nav>
        
        <div className="sidebar-footer">
           <a href="#settings" className="nav-item">
             <span className="nav-icon">⚙️</span> Settings
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
             <input type="text" placeholder="Search internships, companies..." />
           </div>
           <div className="header-actions">
             <button className="icon-btn" aria-label="Notifications">🔔</button>
             <div className="user-profile">
               <div className="avatar">JD</div>
               <span>Student</span>
             </div>
           </div>
        </header>

        {/* Content Area */}
        <div className="dashboard-content">
          {activeTab === 'dashboard' && (
            <>
              <div className="welcome-banner">
            <div className="welcome-text">
               <h1>Welcome back! 👋</h1>
               <p>Here’s what’s happening with your internship search today.</p>
            </div>
            <button className="btn-upload">Update Resume</button>
          </div>

          <div className="dashboard-grid">
            {/* Stats Cards */}
            <div className="stat-card">
               <h3>Applications</h3>
               <div className="stat-value">12</div>
               <p className="stat-subtitle text-success">+2 this week</p>
            </div>
            <div className="stat-card">
               <h3>Interviews</h3>
               <div className="stat-value">3</div>
               <p className="stat-subtitle">Upcoming soon</p>
            </div>
            <div className="stat-card">
               <h3>Profile Views</h3>
               <div className="stat-value">45</div>
               <p className="stat-subtitle text-success">+15% vs last week</p>
            </div>
          </div>

          <div className="dashboard-columns">
             {/* Left Column - Recommendations */}
             <div className="dashboard-col flex-2">
                <div className="section-card">
                   <div className="card-header">
                     <h2>Recommended Internships</h2>
                     <a href="#all" className="view-all">View All</a>
                   </div>
                   
                   <div className="job-list">
                      <div className="job-item">
                         <div className="job-logo bg-purple">G</div>
                         <div className="job-details">
                           <h4>Software Engineer Intern</h4>
                           <p>Google • San Francisco, CA (Remote)</p>
                         </div>
                         <button className="btn-apply">Apply</button>
                      </div>
                      
                      <div className="job-item">
                         <div className="job-logo bg-blue">M</div>
                         <div className="job-details">
                           <h4>Data Science Intern</h4>
                           <p>Meta • New York, NY</p>
                         </div>
                         <button className="btn-apply">Apply</button>
                      </div>
                      
                      <div className="job-item">
                         <div className="job-logo bg-green">S</div>
                         <div className="job-details">
                           <h4>Product Designer Intern</h4>
                           <p>Spotify • London, UK</p>
                         </div>
                         <button className="btn-apply">Apply</button>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Right Column - Profile Completeness */}
             <div className="dashboard-col flex-1">
                <div className="section-card completeness-card">
                   <h2>Profile Completeness</h2>
                   <div className="progress-circle">
                      <div className="progress-text">85%</div>
                   </div>
                   <ul className="todo-list">
                      <li className="completed"><span>✓</span> Basic Information</li>
                      <li className="completed"><span>✓</span> Education Details</li>
                      <li className="completed"><span>✓</span> Upload Resume</li>
                      <li className="pending"><span>○</span> Add Portfolio Link</li>
                   </ul>
                   <button className="btn-outline-primary">Complete Profile</button>
                </div>
             </div>
          </div>
          </>
          )}
          {activeTab === 'profile' && <StudentProfile />}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
