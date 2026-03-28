import React, { useState, useEffect } from 'react';
import './StudentProfile.css';

function StudentProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    university: '',
    phoneNumber: '',
    location: '',
    linkedin: '',
    summary: '',
    technicalSkills: '',
    softSkills: '',
    education: [],
    workExperience: [],
    projects: [],
    certifications: '',
    achievements: '',
    references: ''
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
          phoneNumber: data.phoneNumber || '',
          location: data.location || '',
          linkedin: data.linkedin || '',
          summary: data.summary || '',
          technicalSkills: data.technicalSkills ? data.technicalSkills.join(', ') : '',
          softSkills: data.softSkills ? data.softSkills.join(', ') : '',
          education: data.education || [],
          workExperience: data.workExperience || [],
          projects: data.projects || [],
          certifications: data.certifications ? data.certifications.join(', ') : '',
          achievements: data.achievements ? data.achievements.join(', ') : '',
          references: data.references || ''
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

  const handleArrayChange = (e, index, arrayName) => {
    const updatedArray = [...profile[arrayName]];
    updatedArray[index][e.target.name] = e.target.value;
    setProfile({ ...profile, [arrayName]: updatedArray });
  };

  const addArrayItem = (arrayName, emptyItem) => {
    setProfile({ ...profile, [arrayName]: [...profile[arrayName], emptyItem] });
  };

  const removeArrayItem = (index, arrayName) => {
    const updatedArray = profile[arrayName].filter((_, i) => i !== index);
    setProfile({ ...profile, [arrayName]: updatedArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const payload = {
        ...profile,
      };

      const res = await fetch(`http://localhost:5000/api/users/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        const updatedUser = { ...user, name: data.user.fullName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setMessage({ text: data.message || 'Failed to update profile', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error while saving', type: 'error' });
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="profile-container"><div className="profile-loading">Loading profile...</div></div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Resume / Profile</h2>
        <p>Complete your profile to build out your resume automatically and stand out to employers.</p>
      </div>
      
      {message.text && (
        <div className={`profile-alert ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        
        {/* Section 1: Personal Info */}
        <div className="profile-section">
          <h3>1. Personal Information</h3>
          <div className="form-group row">
            <div className="col-half">
              <label>Full Name</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} required />
            </div>
            <div className="col-half">
              <label>Email Address</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-half">
              <label>Phone Number</label>
              <input type="tel" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} placeholder="+1 234 567 890" />
            </div>
            <div className="col-half">
              <label>Location (City, Country)</label>
              <input type="text" name="location" value={profile.location} onChange={handleChange} placeholder="e.g. New York, USA" />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-half">
              <label>LinkedIn / Portfolio</label>
              <input type="text" name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="github.com/username or linkedin.com/in/..." />
            </div>
            <div className="col-half">
              <label>University / College</label>
              <input type="text" name="university" value={profile.university} onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* Section 2: Summary */}
        <div className="profile-section">
          <h3>2. Professional Summary</h3>
          <div className="form-group">
            <textarea 
              name="summary" 
              value={profile.summary} 
              onChange={handleChange} 
              rows="3" 
              placeholder="A short paragraph about who you are, your skills, and your career goals... e.g. Motivated IT undergraduate..."
            ></textarea>
          </div>
        </div>

        {/* Section 3: Education */}
        <div className="profile-section">
          <div className="section-header-flex">
            <h3>3. Education</h3>
            <button type="button" className="btn-add" onClick={() => addArrayItem('education', { degree: '', institution: '', year: '' })}>+ Add Education</button>
          </div>
          {profile.education.map((edu, index) => (
            <div key={index} className="array-item-card">
              <button type="button" className="btn-remove" onClick={() => removeArrayItem(index, 'education')}>×</button>
              <div className="form-group row">
                <div className="col-1">
                  <label>Degree / Course</label>
                  <input type="text" name="degree" value={edu.degree} onChange={(e) => handleArrayChange(e, index, 'education')} placeholder="e.g. B.Sc. in Computer Science" />
                </div>
                <div className="col-1">
                  <label>University / School</label>
                  <input type="text" name="institution" value={edu.institution} onChange={(e) => handleArrayChange(e, index, 'education')} placeholder="e.g. MIT" />
                </div>
                <div className="col-small">
                  <label>Year</label>
                  <input type="text" name="year" value={edu.year} onChange={(e) => handleArrayChange(e, index, 'education')} placeholder="e.g. 2024" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 4: Skills */}
        <div className="profile-section">
          <h3>4. Skills</h3>
          <div className="form-group">
            <label>Technical Skills (comma separated)</label>
            <input type="text" name="technicalSkills" value={profile.technicalSkills} onChange={handleChange} placeholder="e.g. Java, HTML, React, SQL" />
          </div>
          <div className="form-group">
            <label>Soft Skills (comma separated)</label>
            <input type="text" name="softSkills" value={profile.softSkills} onChange={handleChange} placeholder="e.g. Communication, Teamwork, Leadership" />
          </div>
        </div>

        {/* Section 5: Work Experience */}
        <div className="profile-section">
          <div className="section-header-flex">
            <h3>5. Work Experience</h3>
            <button type="button" className="btn-add" onClick={() => addArrayItem('workExperience', { jobTitle: '', company: '', duration: '', responsibilities: '' })}>+ Add Experience</button>
          </div>
          {profile.workExperience.map((exp, index) => (
            <div key={index} className="array-item-card">
              <button type="button" className="btn-remove" onClick={() => removeArrayItem(index, 'workExperience')}>×</button>
              <div className="form-group row">
                <div className="col-half">
                  <label>Job Title</label>
                  <input type="text" name="jobTitle" value={exp.jobTitle} onChange={(e) => handleArrayChange(e, index, 'workExperience')} />
                </div>
                <div className="col-half">
                  <label>Company Name</label>
                  <input type="text" name="company" value={exp.company} onChange={(e) => handleArrayChange(e, index, 'workExperience')} />
                </div>
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input type="text" name="duration" value={exp.duration} onChange={(e) => handleArrayChange(e, index, 'workExperience')} placeholder="e.g. Jan 2023 - Present" />
              </div>
              <div className="form-group">
                <label>Key Responsibilities / Achievements</label>
                <textarea name="responsibilities" value={exp.responsibilities} onChange={(e) => handleArrayChange(e, index, 'workExperience')} rows="2"></textarea>
              </div>
            </div>
          ))}
        </div>

        {/* Section 6: Projects */}
        <div className="profile-section">
          <div className="section-header-flex">
            <h3>6. Projects</h3>
            <button type="button" className="btn-add" onClick={() => addArrayItem('projects', { projectName: '', description: '', technologies: '' })}>+ Add Project</button>
          </div>
          {profile.projects.map((proj, index) => (
            <div key={index} className="array-item-card">
              <button type="button" className="btn-remove" onClick={() => removeArrayItem(index, 'projects')}>×</button>
              <div className="form-group row">
                <div className="col-half">
                  <label>Project Name</label>
                  <input type="text" name="projectName" value={proj.projectName} onChange={(e) => handleArrayChange(e, index, 'projects')} placeholder="e.g. Auto Nexus Website" />
                </div>
                <div className="col-half">
                  <label>Technologies Used</label>
                  <input type="text" name="technologies" value={proj.technologies} onChange={(e) => handleArrayChange(e, index, 'projects')} placeholder="e.g. React, Spring Boot" />
                </div>
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <textarea name="description" value={proj.description} onChange={(e) => handleArrayChange(e, index, 'projects')} rows="2" placeholder="Online spare parts platform..."></textarea>
              </div>
            </div>
          ))}
        </div>

        {/* Section 7 & 8 & 9 */}
        <div className="profile-section">
          <h3>7. Additional Information</h3>
          <div className="form-group row">
            <div className="col-half">
              <label>7. Certifications (comma separated)</label>
              <input type="text" name="certifications" value={profile.certifications} onChange={handleChange} placeholder="e.g. AWS Cloud Practitioner" />
            </div>
            <div className="col-half">
              <label>8. Achievements / Activities (comma separated)</label>
              <input type="text" name="achievements" value={profile.achievements} onChange={handleChange} placeholder="e.g. Hackathon Winner, Club President" />
            </div>
          </div>
          <div className="form-group">
            <label>9. References</label>
            <input type="text" name="references" value={profile.references} onChange={handleChange} placeholder="e.g. Available upon request" />
          </div>
        </div>

        <div className="form-actions sticky-actions">
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : 'Save All Profile Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default StudentProfile;
