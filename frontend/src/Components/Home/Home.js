import './Home.css';

function Home() {
  const careerPaths = [
    {
      id: 1,
      title: 'Web Development',
      description: 'Learn to build modern web applications with React, Node.js, and more.',
      icon: '💻',
      duration: '6-8 weeks'
    },
    {
      id: 2,
      title: 'Data Science',
      description: 'Master data analysis, machine learning, and visualization techniques.',
      icon: '📊',
      duration: '8-10 weeks'
    },
    {
      id: 3,
      title: 'Mobile Development',
      description: 'Create iOS and Android apps with modern frameworks.',
      icon: '📱',
      duration: '6-8 weeks'
    },
    {
      id: 4,
      title: 'UI/UX Design',
      description: 'Design beautiful and user-friendly interfaces and experiences.',
      icon: '🎨',
      duration: '5-7 weeks'
    }
  ];

  return (
    <div className="home">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">CareerPath</div>
          <div className="nav-links">
            <a href="#paths">Paths</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <button className="login-btn">Login</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Build Your Career Path</h1>
          <p>Explore diverse career paths and develop skills for your future</p>
          <button className="cta-btn">Get Started</button>
        </div>
      </section>

      {/* Career Paths Section */}
      <section className="paths" id="paths">
        <div className="paths-container">
          <h2>Explore Career Paths</h2>
          <p className="section-subtitle">Choose a path that suits your interests</p>
          
          <div className="cards-grid">
            {careerPaths.map((path) => (
              <div key={path.id} className="card">
                <div className="card-icon">{path.icon}</div>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <div className="card-duration">{path.duration}</div>
                <button className="card-btn">Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-container">
          <h2>Why Choose CareerPath?</h2>
          <div className="about-grid">
            <div className="about-item">
              <span className="about-number">1000+</span>
              <p>Career Resources</p>
            </div>
            <div className="about-item">
              <span className="about-number">50K+</span>
              <p>Active Learners</p>
            </div>
            <div className="about-item">
              <span className="about-number">95%</span>
              <p>Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 CareerPath. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
