import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">CareerPath</div>
          <div className="nav-menu">
            <a href="#home" className="nav-link">Home</a>
            <a href="#internships" className="nav-link">Internships</a>
            <Link to="/programs" className="nav-link">Career Programs</Link>
            <Link to="/companies" className="nav-link">Companies</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
          <div className="nav-buttons">
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Find Your Dream Internship & Build Your Career</h1>
            <p>Connecting students with top companies and AI-powered career guidance.</p>
            <div className="hero-buttons">
              <button className="btn-primary">Get Started as Student</button>
              <button className="btn-secondary">Hire Interns</button>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="illustration-placeholder">
              <div className="student-icon">👨‍🎓</div>
              <div className="laptop-icon">💻</div>
              <div className="growth-icon">📈</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Internship Section */}
      <section className="search-section">
        <div className="search-container">
          <h2>Find Your Perfect Internship</h2>
          <div className="search-bar">
            <input type="text" placeholder="Search for internships..." className="search-input" />
            <div className="search-filters">
              <select className="filter-select">
                <option>All Locations</option>
                <option>Remote</option>
                <option>New York</option>
                <option>San Francisco</option>
                <option>London</option>
              </select>
              <select className="filter-select">
                <option>All Industries</option>
                <option>Technology</option>
                <option>Finance</option>
                <option>Marketing</option>
                <option>Healthcare</option>
              </select>
              <select className="filter-select">
                <option>All Types</option>
                <option>Remote</option>
                <option>On-site</option>
                <option>Hybrid</option>
              </select>
            </div>
            <button className="search-btn">Search</button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>Student Profile & Resume Builder</h3>
              <p>Create professional profiles and build impressive resumes with our AI-powered tools.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Internship Posting & CV Review</h3>
              <p>Companies can post internships and get AI-assisted CV reviews for better matching.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Based CV Filtering</h3>
              <p>Advanced AI algorithms filter and match candidates with the most suitable internships.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Leadership Programs & Skill Tests</h3>
              <p>Access exclusive leadership programs and skill assessments to boost your career.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Profile</h3>
              <p>Sign up and build your professional profile with resume and skills.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Apply or Post Internship</h3>
              <p>Students apply to internships, companies post opportunities.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Matched with AI</h3>
              <p>Our AI matches the best candidates with the right opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Companies</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2,000+</div>
              <div className="stat-label">Internships</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">85%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>CareerPath</h4>
              <p>Your gateway to professional internships and career growth.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#internships">Internships</a></li>
                <li><a href="#companies">Companies</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@careerpath.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <div className="social-icons">
                <a href="#facebook">📘</a>
                <a href="#twitter">🐦</a>
                <a href="#linkedin">💼</a>
                <a href="#instagram">📷</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CareerPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;