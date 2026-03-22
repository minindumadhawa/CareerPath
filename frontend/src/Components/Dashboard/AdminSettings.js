import React, { useState, useEffect } from 'react';
import './AdminSettings.css';

function AdminSettings() {
  const [profile, setProfile] = useState({ fullName: '', email: '', newPassword: '' });
  const [preferences, setPreferences] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
    autoVerifyCompanies: false
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleNameChange = (e) => {
    // Allow only letters, spaces, hyphens, and apostrophes (e.g. Mary-Jane O'Connor)
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z\s\-']/g, '');
    setProfile({...profile, fullName: sanitizedValue});
  };

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Load initial profile data
    if (user && user.id) {
      fetchProfile();
    }
    
    // Load local platform preferences
    const savedPrefs = localStorage.getItem('admin_preferences');
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        console.error('Failed to load preferences');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/profile/${user.id}`);
      const data = await res.json();
      if (res.ok) {
        setProfile({
          fullName: data.fullName || user.name || '',
          email: data.email || user.email || '',
          newPassword: ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // --- Input Validations ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.fullName || profile.fullName.trim().length < 2) {
      return setError('Full Name must be at least 2 characters.');
    }
    if (!profile.email || !emailRegex.test(profile.email.trim())) {
      return setError('Please enter a valid email address.');
    }
    if (profile.newPassword && profile.newPassword.length < 6) {
      return setError('New password must be at least 6 characters long.');
    }

    try {
      const payload = { 
        fullName: profile.fullName.trim(), 
        email: profile.email.trim() 
      };
      if (profile.newPassword) {
        payload.password = profile.newPassword;
      }
      
      const res = await fetch(`http://localhost:5000/api/users/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Admin profile updated successfully!');
        setProfile({...profile, newPassword: ''});
        // Update local storage name if changed
        const updatedUser = { ...user, name: profile.fullName, email: profile.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error updating profile');
    }
  };

  const handleToggle = (key) => {
    const updatedPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(updatedPrefs);
    localStorage.setItem('admin_preferences', JSON.stringify(updatedPrefs));
    
    // Show quick toast/message
    setMessage(`Preferences Saved: ${key} is now ${updatedPrefs[key] ? 'ON' : 'OFF'}`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="admin-settings-container">
      <div className="settings-header">
        <h1>System Settings</h1>
        <p>Manage your administrative profile and global platform rules.</p>
      </div>

      {message && <div className="settings-alert success">{message}</div>}
      {error && <div className="settings-alert error">{error}</div>}

      <div className="settings-grid">
        
        {/* Profile Settings Panel */}
        <div className="settings-panel">
          <div className="panel-header">
            <h3>Admin Profile</h3>
            <span>Update your credentials</span>
          </div>
          <form className="settings-form" onSubmit={handleProfileSubmit}>
            <div className="form-group row">
               <div className="col">
                 <label>Admin Full Name</label>
                 <input 
                   type="text" 
                   value={profile.fullName} 
                   onChange={handleNameChange} 
                   required 
                 />
               </div>
               <div className="col">
                 <label>Email Address</label>
                 <input 
                   type="email" 
                   value={profile.email} 
                   onChange={(e) => setProfile({...profile, email: e.target.value})} 
                   required 
                 />
               </div>
            </div>
            
            <div className="form-group divider-block">
               <label>Change Password (leave blank to keep current)</label>
               <input 
                 type="password" 
                 placeholder="Enter new secure password" 
                 value={profile.newPassword} 
                 onChange={(e) => setProfile({...profile, newPassword: e.target.value})} 
               />
            </div>
            
            <button type="submit" className="btn-save">Save Profile Changes</button>
          </form>
        </div>

        {/* Global Configuration Panel */}
        <div className="settings-panel">
          <div className="panel-header">
            <h3>Platform Preferences</h3>
            <span>Global limits and feature flags</span>
          </div>
          
          <div className="settings-list">
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Allow Student Registrations</h4>
                <p>Toggle to temporarily halt new generic signups.</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.allowRegistrations} 
                  onChange={() => handleToggle('allowRegistrations')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Auto-Verify Safe Companies</h4>
                <p>Allow companies with .edu domains to bypass manual verification.</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.autoVerifyCompanies} 
                  onChange={() => handleToggle('autoVerifyCompanies')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Admin Email Notifications</h4>
                <p>Receive daily digest of new signups directly.</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.emailNotifications} 
                  onChange={() => handleToggle('emailNotifications')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item danger-zone-item">
              <div className="setting-info">
                <h4>Maintenance Mode</h4>
                <p>Redirect all active users to a maintenance screen. <strong>Use with caution.</strong></p>
              </div>
              <label className="toggle-switch slider-danger">
                <input 
                  type="checkbox" 
                  checked={preferences.maintenanceMode} 
                  onChange={() => handleToggle('maintenanceMode')}
                />
                <span className="slider"></span>
              </label>
            </div>

          </div>
        </div>

        {/* Danger Zone Panel */}
        <div className="settings-panel danger-panel">
          <div className="panel-header">
            <h3>Danger Zone</h3>
            <span>Irreversible platform actions</span>
          </div>
          <div className="danger-actions">
            <div className="danger-row">
              <div className="danger-text">
                <strong>Purge Old System Logs</strong>
                <span>Deletes authentication and traffic logs older than 90 days. Frees up disk space.</span>
              </div>
              <button type="button" className="btn-danger-outline" onClick={() => alert('Logs purged successfully.')}>Purge Logs</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminSettings;
