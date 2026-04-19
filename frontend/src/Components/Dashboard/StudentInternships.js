import React, { useState, useEffect } from 'react';
import '../Internships/InternshipsPage.css'; // Leverage existing premium card styles
import ApplicationModal from '../Internships/ApplicationModal';

function StudentInternships() {
  const [internships, setInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeModalInternship, setActiveModalInternship] = useState(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const fetchInternships = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/internships/active');
        if (res.ok) {
          const data = await res.json();
          setInternships(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard internships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  const filteredInternships = internships.filter(intern => 
    intern.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (intern.companyId?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '0.25rem' }}>Active Internships</h2>
          <p style={{ color: '#64748b' }}>Discover and apply directly to opportunities from top companies.</p>
        </div>
        
        <div style={{ display: 'flex', background: 'white', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '0.5rem 1rem', width: '300px' }}>
          <input 
            type="text" 
            placeholder="Search roles or companies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading Opportunities...</div>
      ) : filteredInternships.length > 0 ? (
        <div className="internships-grid" style={{ gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {filteredInternships.map(intern => (
            <div key={intern._id} className="public-intern-card" style={{ boxShadow: 'var(--shadow-sm)', padding: '1.5rem' }}>
              <div className="card-top">
                <div className="company-info">
                  <div className="company-logo-placeholder" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                    {(intern.companyId?.companyName || 'C')[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem' }}>{intern.title}</h3>
                    <span className="company-name">{intern.companyId?.companyName || 'Unknown Company'}</span>
                  </div>
                </div>
                <span className="duration-badge" style={{ fontSize: '0.75rem' }}>{intern.duration}</span>
              </div>
              
              <div className="card-middle" style={{ marginBottom: '1rem' }}>
                <div className="detail-item" style={{ fontSize: '0.85rem' }}>
                   <span className="icon">📍</span> {intern.location}
                </div>
                <div className="detail-item" style={{ fontSize: '0.85rem' }}>
                   <span className="icon">💰</span> {intern.stipend}
                </div>
              </div>

              <div className="card-skills" style={{ marginBottom: '1.5rem' }}>
                {(intern.skills || []).slice(0, 3).map(skill => (
                  <span key={skill} className="skill-pill" style={{ fontSize: '0.75rem' }}>{skill}</span>
                ))}
                {intern.skills?.length > 3 && <span className="skill-pill" style={{ fontSize: '0.75rem' }}>+{intern.skills.length - 3}</span>}
              </div>

              <div className="card-bottom">
                <p className="posted-date" style={{ fontSize: '0.8rem' }}>Posted: {new Date(intern.createdAt).toLocaleDateString()}</p>
                <button className="btn-apply-now" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => setActiveModalInternship(intern)}>Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem', fontWeight: 600 }}>No internships found</h3>
          <p style={{ color: '#64748b' }}>Try relaxing your search terms or checking back later.</p>
        </div>
      )}

      {activeModalInternship && (
        <ApplicationModal 
          internship={activeModalInternship} 
          onClose={() => setActiveModalInternship(null)} 
          user={user}
        />
      )}
    </div>
  );
}

export default StudentInternships;
