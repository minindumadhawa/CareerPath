import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
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
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        // Redirect based on user role
        if (data.user && data.user.role === 'student') {
          navigate('/student-dashboard');
        } else if (data.user && data.user.role === 'company') {
          navigate('/company-dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Home
        </Link>
        <div className="login-header">
           <h2>Welcome Back</h2>
           <p>Log in to your CareerPath account.</p>
        </div>
        
        {error && <div className="error-alert">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
           <div className="form-group">
             <label>Email Address</label>
             <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
           </div>
           <div className="form-group">
             <label>Password</label>
             <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
           </div>
           
           <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
           </button>
        </form>
        
        <div className="login-footer">
           <p>Don't have an account?</p>
           <div className="signup-links">
             <Link to="/signup/student">Sign Up as Student</Link>
             <span className="divider">|</span>
             <Link to="/signup/company">Sign Up as Company</Link>
           </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
