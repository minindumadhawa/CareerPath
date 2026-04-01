import React, { useState, useEffect, useCallback } from 'react';
import { environment } from '../../environments/environment';
import './StudentProfile.css';

// ─── Constants ─────────────────────────────────────────────────
const EMPTY_EDUCATION = { degree: '', institution: '', year: '' };
const EMPTY_EXPERIENCE = { jobTitle: '', company: '', duration: '', responsibilities: '' };
const EMPTY_PROJECT = { projectName: '', description: '', technologies: '' };

const INITIAL_PROFILE = {
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
  references: '',
  languages: '',
};

// ─── Helpers ───────────────────────────────────────────────────
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
};

const toCommaString = (val) => {
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'string') return val;
  return '';
};

const toArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim()) {
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
function StudentProfile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const user = getUser();
  const apiUrl = environment?.apiUrl || 'http://localhost:5000/api/users';

  // ─── Fetch Profile ────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      setMessage({ text: 'User data not found. Please log in again.', type: 'error' });
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/profile/${user.id}`);
      const data = await res.json();

      if (res.ok) {
        setProfile({
          fullName: data.fullName || user.name || '',
          email: data.email || user.email || '',
          university: data.university || '',
          phoneNumber: data.phoneNumber || '',
          location: data.location || '',
          linkedin: data.linkedin || '',
          summary: data.summary || '',
          technicalSkills: toCommaString(data.technicalSkills),
          softSkills: toCommaString(data.softSkills),
          education: Array.isArray(data.education) ? data.education : [],
          workExperience: Array.isArray(data.workExperience) ? data.workExperience : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          certifications: toCommaString(data.certifications),
          achievements: toCommaString(data.achievements),
          references: data.references || '',
          languages: toCommaString(data.languages),
        });
      } else {
        setMessage({
          text: data.message || 'Failed to fetch profile. You can still fill in your details.',
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setMessage({ text: 'Network error while loading profile. Please check your connection.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [apiUrl, user?.id, user?.name, user?.email]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ─── Warn before leaving with unsaved changes ─────────────
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // ─── Auto-dismiss messages ────────────────────────────────
  useEffect(() => {
    if (message.text && message.type === 'success') {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ─── Input Handlers ───────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);

    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleArrayChange = (e, index, arrayName) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      const updated = [...prev[arrayName]];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, [arrayName]: updated };
    });
    setHasUnsavedChanges(true);
  };

  const addArrayItem = (arrayName, emptyItem) => {
    setProfile((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...emptyItem }],
    }));
    setHasUnsavedChanges(true);
  };

  const removeArrayItem = (index, arrayName) => {
    setProfile((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
    setHasUnsavedChanges(true);
  };

  // ─── Validation ───────────────────────────────────────────
  const validate = () => {
    const errors = {};

    if (!profile.fullName.trim()) errors.fullName = 'Full name is required';
    if (!profile.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!profile.university.trim()) errors.university = 'University is required';

    if (profile.phoneNumber && !/^[+\d\s()-]{7,20}$/.test(profile.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── Submit ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setMessage({ text: 'Please fix the highlighted errors before saving.', type: 'error' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!user?.id) {
      setMessage({ text: 'User session expired. Please log in again.', type: 'error' });
      return;
    }

    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      // Build payload — convert comma strings to arrays for backend
      const payload = {
        ...profile,
        technicalSkills: toArray(profile.technicalSkills),
        softSkills: toArray(profile.softSkills),
        certifications: toArray(profile.certifications),
        achievements: toArray(profile.achievements),
        languages: toArray(profile.languages),
      };

      const res = await fetch(`${apiUrl}/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: 'Profile saved successfully!', type: 'success' });
        setHasUnsavedChanges(false);

        // Sync user name in localStorage
        if (data.user?.fullName) {
          const updatedUser = { ...user, name: data.user.fullName };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } else {
        setMessage({ text: data.message || 'Failed to save profile. Please try again.', type: 'error' });
      }
    } catch (err) {
      console.error('Save error:', err);
      setMessage({ text: 'Network error while saving. Please check your connection and try again.', type: 'error' });
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ─── Loading State ────────────────────────────────────────
  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  // ─── Render Helpers ───────────────────────────────────────
  const renderFieldError = (fieldName) =>
    fieldErrors[fieldName] ? (
      <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 2, display: 'block' }}>
        {fieldErrors[fieldName]}
      </span>
    ) : null;

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
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

      <form onSubmit={handleSubmit} className="profile-form" noValidate>

        {/* ── Section 1: Personal Information ──────────────── */}
        <div className="profile-section">
          <h3>1. Personal Information</h3>
          <div className="form-group row">
            <div className="col-half">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                required
                style={fieldErrors.fullName ? { borderColor: '#ef4444' } : undefined}
              />
              {renderFieldError('fullName')}
            </div>
            <div className="col-half">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
                style={fieldErrors.email ? { borderColor: '#ef4444' } : undefined}
              />
              {renderFieldError('email')}
            </div>
          </div>
          <div className="form-group row">
            <div className="col-half">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                style={fieldErrors.phoneNumber ? { borderColor: '#ef4444' } : undefined}
              />
              {renderFieldError('phoneNumber')}
            </div>
            <div className="col-half">
              <label>Location (City, Country)</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="e.g. New York, USA"
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-half">
              <label>LinkedIn / Portfolio</label>
              <input
                type="text"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleChange}
                placeholder="linkedin.com/in/yourname"
              />
            </div>
            <div className="col-half">
              <label>University / College</label>
              <input
                type="text"
                name="university"
                value={profile.university}
                onChange={handleChange}
                required
                style={fieldErrors.university ? { borderColor: '#ef4444' } : undefined}
              />
              {renderFieldError('university')}
            </div>
          </div>
        </div>

        {/* ── Section 2: Professional Summary ─────────────── */}
        <div className="profile-section">
          <h3>2. Professional Summary</h3>
          <div className="form-group">
            <textarea
              name="summary"
              value={profile.summary}
              onChange={handleChange}
              rows="3"
              placeholder="A short paragraph about who you are, your skills, and your career goals..."
            />
          </div>
        </div>

        {/* ── Section 3: Education ─────────────────────────── */}
        <div className="profile-section">
          <div className="section-header-flex">
            <h3>3. Education</h3>
            <button type="button" className="btn-add" onClick={() => addArrayItem('education', EMPTY_EDUCATION)}>
              + Add Education
            </button>
          </div>
          {profile.education.length === 0 && (
            <p style={{ color: '#9198af', fontSize: '0.88rem', margin: 0 }}>
              No education entries yet. Click "+ Add Education" to get started.
            </p>
          )}
          {profile.education.map((edu, index) => (
            <div key={index} className="array-item-card">
              <button type="button" className="btn-remove" onClick={() => removeArrayItem(index, 'education')}>
                ×
              </button>
              <div className="form-group row">
                <div className="col-1">
                  <label>Degree / Course</label>
                  <input
                    type="text"
                    name="degree"
                    value={edu.degree}
                    onChange={(e) => handleArrayChange(e, index, 'education')}
                    placeholder="e.g. B.Sc. in Computer Science"
                  />
                </div>
                <div className="col-1">
                  <label>University / School</label>
                  <input
                    type="text"
                    name="institution"
                    value={edu.institution}
                    onChange={(e) => handleArrayChange(e, index, 'education')}
                    placeholder="e.g. MIT"
                  />
                </div>
                <div className="col-small">
                  <label>Year</label>
                  <input
                    type="text"
                    name="year"
                    value={edu.year}
                    onChange={(e) => handleArrayChange(e, index, 'education')}
                    placeholder="e.g. 2024"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Section 4: Skills ────────────────────────────── */}
        <div className="profile-section">
          <h3>4. Skills</h3>
          <div className="form-group">
            <label>Technical Skills (comma separated)</label>
            <input
              type="text"
              name="technicalSkills"
              value={profile.technicalSkills}
              onChange={handleChange}
              placeholder="e.g. Java, HTML, React, SQL"
            />
          </div>
          <div className="form-group">
            <label>Soft Skills (comma separated)</label>
            <input
              type="text"
              name="softSkills"
              value={profile.softSkills}
              onChange={handleChange}
              placeholder="e.g. Communication, Teamwork, Leadership"
            />
          </div>
        </div>

        {/* ── Section 5: Work Experience ───────────────────── */}
        <div className="profile-section">
          <div className="section-header-flex">
            <h3>5. Work Experience</h3>
            <button type="button" className="btn-add" onClick={() => addArrayItem('workExperience', EMPTY_EXPERIENCE)}>
              + Add Experience
            </button>
          </div>
          {profile.workExperience.length === 0 && (
            <p style={{ color: '#9198af', fontSize: '0.88rem', margin: 0 }}>
              No work experience yet. Click "+ Add Experience" to add your roles.
            </p>
          )}
          {profile.workExperience.map((exp, index) => (
            <div key={index} className="array-item-card">
              <button type="button" className="btn-remove" onClick={() => removeArrayItem(index, 'workExperience')}>
                ×
              </button>
              <div className="form-group row">
                <div className="col-half">
                  <label>Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={exp.jobTitle}
                    onChange={(e) => handleArrayChange(e, index, 'workExperience')}
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div className="col-half">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={exp.company}
                    onChange={(e) => handleArrayChange(e, index, 'workExperience')}
                    placeholder="e.g. Google"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={exp.duration}
                  onChange={(e) => handleArrayChange(e, index, 'workExperience')}
                  placeholder="e.g. Jan 2023 - Present"
                />
              </div>
              <div className="form-group">
                <label>Key Responsibilities / Achievements</label>
                <textarea
                  name="responsibilities"
                  value={exp.responsibilities}
                  onChange={(e) => handleArrayChange(e, index, 'workExperience')}
                  rows="2"
                  placeholder="Describe your key contributions..."
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Section 6: Projects ──────────────────────────── */}
        <div className="profile-section">
          <div className="section-header-flex">
            <h3>6. Projects</h3>
            <button type="button" className="btn-add" onClick={() => addArrayItem('projects', EMPTY_PROJECT)}>
              + Add Project
            </button>
          </div>
          {profile.projects.length === 0 && (
            <p style={{ color: '#9198af', fontSize: '0.88rem', margin: 0 }}>
              No projects yet. Click "+ Add Project" to showcase your work.
            </p>
          )}
          {profile.projects.map((proj, index) => (
            <div key={index} className="array-item-card">
              <button type="button" className="btn-remove" onClick={() => removeArrayItem(index, 'projects')}>
                ×
              </button>
              <div className="form-group row">
                <div className="col-half">
                  <label>Project Name</label>
                  <input
                    type="text"
                    name="projectName"
                    value={proj.projectName}
                    onChange={(e) => handleArrayChange(e, index, 'projects')}
                    placeholder="e.g. E-Commerce Platform"
                  />
                </div>
                <div className="col-half">
                  <label>Technologies Used</label>
                  <input
                    type="text"
                    name="technologies"
                    value={proj.technologies}
                    onChange={(e) => handleArrayChange(e, index, 'projects')}
                    placeholder="e.g. React, Node.js, MongoDB"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <textarea
                  name="description"
                  value={proj.description}
                  onChange={(e) => handleArrayChange(e, index, 'projects')}
                  rows="2"
                  placeholder="Brief description of what the project does..."
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Section 7: Additional Information ────────────── */}
        <div className="profile-section">
          <h3>7. Additional Information</h3>
          <div className="form-group row">
            <div className="col-half">
              <label>Certifications (comma separated)</label>
              <input
                type="text"
                name="certifications"
                value={profile.certifications}
                onChange={handleChange}
                placeholder="e.g. AWS Cloud Practitioner, Scrum Master"
              />
            </div>
            <div className="col-half">
              <label>Achievements / Activities (comma separated)</label>
              <input
                type="text"
                name="achievements"
                value={profile.achievements}
                onChange={handleChange}
                placeholder="e.g. Hackathon Winner, Club President"
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-half">
              <label>Languages (comma separated)</label>
              <input
                type="text"
                name="languages"
                value={profile.languages}
                onChange={handleChange}
                placeholder="e.g. English (Native), Spanish (Professional)"
              />
            </div>
            <div className="col-half">
              <label>References</label>
              <input
                type="text"
                name="references"
                value={profile.references}
                onChange={handleChange}
                placeholder="e.g. Available upon request"
              />
            </div>
          </div>
        </div>

        {/* ── Save Button ──────────────────────────────────── */}
        <div className="form-actions sticky-actions">
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : hasUnsavedChanges ? '💾 Save All Profile Changes' : '✓ All Changes Saved'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentProfile;