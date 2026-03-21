import React, { useState, useEffect } from 'react';
import './StudentProfile.css';

function StudentProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    university: '',
    skills: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user && user.id) {
      fetchProfile();
    } else {
      setLoading(false);
      setMessage({ text: 'User data not found in local storage.', type: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/profile/${user.id}`);
      const data = await res.json();
      if (res.ok) {
        setProfile({
          fullName: data.fullName || '',
          email: data.email || '',
          university: data.university || '',
          skills: data.skills && Array.isArray(data.skills) ? data.skills.join(', ') : ''
        });
      } else {
        setMessage({ text: data.message || 'Failed to fetch profile', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const res = await fetch(`http://localhost:5000/api/users/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        // Update local storage in case name changed
        const updatedUser = { ...user, name: data.user.fullName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setMessage({ text: data.message || 'Failed to update profile', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error while saving', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-container"><div className="profile-loading">Loading profile...</div></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <p>Manage your personal information and resume details</p>
      </div>
      
      {message.text && (
        <div className={`profile-alert ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-card">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group row">
            <div className="col-half">
              <label>Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                value={profile.fullName} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="col-half">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={profile.email} 
                className="input-disabled" 
                disabled 
              />
              <span className="help-text">Email address cannot be changed</span>
            </div>
          </div>

          <div className="form-group">
            <label>University / College</label>
            <input 
              type="text" 
              name="university" 
              value={profile.university} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input 
              type="text" 
              name="skills" 
              value={profile.skills} 
              onChange={handleChange} 
              placeholder="e.g. JavaScript, React, Node.js" 
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentProfile;
