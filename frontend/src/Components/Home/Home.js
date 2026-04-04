import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [programStats, setProgramStats] = useState({ leadership: 0, technical: 0, quizzes: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch basic stats for the overview
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/leadership').then(res => res.json()).catch(() => ({ count: 5 })),
      fetch('http://localhost:5000/api/technical').then(res => res.json()).catch(() => ({ count: 12 })),
      fetch('http://localhost:5000/api/quiz').then(res => res.json()).catch(() => ({ count: 8 }))
    ]).then(([l, t, q]) => {
      setProgramStats({
        leadership: (l && l.count) || 5,
        technical: (t && t.count) || 12,
        quizzes: (q && q.count) || 8
      });
    });
  }, []);

  // Track window scroll for dynamic navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="career-home">
      {/* 1. Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </span>
            CareerPath
          </div>
          <div className="nav-menu">
            <a href="#home">Home</a>
            <Link to="/internships">Internships</Link>
            <a href="#career-overview">Career Programs</a>
            <a href="#companies">Companies</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="nav-actions">
            <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-signup" onClick={() => navigate('/signup/student')}>Sign Up</button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Find Your Dream Internship & <br/> Build Your Career</h1>
            <p>Connecting students with top companies and AI-powered career guidance.</p>
            <div className="hero-cta">
              <button className="btn-primary" onClick={() => navigate('/signup/student')}>Get Started as Student</button>
              <button className="btn-secondary" onClick={() => navigate('/signup/company')}>Hire Interns</button>
            </div>
            
            <div className="hero-trust">
               <div className="avatars">
                 <img src="https://i.pravatar.cc/100?img=1" alt="Student" />
                 <img src="https://i.pravatar.cc/100?img=2" alt="Student" />
                 <img src="https://i.pravatar.cc/100?img=3" alt="Student" />
                 <div className="avatar-more">+2k</div>
               </div>
               <span>Trusted by students worldwide</span>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="illustration-wrapper">
              <div className="blob-shape"></div>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students using laptop" className="main-img" />
              <div className="floating-badge badge-1">
                 <span className="badge-icon">🚀</span>
                 <span>Career Growth</span>
               </div>
               <div className="floating-badge badge-2">
                 <span className="badge-icon">💼</span>
                 <span>Top Companies</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Search Internship Section */}
      <section className="search-section" id="internships">
        <div className="search-wrapper">
          <form className="search-form">
             <div className="search-group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Internship title or keyword" />
             </div>
             <div className="search-divider"></div>
             <div className="search-group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <select defaultValue="">
                  <option value="" disabled>Location</option>
                  <option value="ny">New York</option>
                  <option value="sf">San Francisco</option>
                  <option value="remote">Remote</option>
                </select>
             </div>
             <div className="search-divider"></div>
             <div className="search-group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                <select defaultValue="">
                  <option value="" disabled>Industry</option>
                  <option value="tech">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="health">Healthcare</option>
                </select>
             </div>
             <button type="button" className="btn-search">Search</button>
          </form>
        </div>
      </section>

      {/* Career Programs Overview Section */}
      <section className="features-section" id="career-overview" style={{ background: '#f8fafc', padding: '80px 0' }}>
         <div className="section-header">
            <h2>Explore Career Programs</h2>
            <p>A quick overview of what we offer to boost your career. Log in to enroll and track your progress!</p>
         </div>
         <div className="programs-overview-container" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 30 }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
               <div style={{ background: '#e0e7ff', width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: 20 }}>🏆</div>
               <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: 12 }}>Leadership Skills</h3>
               <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>Develop essential soft skills, team management, and problem-solving through our <b>{programStats.leadership} exclusive programs</b>.</p>
               <button onClick={() => navigate('/login')} style={{ marginTop: 'auto', background: 'transparent', color: '#1a56db', border: '2px solid #1a56db', padding: '10px 24px', borderRadius: 50, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.target.style.background = '#1a56db'; e.target.style.color = 'white'; }} onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#1a56db'; }}>Full Access →</button>
            </div>
            
            <div style={{ background: '#fff', padding: '30px', borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
               <div style={{ background: '#cffafe', width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: 20 }}>💻</div>
               <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: 12 }}>Technical Resources</h3>
               <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>Master the latest technologies with <b>{programStats.technical} video tutorials</b> covering frontend, backend integration, and more.</p>
               <button onClick={() => navigate('/login')} style={{ marginTop: 'auto', background: 'transparent', color: '#1a56db', border: '2px solid #1a56db', padding: '10px 24px', borderRadius: 50, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.target.style.background = '#1a56db'; e.target.style.color = 'white'; }} onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#1a56db'; }}>Full Access →</button>
            </div>

            <div style={{ background: '#fff', padding: '30px', borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
               <div style={{ background: '#ede9fe', width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: 20 }}>📝</div>
               <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: 12 }}>Skill Assessments</h3>
               <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>Prove your expertise by taking one of our <b>{programStats.quizzes} industry-standard quizzes</b> and benchmark your skills.</p>
               <button onClick={() => navigate('/login')} style={{ marginTop: 'auto', background: 'transparent', color: '#1a56db', border: '2px solid #1a56db', padding: '10px 24px', borderRadius: 50, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.target.style.background = '#1a56db'; e.target.style.color = 'white'; }} onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#1a56db'; }}>Full Access →</button>
            </div>
         </div>
      </section>

      {/* 4. Key Features Section */}
      <section className="features-section" id="programs">
         <div className="section-header">
            <h2>Why Choose CareerPath</h2>
            <p>Everything you need to launch your career in one place.</p>
         </div>
         <div className="features-grid">
            <div className="feature-card">
               <div className="feature-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
               </div>
               <h3>Student Profile & Resume Builder</h3>
               <p>Create a standout profile and auto-generate a professional resume.</p>
            </div>
            <div className="feature-card">
               <div className="feature-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
               </div>
               <h3>Internship Posting & CV Review</h3>
               <p>Get your CV reviewed by industry pros and apply seamlessly.</p>
            </div>
            <div className="feature-card">
               <div className="feature-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
               </div>
               <h3>AI-Based CV Filtering</h3>
               <p>Our smart AI helps match your profile to the perfect opportunities.</p>
            </div>
            <div className="feature-card">
               <div className="feature-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
               </div>
               <h3>Leadership Programs & Skill Tests</h3>
               <p>Test your skills and join exclusive programs to boost your career.</p>
            </div>
         </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
           <h2>How It Works</h2>
           <p>Your journey to a dream internship in three simple steps.</p>
        </div>
        <div className="steps-container">
           <div className="step-card">
             <div className="step-number">1</div>
             <h3>Create Profile</h3>
             <p>Sign up, showcase your skills, and let companies know who you are.</p>
           </div>
           <div className="step-card">
             <div className="step-number">2</div>
             <h3>Get Matched with AI</h3>
             <p>Our AI analyzes your skills to suggest the best internship roles.</p>
           </div>
           <div className="step-card">
             <div className="step-number">3</div>
             <h3>Apply or Post Internship</h3>
             <p>Apply to your matches with one click or companies post new roles.</p>
           </div>
        </div>
      </section>

      {/* 6. Statistics Section */}
      <section className="stats-section">
        <div className="stats-container">
           <div className="stat-item">
             <h2 className="stat-number">10,000+</h2>
             <p className="stat-label">Students</p>
           </div>
           <div className="stat-item">
             <h2 className="stat-number">500+</h2>
             <p className="stat-label">Companies</p>
           </div>
           <div className="stat-item">
             <h2 className="stat-number">2,000+</h2>
             <p className="stat-label">Internships</p>
           </div>
           <div className="stat-item">
             <h2 className="stat-number">85%</h2>
             <p className="stat-label">Success Rate</p>
           </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="footer" id="contact">
        <div className="footer-container">
           <div className="footer-brand">
              <div className="logo footer-logo">CareerPath</div>
              <p>Connecting top students with world-class companies for meaningful internships and career growth.</p>
           </div>
           <div className="footer-links-group">
             <h4>Quick Links</h4>
             <a href="#home">Home</a>
             <Link to="/internships">Internships</Link>
             <a href="#career-overview">Programs</a>
             <a href="#about">About Us</a>
           </div>
           <div className="footer-links-group">
             <h4>Contact</h4>
             <p>support@careerpath.com</p>
             <p>+1 (555) 123-4567</p>
             <p>123 Career Avenue, Tech District</p>
           </div>
           <div className="footer-social">
             <h4>Follow Us</h4>
             <div className="social-icons">
               <a href="#fb" aria-label="Facebook">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
               </a>
               <a href="#tw" aria-label="Twitter">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
               </a>
               <a href="#li" aria-label="LinkedIn">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
               </a>
             </div>
           </div>
        </div>
        <div className="footer-bottom">
           <p>&copy; 2026 CareerPath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
