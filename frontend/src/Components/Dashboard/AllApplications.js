import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AllApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching all applications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card">
      <div className="card-header">
        <h2>All System Applications</h2>
      </div>
      
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Applied Role</th>
              <th>Date</th>
              <th>CGPA</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Loading applications...</td></tr>
            ) : applications.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No applications found in the system.</td></tr>
            ) : applications.map(app => {
              const colors = ['bg-blue', 'bg-purple', 'bg-green', 'bg-orange', 'bg-teal'];
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              const initials = app.name ? app.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'ST';
              
              return (
              <tr key={app._id}>
                <td>
                  <div className="entity-cell">
                    <div className={`cand-avatar ${randomColor}`}>{initials}</div>
                    <div>
                      <div className="entity-name">{app.name}</div>
                      <div className="entity-sub">{app.university}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{fontWeight: 600}}>{app.internshipId?.title || 'Unknown Role'}</div>
                  <div style={{fontSize: '0.8rem', color: '#64748b'}}>{app.internshipId?.companyName || 'Unknown Company'}</div>
                </td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td><span className={`score ${app.cgpa > 3.5 ? 'text-success' : app.cgpa > 3.0 ? 'text-amber' : 'text-rose'}`}>{app.cgpa}/4.0</span></td>
                <td><span className={`badge ${app.status === 'Pending' ? 'warning' : 'active'}`}>{app.status}</span></td>
                <td>
                  <button className="btn-table">View Details</button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllApplications;
