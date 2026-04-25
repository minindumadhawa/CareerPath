import React, { useState, useEffect } from 'react';

function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div style={{ padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '0.25rem' }}>My Applications</h2>
          <p style={{ color: '#64748b' }}>Track the status of your internship applications.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading Applications...</div>
      ) : applications.length > 0 ? (
        <div className="section-card">
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
              {applications.map(app => (
                <tr key={app._id}>
                  <td>
                    <div className="candidate-cell">
                      <div className="company-logo-placeholder" style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#475569', marginRight: '1rem' }}>
                        {(app.internshipId?.companyId?.companyName || 'C')[0].toUpperCase()}
                      </div>
                      <div className="cand-name">{app.internshipId?.companyName || 'Unknown Company'}</div>
                    </div>
                  </td>
                  <td>{app.internshipId?.title || 'Unknown Role'}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td><span className={`badge ${app.status.toLowerCase()}`}>{app.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem', fontWeight: 600 }}>No applications yet</h3>
          <p style={{ color: '#64748b' }}>Explore available internships and submit your first application!</p>
        </div>
      )}
    </div>
  );
}

export default StudentApplications;
