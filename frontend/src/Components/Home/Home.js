import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [workType, setWorkType] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: '👤',
      title: 'Student Profile & Resume Builder',
      description: 'Create professional profiles and build impressive resumes with our AI-powered tools.'
    },
    {
      icon: '📋',
      title: 'Internship Posting & CV Review',
      description: 'Post internship opportunities and get AI-assisted CV reviews for better matching.'
    },
    {
      icon: '🤖',
      title: 'AI-Based CV Filtering',
      description: 'Smart filtering system that matches students with the most relevant opportunities.'
    },
    {
      icon: '🎯',
      title: 'Leadership Programs & Skill Tests',
      description: 'Access exclusive leadership programs and test your skills with certified assessments.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Create Profile',
      description: 'Sign up and build your professional profile with our AI-powered resume builder.'
    },
    {
      number: '2',
      title: 'Apply or Post Internship',
      description: 'Browse and apply to internships or post opportunities if you\'re a company.'
    },
    {
      number: '3',
      title: 'Get Matched with AI',
      description: 'Our intelligent algorithm matches you with the perfect opportunities based on your skills.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Students' },
    { number: '500+', label: 'Companies' },
    { number: '2,000+', label: 'Internships' },
    { number: '85%', label: 'Success Rate' }
  ];

  const quickLinks = [
    'About Us',
    'Career Programs',
    'Internships',
    'Companies',
    'Testimonials',
    'Blog'
  ];

  const resources = [
    'Resume Builder',
    'Career Guidance',
    'Skill Tests',
    'Leadership Programs',
    'FAQ',
    'Support'
  ];

  const socialLinks = [
    { icon: 'f', name: 'Facebook' },
    { icon: 't', name: 'Twitter' },
    { icon: 'in', name: 'LinkedIn' },
    { icon: 'ig', name: 'Instagram' }
  ];

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#" className="nav-logo">CareerPath</a>
          
          <ul className="nav-menu">
            <li><a href="#" className="nav-link">Home</a></li>
            <li><a href="#" className="nav-link">Internships</a></li>
            <li><a href="#" className="nav-link">Career Programs</a></li>
            <li><a href="#" className="nav-link">Companies</a></li>
            <li><a href="#" className="nav-link">About</a></li>
            <li><a href="#" className="nav-link">Contact</a></li>
          </ul>

          <div className="auth-buttons">
            <button className="login-btn">Login</button>
            <button className="signup-btn">Sign Up</button>
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="headline">
              Find Your Dream Internship & Build Your Career
            </h1>
            <p className="subheading">
              Connecting students with top companies and AI-powered career guidance.
            </p>
            <div className="cta-buttons">
              <button className="primary-btn">Get Started as Student</button>
              <button className="secondary-btn">Hire Interns</button>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="illustration">
              <div className="icon-placeholder">🎓💼🚀</div>
              <p className="illustration-text">
                Students + Laptop + Career Growth
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <h2 className="section-title">Find Your Perfect Internship</h2>
          <p className="section-subtitle">Search through thousands of opportunities</p>
          
          <div className="search-form">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for internships..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filters">
              <select
                className="filter-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="new-york">New York</option>
                <option value="san-francisco">San Francisco</option>
                <option value="london">London</option>
                <option value="singapore">Singapore</option>
              </select>
              
              <select
                className="filter-select"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">All Industries</option>
                <option value="tech">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="marketing">Marketing</option>
                <option value="education">Education</option>
              </select>
              
              <select
                className="filter-select"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            
            <button className="search-btn">
              Search Internships
            </button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <p className="section-subtitle">
            Everything you need to accelerate your career journey
          </p>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Get started in three simple steps
          </p>
          
          <div className="steps-container">
            <div className="connector"></div>
            {steps.map((step, index) => (
              <div key={index} className="step">
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="statistics">
        <div className="container">
          <h2 className="section-title">Trusted by Thousands</h2>
          
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">CareerPath</h3>
              <p className="footer-description">
                Your gateway to professional opportunities and career growth. 
                Connecting talented students with leading companies worldwide.
              </p>
              <div className="social-icons">
                {socialLinks.map((social, index) => (
                  <div key={index} className="social-icon">
                    {social.icon}
                  </div>
                ))}
              </div>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Quick Links</h3>
              {quickLinks.map((link, index) => (
                <a key={index} href="#" className="footer-link">
                  {link}
                </a>
              ))}
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Resources</h3>
              {resources.map((resource, index) => (
                <a key={index} href="#" className="footer-link">
                  {resource}
                </a>
              ))}
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Contact Info</h3>
              <div className="contact-info">
                <p>📧 info@careerpath.com</p>
                <p>📱 +1 (555) 123-4567</p>
                <p>📍 123 Career Street, Tech City, TC 12345</p>
                <p>🕐 Mon-Fri: 9AM-6PM EST</p>
              </div>
            </div>
          </div>

          <div className="copyright">
            <p>&copy; 2026 CareerPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;