import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CompanySignup.css';

function CompanySignup() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    industry: '',
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
        body: JSON.stringify({ ...formData, role: 'company' })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('Company registered successfully! Welcome to CareerPath.');
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
           <h2>Company Sign Up</h2>
           <p>Find the best early-career talent.</p>
        </div>
        
        {error && <div className="error-alert">{error}</div>}
        
        <form onSubmit={handleSubmit} className="signup-form">
           <div className="form-group">
             <label>Company Name</label>
             <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required placeholder="Acme Corp" />
           </div>
           <div className="form-group">
             <label>Work Email Address</label>
             <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="recruitment@acme.com" />
           </div>
           <div className="form-group">
             <label>Industry</label>
             <select name="industry" value={formData.industry} onChange={handleChange} required className="industry-select">
                <option value="" disabled>Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
             </select>
           </div>
           <div className="form-group">
             <label>Password</label>
             <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" minLength="6" />
           </div>
           
           <button type="submit" className="btn-submit company-submit" disabled={loading}>
              {loading ? 'Registering...' : 'Sign Up as Company'}
           </button>
        </form>
        
        <div className="signup-footer">
           <p>Already have an account? <Link to="/">Log in</Link></p>
           <p className="switch-role">Are you a student? <Link to="/signup/student">Find Internships here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default CompanySignup;
