import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './InternshipsPage.css';
import '../Home/Home.css';
import ApplicationModal from './ApplicationModal';

function InternshipsPage() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
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
        const res = await fetch('http://localhost:5001/api/internships/active');
        if (res.ok) {
          const data = await res.json();
          setInternships(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching internships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredInternships = internships.filter(intern => 
    intern.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (intern.companyId?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="internships-public-page">
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </span>
            <Link to="/" style={{color:'inherit', textDecoration:'none'}}>CareerPath</Link>
          </div>
          <div className="nav-menu">
            <a href="/">Home</a>
            <Link to="/internships">Internships</Link>
            <a href="/#career-overview">Career Programs</a>
            <a href="/#companies">Companies</a>
            <a href="/#about">About</a>
            <a href="/#contact">Contact</a>
          </div>
          <div className="nav-actions">
            <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-signup" onClick={() => navigate('/signup/student')}>Sign Up</button>
          </div>
        </div>
      </nav>

      <section className="hero-section" style={{ padding: '140px 2rem 80px', minHeight: 'auto' }}>
        <div className="hero-container">
          <div className="hero-content">
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Explore Active<br/>Internships</h1>
            <p>Browse through hundreds of internships from top companies globally.</p>
            
            <div className="search-wrapper" style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', marginTop: '2rem', maxWidth: '100%' }}>
              <div className="search-group" style={{ padding: '0.5rem 1rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input 
                  type="text" 
                  placeholder="Search by role or company..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-search" style={{ margin: 0 }}>Search</button>
            </div>
            
            <div className="hero-trust" style={{ marginTop: '3rem' }}>
               <div className="avatars">
                 <img src="https://i.pravatar.cc/100?img=4" alt="Student" />
                 <img src="https://i.pravatar.cc/100?img=5" alt="Student" />
                 <img src="https://i.pravatar.cc/100?img=6" alt="Student" />
                 <div className="avatar-more">+5k</div>
               </div>
               <span>Trusted by thousands of students</span>
            </div>
          </div>
          
          <div className="hero-illustration">
            <div className="illustration-wrapper">
              <div className="blob-shape"></div>
              <img src="https://images.unsplash.com/photo-1515165562489-399a38bd2c7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Student searching internships" className="main-img" />
              <div className="floating-badge badge-1">
                 <span className="badge-icon">🎯</span>
                 <span>Global Roles</span>
               </div>
               <div className="floating-badge badge-2">
                 <span className="badge-icon">🚀</span>
                 <span>Fast Apply</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      <main className="internships-grid-container">
        {loading ? (
          <div className="no-results">
            <h2>Loading Internships...</h2>
          </div>
        ) : filteredInternships.length > 0 ? (
          <div className="internships-grid">
            {filteredInternships.map(intern => (
              <div key={intern._id} className="public-intern-card">
                <div className="card-top">
                  <div className="company-info">
                    <div className="company-logo-placeholder">
                      {(intern.companyId?.companyName || 'C')[0].toUpperCase()}
                    </div>
                    <div>
                      <h3>{intern.title}</h3>
                      <span className="company-name">{intern.companyId?.companyName || 'Unknown Company'}</span>
                    </div>
                  </div>
                  <span className="duration-badge">{intern.duration}</span>
                </div>
                
                <div className="card-middle">
                  <div className="detail-item">
                     <span className="icon">📍</span> {intern.location}
                  </div>
                  <div className="detail-item">
                     <span className="icon">💰</span> {intern.stipend}
                  </div>
                </div>

                <div className="card-skills">
                  {(intern.skills || []).slice(0, 3).map(skill => (
                    <span key={skill} className="skill-pill">{skill}</span>
                  ))}
                  {intern.skills?.length > 3 && <span className="skill-pill">+{intern.skills.length - 3}</span>}
                </div>

                <div className="card-bottom">
                  <p className="posted-date">Posted: {new Date(intern.createdAt).toLocaleDateString()}</p>
                  <button className="btn-apply-now" onClick={() => {
                    if (user && user.role === 'student') {
                      setActiveModalInternship(intern);
                    } else {
                      alert('Log in as a student to apply!');
                      navigate('/login');
                    }
                  }}>Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h2>No active internships found.</h2>
            <p>Try adjusting your search criteria!</p>
          </div>
        )}
      </main>

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

export default InternshipsPage;
