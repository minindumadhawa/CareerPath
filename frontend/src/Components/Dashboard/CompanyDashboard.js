import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CompanyDashboard.css';

function CompanyDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Internship states
  const [internships, setInternships] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', position: '', location: '', 
    duration: '', stipend: '', requirements: '', skills: '', 
    applicationDeadline: '', startDate: '', totalPositions: 1
  });

  const fetchInternships = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const companyId = JSON.parse(userStr)._id;
        const res = await fetch(`http://localhost:5000/api/internships/company/${companyId}`);
        if (res.ok) {
          const data = await res.json();
          setInternships(data.data || []);
        }
      }
    } catch (e) {
      console.error('Error fetching internships:', e);
    }
  };

  useEffect(() => {
    if (activeTab === 'postings') {
      fetchInternships();
    }
  }, [activeTab]);

  const handleCreateInternship = async (e) => {
    e.preventDefault();
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('Please log in again');
        return;
      }
      const companyId = JSON.parse(userStr)._id;
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);

      const res = await fetch('http://localhost:5000/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, skills: skillsArray, companyId })
      });

      if (res.ok) {
        setShowCreateForm(false);
        setFormData({
          title: '', description: '', position: '', location: '', 
          duration: '', stipend: '', requirements: '', skills: '', 
          applicationDeadline: '', startDate: '', totalPositions: 1
        });
        fetchInternships();
      } else {
        alert('Failed to post internship');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  };

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
                  {!showCreateForm && (
                     <button className="btn-post-job" onClick={() => setShowCreateForm(true)}>+ Create New</button>
                  )}
               </div>

               {showCreateForm ? (
                  <div className="internship-form-card">
                     <div className="form-header-row">
                        <h3>Post a New Internship</h3>
                        <button className="btn-icon" onClick={() => setShowCreateForm(false)}>✖</button>
                     </div>
                     <form onSubmit={handleCreateInternship} className="premium-form">
                        <div className="form-grid-2">
                           <div className="input-group">
                              <label>Job Title</label>
                              <input type="text" required placeholder="e.g. Software Engineer Intern" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                           </div>
                           <div className="input-group">
                              <label>Position / Role</label>
                              <input type="text" required placeholder="e.g. Full Stack Developer" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
                           </div>
                           <div className="input-group">
                              <label>Location</label>
                              <input type="text" required placeholder="e.g. Remote, San Francisco" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                           </div>
                           <div className="input-group">
                              <label>Duration</label>
                              <input type="text" required placeholder="e.g. 3 Months, 6 Months" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                           </div>
                           <div className="input-group">
                              <label>Stipend / Salary</label>
                              <input type="text" required placeholder="e.g. $40/hr or Unpaid" value={formData.stipend} onChange={e => setFormData({...formData, stipend: e.target.value})} />
                           </div>
                           <div className="input-group">
                              <label>Total Positions</label>
                              <input type="number" required min="1" value={formData.totalPositions} onChange={e => setFormData({...formData, totalPositions: e.target.value})} />
                           </div>
                           <div className="input-group">
                              <label>Start Date</label>
                              <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                           </div>
                           <div className="input-group">
                              <label>Application Deadline</label>
                              <input type="date" value={formData.applicationDeadline} onChange={e => setFormData({...formData, applicationDeadline: e.target.value})} />
                           </div>
                        </div>

                        <div className="input-group full-width mt-3">
                           <label>Required Skills (Comma separated)</label>
                           <input type="text" placeholder="React, Node.js, Python" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
                        </div>
                        <div className="input-group full-width mt-3">
                           <label>Requirements & Qualifications</label>
                           <textarea rows="3" required placeholder="Describe what you are looking for..." value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})}></textarea>
                        </div>
                        <div className="input-group full-width mt-3">
                           <label>Job Description</label>
                           <textarea rows="4" required placeholder="Detailed description of the role..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                        </div>

                        <div className="form-actions mt-4">
                           <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)}>Cancel</button>
                           <button type="submit" className="btn-primary-gradient">Publish Internship</button>
                        </div>
                     </form>
                  </div>
               ) : (
                  <>
                     <div className="internships-filters">
                       <button className="filter-btn active">All ({internships.length})</button>
                       <button className="filter-btn">Active ({internships.filter(i => i.status === 'Active').length})</button>
                       <button className="filter-btn">Drafts ({internships.filter(i => i.status === 'Draft').length})</button>
                       <button className="filter-btn">Closed ({internships.filter(i => i.status === 'Closed').length})</button>
                     </div>

                     <div className="internships-list">
                       {internships.length === 0 ? (
                         <div className="coming-soon">
                            <h2>No Internships Posted Yet</h2>
                            <p>Click "+ Create New" to post your first internship opportunity.</p>
                         </div>
                       ) : internships.map(intern => (
                         <div className="internship-card" key={intern._id}>
                            <div className="icard-header">
                              <h3>{intern.title}</h3>
                              <span className={`badge badge-${intern.status.toLowerCase()}`}>{intern.status}</span>
                            </div>
                            <div className="icard-details">
                              <span>📍 {intern.location}</span>
                              <span>💰 {intern.stipend}</span>
                              <span>⏱️ {intern.duration}</span>
                              <span>📅 {new Date(intern.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="icard-metrics">
                              <div className="metric"><strong>0</strong> Views</div>
                              <div className="metric"><strong>0</strong> Applicants</div>
                              <div className="metric"><strong>{intern.totalPositions}</strong> Spots</div>
                            </div>
                            <div className="icard-actions">
                              <button className="btn-outline-company">View Applicants</button>
                              <button className="btn-icon">✏️</button>
                            </div>
                         </div>
                       ))}
                     </div>
                  </>
               )}
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
