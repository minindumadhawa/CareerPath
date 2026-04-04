import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CompanyDashboard.css';

function CompanyDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="company-dashboard-layout">
      {/* Sidebar */}
      <aside className="company-sidebar">
        <div className="sidebar-logo">
          <Link to="/">CareerPath</Link>
          <span className="badge-employer">Employer</span>
        </div>
        <nav className="sidebar-nav">
          <a href="#dashboard" className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>
             <span className="nav-icon">📊</span> Dashboard
          </a>
          <a href="#postings" className={`nav-item ${activeTab === 'postings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('postings'); }}>
             <span className="nav-icon">💼</span> My Internships
          </a>
          <a href="#applications" className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('applications'); }}>
             <span className="nav-icon">📝</span> Applications
          </a>
          <a href="#candidates" className={`nav-item ${activeTab === 'candidates' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('candidates'); }}>
             <span className="nav-icon">👥</span> Talent Search
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
             <input type="text" placeholder="Search candidates, skills, or titles..." />
           </div>
           <div className="header-actions">
             <button className="btn-post-job">+ Post Internship</button>
             <button className="icon-btn" aria-label="Notifications">🔔</button>
             <div className="user-profile">
               <div className="avatar company-avatar">AC</div>
               <span>Acme Corp</span>
             </div>
           </div>
        </header>

        {/* Content Area */}
        {/* Content Area */}
        <div className="dashboard-content">
          {activeTab === 'dashboard' && (
            <>
              <div className="welcome-banner company-banner">
                <div className="welcome-text">
                   <h1>Welcome back, Acme Corp ✨</h1>
                   <p>Here’s an overview of your recruitment pipeline today.</p>
                </div>
                <div className="banner-stats">
                   <div className="mini-stat">
                     <span className="ms-val">84</span>
                     <span className="ms-label">New Applicants</span>
                   </div>
                </div>
              </div>

              <div className="dashboard-grid">
                {/* Stats Cards */}
                <div className="stat-card">
                   <h3>Active Internships</h3>
                   <div className="stat-value">5</div>
                   <p className="stat-subtitle text-teal">2 closing soon</p>
                </div>
                <div className="stat-card">
                   <h3>Total Applications</h3>
                   <div className="stat-value">342</div>
                   <p className="stat-subtitle text-teal">+12% vs last month</p>
                </div>
                <div className="stat-card">
                   <h3>Interviews Scheduled</h3>
                   <div className="stat-value">12</div>
                   <p className="stat-subtitle">4 happening this week</p>
                </div>
              </div>

              <div className="dashboard-columns">
                 {/* Left Column - Recent Applications */}
                 <div className="dashboard-col flex-2">
                    <div className="section-card">
                       <div className="card-header">
                         <h2>Recent Applications</h2>
                         <a href="#all" className="view-all">View All</a>
                       </div>
                       
                       <table className="data-table">
                         <thead>
                           <tr>
                             <th>Candidate</th>
                             <th>Role Applied</th>
                             <th>Match Score</th>
                             <th>Status</th>
                             <th>Action</th>
                           </tr>
                         </thead>
                         <tbody>
                           <tr>
                             <td>
                               <div className="candidate-cell">
                                 <div className="cand-avatar bg-blue">JD</div>
                                 <div>
                                   <div className="cand-name">John Doe</div>
                                   <div className="cand-uni">Harvard University</div>
                                 </div>
                               </div>
                             </td>
                             <td>Software Engineer Intern</td>
                             <td><span className="score high">98%</span></td>
                             <td><span className="badge pending">Pending</span></td>
                             <td><button className="btn-table">Review</button></td>
                           </tr>
                           <tr>
                             <td>
                               <div className="candidate-cell">
                                 <div className="cand-avatar bg-purple">AS</div>
                                 <div>
                                   <div className="cand-name">Alice Smith</div>
                                   <div className="cand-uni">Stanford University</div>
                                 </div>
                               </div>
                             </td>
                             <td>Product Designer Intern</td>
                             <td><span className="score high">92%</span></td>
                             <td><span className="badge interviewing">Interviewing</span></td>
                             <td><button className="btn-table">Review</button></td>
                           </tr>
                           <tr>
                             <td>
                               <div className="candidate-cell">
                                 <div className="cand-avatar bg-green">RJ</div>
                                 <div>
                                   <div className="cand-name">Robert Jones</div>
                                   <div className="cand-uni">MIT</div>
                                 </div>
                               </div>
                             </td>
                             <td>Data Science Intern</td>
                             <td><span className="score med">75%</span></td>
                             <td><span className="badge reviewed">Reviewed</span></td>
                             <td><button className="btn-table">Review</button></td>
                           </tr>
                         </tbody>
                       </table>
                    </div>
                 </div>
                 
                 {/* Right Column - Top Talent Matches */}
                 <div className="dashboard-col flex-1">
                    <div className="section-card">
                       <div className="card-header">
                         <h2>Top AI Recommendations</h2>
                       </div>
                       <div className="talent-list">
                          <div className="talent-item">
                             <div className="cand-avatar bg-orange">EK</div>
                             <div className="talent-info">
                               <h4>Elena K.</h4>
                               <p>React, Node.js, Python</p>
                             </div>
                             <button className="btn-icon-outline">✉️</button>
                          </div>
                          <div className="talent-item">
                             <div className="cand-avatar bg-teal">ML</div>
                             <div className="talent-info">
                               <h4>Mike L.</h4>
                               <p>Figma, UI/UX, CSS</p>
                             </div>
                             <button className="btn-icon-outline">✉️</button>
                          </div>
                          <div className="talent-item">
                             <div className="cand-avatar bg-indigo">SJ</div>
                             <div className="talent-info">
                               <h4>Sarah J.</h4>
                               <p>Machine Learning, SQL</p>
                             </div>
                             <button className="btn-icon-outline">✉️</button>
                          </div>
                       </div>
                       <button className="btn-outline-company mt-3">Discover More Talent</button>
                    </div>
                 </div>
              </div>
            </>
          )}

          {activeTab === 'postings' && (
            <div className="internships-tab">
               <div className="tab-header">
                  <div>
                    <h2>My Internships</h2>
                    <p>Manage your active and past internship postings</p>
                  </div>
                  <button className="btn-post-job">+ Create New</button>
               </div>
               
               <div className="internships-filters">
                 <button className="filter-btn active">All (5)</button>
                 <button className="filter-btn">Active (3)</button>
                 <button className="filter-btn">Drafts (1)</button>
                 <button className="filter-btn">Closed (1)</button>
               </div>

               <div className="internships-list">
                 {/* Internship Card 1 */}
                 <div className="internship-card">
                    <div className="icard-header">
                      <h3>Software Engineering Intern</h3>
                      <span className="badge badge-active">Active</span>
                    </div>
                    <div className="icard-details">
                      <span>📍 San Francisco, CA (Hybrid)</span>
                      <span>💰 $45/hr</span>
                      <span>📅 Posted 3 days ago</span>
                    </div>
                    <div className="icard-metrics">
                      <div className="metric"><strong>128</strong> Views</div>
                      <div className="metric"><strong>34</strong> Applicants</div>
                      <div className="metric"><strong>5</strong> Shortlisted</div>
                    </div>
                    <div className="icard-actions">
                      <button className="btn-outline-company">View Applicants</button>
                      <button className="btn-icon">✏️</button>
                    </div>
                 </div>

                 {/* Internship Card 2 */}
                 <div className="internship-card">
                    <div className="icard-header">
                      <h3>Product Design Intern</h3>
                      <span className="badge badge-active">Active</span>
                    </div>
                    <div className="icard-details">
                      <span>📍 Remote</span>
                      <span>💰 $40/hr</span>
                      <span>📅 Posted 1 week ago</span>
                    </div>
                    <div className="icard-metrics">
                      <div className="metric"><strong>312</strong> Views</div>
                      <div className="metric"><strong>85</strong> Applicants</div>
                      <div className="metric"><strong>12</strong> Shortlisted</div>
                    </div>
                    <div className="icard-actions">
                      <button className="btn-outline-company">View Applicants</button>
                      <button className="btn-icon">✏️</button>
                    </div>
                 </div>

                 {/* Internship Card 3 */}
                 <div className="internship-card">
                    <div className="icard-header">
                      <h3>Data Science Intern</h3>
                      <span className="badge badge-draft">Draft</span>
                    </div>
                    <div className="icard-details">
                      <span>📍 New York, NY</span>
                      <span>💰 TBD</span>
                      <span>📅 Last edited 2 days ago</span>
                    </div>
                    <div className="icard-metrics">
                      <div className="metric text-muted">Not published</div>
                    </div>
                    <div className="icard-actions">
                      <button className="btn-outline-company">Edit & Publish</button>
                      <button className="btn-icon text-danger">🗑️</button>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {['applications', 'candidates', 'interviews'].includes(activeTab) && (
            <div className="coming-soon">
               <h2>More Features Coming Soon</h2>
               <p>We are currently building out this section of your dashboard.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CompanyDashboard;
