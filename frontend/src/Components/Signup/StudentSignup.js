import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './StudentSignup.css';

function StudentSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    university: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'student' })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('Signup successful! Welcome to CareerPath.');
        navigate('/');
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <Link to="/" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Home
        </Link>
        <div className="signup-header">
           <h2>Student Sign Up</h2>
           <p>Kickstart your career journey today.</p>
        </div>
        
        {error && <div className="error-alert">{error}</div>}
        
        <form onSubmit={handleSubmit} className="signup-form">
           <div className="form-group">
             <label>Full Name</label>
             <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="John Doe" />
           </div>
           <div className="form-group">
             <label>Email Address</label>
             <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@university.edu" />
           </div>
           <div className="form-group">
             <label>University</label>
             <input type="text" name="university" value={formData.university} onChange={handleChange} required placeholder="Stanford University" />
           </div>
           <div className="form-group">
             <label>Password</label>
             <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" minLength="6" />
           </div>
           
           <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
           </button>
        </form>
        
        <div className="signup-footer">
           <p>Already have an account? <Link to="/">Log in</Link></p>
           <p className="switch-role">Are you a company? <Link to="/signup/company">Hire Interns here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default StudentSignup;
