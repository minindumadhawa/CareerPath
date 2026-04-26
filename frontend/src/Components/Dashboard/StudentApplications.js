import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'; // Reusing table styles

function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        const studentId = parsedUser.id || parsedUser._id;
        const res = await fetch(`http://localhost:5001/api/applications/student/${studentId}`);
        if (res.ok) {
          const data = await res.json();
          setApplications(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="applications-tab">
      <div className="tab-header">
        <div>
          <h2>My Applications</h2>
          <p>Track the status of all your internship applications.</p>
        </div>
      </div>
      
      <div className="section-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role Applied</th>
                <th>Applied On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>Loading applications...</td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>You haven't applied to any internships yet.</td></tr>
              ) : applications.map(app => {
                const companyName = app.internshipId?.companyId?.fullName || 'Unknown Company';
                const colors = ['bg-blue', 'bg-purple', 'bg-green', 'bg-orange', 'bg-teal'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const initials = companyName.substring(0, 2).toUpperCase();
                
                return (
                <tr key={app._id}>
                  <td>
                    <div className="entity-cell">
                      <div className={`cand-avatar ${randomColor}`}>{initials}</div>
                      <div>
                        <div className="entity-name">{companyName}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{fontWeight: 600}}>{app.internshipId?.title || 'Unknown Role'}</div>
                  </td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${app.status.toLowerCase()}`}>{app.status}</span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentApplications;
