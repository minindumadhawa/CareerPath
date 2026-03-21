import React, { useState, useEffect } from 'react';
import './StudentProfile.css';

function StudentProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    professionalSummary: '',
    university: '',
    educationLevel: '',
    graduationYear: '',
    technicalSkills: '',
    softSkills: '',
    experience: [],
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
          phone: data.phone || '',
          location: data.location || '',
          linkedin: data.linkedin || '',
          professionalSummary: data.professionalSummary || '',
          university: data.university || '',
          educationLevel: data.educationLevel || '',
          graduationYear: data.graduationYear || '',
          technicalSkills: data.technicalSkills && Array.isArray(data.technicalSkills) ? data.technicalSkills.join(', ') : '',
          softSkills: data.softSkills && Array.isArray(data.softSkills) ? data.softSkills.join(', ') : '',
          experience: data.experience || [],
          projects: data.projects || [],
          certifications: data.certifications && Array.isArray(data.certifications) ? data.certifications.join(', ') : '',
          achievements: data.achievements && Array.isArray(data.achievements) ? data.achievements.join(', ') : '',
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
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    const newArray = [...profile[arrayName]];
    newArray[index] = { ...newArray[index], [field]: value };
    setProfile(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const addArrayItem = (arrayName, emptyItem) => {
    setProfile(prev => ({ ...prev, [arrayName]: [...prev[arrayName], emptyItem] }));
  };

  const removeArrayItem = (index, arrayName) => {
    const newArray = [...profile[arrayName]];
    newArray.splice(index, 1);
    setProfile(prev => ({ ...prev, [arrayName]: newArray }));
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
    <div className="profile-container wide">
      <div className="profile-header">
        <h2>My Profile Builder</h2>
        <p>Complete your resume details to stand out to employers</p>
      </div>
      
      {message.text && (
        <div className={`profile-alert ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form detailed-form">
        
        {/* Section 1: Personal Info */}
        <div className="form-section">
          <h3>🔹 1. Personal Information</h3>
          <div className="form-group row">
            <div className="col-half">
              <label>Full Name *</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} required />
            </div>
            <div className="col-half">
              <label>Email Address</label>
              <input type="email" name="email" value={profile.email} className="input-disabled" disabled />
            </div>
            <div className="col-half">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={profile.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
            </div>
            <div className="col-half">
              <label>Location</label>
              <input type="text" name="location" value={profile.location} onChange={handleChange} placeholder="City, Country" />
            </div>
            <div className="col-full">
              <label>LinkedIn / Portfolio URL</label>
              <input type="url" name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" />
            </div>
          </div>
        </div>

        {/* Section 2: Professional Summary */}
        <div className="form-section">
          <h3>🔹 2. Professional Summary</h3>
          <p className="section-help">A short paragraph about who you are, your skills, and career goals.</p>
          <div className="form-group">
            <textarea 
              name="professionalSummary" 
              value={profile.professionalSummary} 
              onChange={handleChange} 
              rows="4"
              placeholder="e.g. Motivated IT undergraduate with strong skills in web development and a passion for building user-friendly applications."
            ></textarea>
          </div>
        </div>

        {/* Section 3: Education */}
        <div className="form-section">
          <h3>🔹 3. Education</h3>
          <div className="form-group row">
            <div className="col-full">
              <label>University or School Name *</label>
              <input type="text" name="university" value={profile.university} onChange={handleChange} required />
            </div>
            <div className="col-half">
              <label>Degree / Course Name</label>
              <input type="text" name="educationLevel" value={profile.educationLevel} onChange={handleChange} placeholder="BSc in Computer Science" />
            </div>
            <div className="col-half">
              <label>Year of Completion</label>
              <input type="text" name="graduationYear" value={profile.graduationYear} onChange={handleChange} placeholder="2024 (or Expected 2025)" />
            </div>
          </div>
        </div>

        {/* Section 4: Skills */}
        <div className="form-section">
          <h3>🔹 4. Skills</h3>
          <div className="form-group row">
            <div className="col-full">
              <label>Technical Skills (comma separated)</label>
              <input type="text" name="technicalSkills" value={profile.technicalSkills} onChange={handleChange} placeholder="Java, HTML, SQL, React" />
            </div>
            <div className="col-full">
              <label>Soft Skills (comma separated)</label>
              <input type="text" name="softSkills" value={profile.softSkills} onChange={handleChange} placeholder="Communication, Teamwork, Leadership" />
            </div>
          </div>
        </div>

        {/* Section 5: Work Experience */}
        <div className="form-section">
          <div className="section-header-flex">
            <h3>🔹 5. Work Experience</h3>
            <button type="button" className="btn-add" onClick={() => addArrayItem('experience', { jobTitle: '', company: '', duration: '', responsibilities: '' })}>+ Add Experience</button>
          </div>
          {profile.experience.length === 0 && <p className="empty-text">No work experience added yet.</p>}
          {profile.experience.map((exp, index) => (
            <div key={index} className="array-card">
              <button type="button" className="btn-remove" onClick={() => removeArrayItem(index, 'experience')}>&times; Remove</button>
              <div className="form-group row">
                <div className="col-half">
                  <label>Job Title</label>
                  <input type="text" value={exp.jobTitle} onChange={(e) => handleArrayChange(index, 'jobTitle', e.target.value, 'experience')} placeholder="Software Engineer Intern" />
                </div>
                <div className="col-half">
                  <label>Company Name</label>
                  <input type="text" value={exp.company} onChange={(e) => handleArrayChange(index, 'company', e.target.value, 'experience')} placeholder="Tech Solutions Corp" />
                </div>
                <div className="col-half">
                  <label>Duration</label>
                  <input type="text" value={exp.duration} onChange={(e) => handleArrayChange(index, 'duration', e.target.value, 'experience')} placeholder="Jan 2023 - Present" />
                </div>
                <div className="col-full">
                  <label>Key Responsibilities</label>
                  <textarea rows="2" value={exp.responsibilities} onChange={(e) => handleArrayChange(index, 'responsibilities', e.target.value, 'experience')} placeholder="Developed REST APIs using Node.js..."></textarea>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 6: Projects */}
        <div className="form-section">
          <div className="section-header-flex">
            <h3>🔹 6. Projects</h3>
            <button type="button" className="btn-add" onClick={() => addArrayItem('projects', { name: '', description: '', technologies: '' })}>+ Add Project</button>
          </div>
          {profile.projects.length === 0 && <p className="empty-text">No projects added yet.</p>}
          {profile.projects.map((proj, index) => (
            <div key={index} className="array-card">
              <button type="button" className="btn-remove" onClick={() => removeArrayItem(index, 'projects')}>&times; Remove</button>
              <div className="form-group row">
                <div className="col-half">
                  <label>Project Name</label>
                  <input type="text" value={proj.name} onChange={(e) => handleArrayChange(index, 'name', e.target.value, 'projects')} placeholder="Auto Nexus Website" />
                </div>
                <div className="col-half">
                  <label>Technologies Used</label>
                  <input type="text" value={proj.technologies} onChange={(e) => handleArrayChange(index, 'technologies', e.target.value, 'projects')} placeholder="React, Spring Boot" />
                </div>
                <div className="col-full">
                  <label>Short Description</label>
                  <textarea rows="2" value={proj.description} onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'projects')} placeholder="Online spare parts platform..."></textarea>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 7, 8, 9: Additional Information */}
        <div className="form-section">
          <h3>🔹 Additional Information</h3>
          <div className="form-group row">
            <div className="col-full">
              <label>Certifications (comma separated)</label>
              <input type="text" name="certifications" value={profile.certifications} onChange={handleChange} placeholder="AWS Certified Developer, Coursera React Native" />
            </div>
            <div className="col-full">
              <label>Achievements / Activities (comma separated)</label>
              <input type="text" name="achievements" value={profile.achievements} onChange={handleChange} placeholder="Hackathon Winner 2023, IT Club President" />
            </div>
            <div className="col-full">
              <label>References</label>
              <input type="text" name="references" value={profile.references} onChange={handleChange} placeholder="Available upon request" />
            </div>
          </div>
        </div>

        <div className="form-actions sticky">
          <button type="submit" className="btn-save btn-large" disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Complete Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentProfile;
