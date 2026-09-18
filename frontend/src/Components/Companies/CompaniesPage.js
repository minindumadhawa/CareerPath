import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar'; // Assuming we want a navbar on this page, or maybe just the Home navbar? Let's use the Home navbar style or just plain layout.
import { useNavigate } from 'react-router-dom';
import './CompaniesPage.css';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users/companies');
        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        const data = await response.json();
        // data might have a 'data' array or just be the array
        if (data.data) {
           setCompanies(data.data);
        } else if (Array.isArray(data)) {
           setCompanies(data);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="companies-page">
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            <span className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </span>
            CareerPath
          </div>
          <div className="nav-actions">
             <button className="btn-login" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </div>
      </nav>

      <main className="companies-main">
        <div className="companies-header">
          <h1>Partner Companies</h1>
          <p>Explore the top companies hiring interns through CareerPath.</p>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading companies...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : companies.length === 0 ? (
          <div className="no-companies">No partner companies found.</div>
        ) : (
          <div className="companies-grid">
            {companies.map((company, index) => {
              const domain = company.email ? company.email.split('@')[1] : null;
              const companyName = company.name || company.companyName || 'Company';
              const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random`;
              const logoUrl = domain ? `https://logo.clearbit.com/${domain}` : fallbackUrl;
              
              return (
              <div key={company._id || index} className="company-card">
                <div className="company-card-header">
                  <div className="company-avatar">
                    <img 
                      src={logoUrl} 
                      onError={(e) => { e.target.onerror = null; e.target.src = fallbackUrl; }}
                      alt={`${companyName} logo`} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px' }} 
                    />
                  </div>
                  <div className="company-title">
                    <h3>{companyName}</h3>
                    <span className="company-industry">{company.industry || 'Tech & Software'}</span>
                  </div>
                </div>
                <div className="company-card-body">
                  <p className="company-description">
                    {company.description || 'A leading company committed to innovation and providing great opportunities for students and interns.'}
                  </p>
                  <div className="company-details">
                    <div className="detail-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {company.location || company.city || 'Global'}
                    </div>
                    {company.email && (
                      <div className="detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        {company.email}
                      </div>
                    )}
                  </div>
                </div>
                <div className="company-card-footer">
                   <button className="btn-view-profile" onClick={() => navigate('/internships')}>View Opportunities</button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default CompaniesPage;
