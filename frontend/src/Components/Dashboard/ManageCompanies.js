import React, { useState, useEffect } from 'react';
import './ManageCompanies.css';

function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/users/companies');
      const data = await res.json();
      if (res.ok) {
        setCompanies(data);
      } else {
        setError(data.message || 'Error fetching companies');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company account? This action cannot be undone.')) {
      try {
        const res = await fetch(`http://localhost:5001/api/users/companies/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchCompanies();
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to delete company');
        }
      } catch (err) {
        alert('Network error while deleting');
      }
    }
  };

  const handleVerify = async (id) => {
    if (window.confirm('Are you sure you want to verify this company? They will be fully approved.')) {
      try {
        const res = await fetch(`http://localhost:5001/api/users/companies/${id}/verify`, {
          method: 'PUT'
        });
        if (res.ok) {
          fetchCompanies();
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to verify company');
        }
      } catch (err) {
        alert('Network error while verifying');
      }
    }
  };

  if (loading) return <div className="manage-loading">Loading companies...</div>;
  if (error) return <div className="error-alert">{error}</div>;

  return (
    <div className="manage-companies-container">
      <div className="section-card">
        <div className="card-header">
          <h2>Manage Companies</h2>
          <span className="badge-count">Total: {companies.length}</span>
        </div>
        
        <div className="table-responsive">
          <table className="data-table admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">No companies registered yet.</td>
                </tr>
              ) : (
                companies.map((company, index) => {
                  const initial = company.companyName ? company.companyName.charAt(0).toUpperCase() : company.email.charAt(0).toUpperCase();
                  const avatarColors = ['bg-blue', 'bg-teal', 'bg-purple', 'bg-green'];
                  const colorClass = avatarColors[index % avatarColors.length];
                  
                  return (
                    <tr key={company._id}>
                      <td>
                        <div className="entity-cell">
                          <div className={`cand-avatar ${colorClass}`}>
                            {initial}
                          </div>
                          <div>
                            <div className="entity-name">{company.companyName || company.email}</div>
                            <div className="entity-sub">{company.website || 'No Website Provided'}</div>
                          </div>
                        </div>
                      </td>
                      <td>{company.industry || '-'}</td>
                      <td>
                        {company.isVerified ? (
                          <span className="badge active">Verified</span>
                        ) : (
                          <span className="badge warning">Pending</span>
                        )}
                      </td>
                      <td>{new Date(company.createdAt).toLocaleDateString()}</td>
                      <td>
                        {!company.isVerified && (
                          <button className="btn-table btn-verify" onClick={() => handleVerify(company._id)}>
                            Verify
                          </button>
                        )}
                        <button className="btn-table btn-delete" onClick={() => handleDelete(company._id)} style={{ marginLeft: !company.isVerified ? '8px' : '0' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageCompanies;
