import React, { useState, useEffect, useCallback } from 'react';
import { environment } from '../../environments/environment';
import './StudentProfile.css';

// ─── Constants ─────────────────────────────────────────────────
const EMPTY_EDUCATION  = { degree: '', institution: '', year: '' };
const EMPTY_EXPERIENCE = { jobTitle: '', company: '', duration: '', responsibilities: '' };
const EMPTY_PROJECT    = { projectName: '', description: '', technologies: '' };

const PHOTO_MAX_MB   = 2;                          // ← change this to adjust limit
const PHOTO_MAX_BYTES = PHOTO_MAX_MB * 1024 * 1024;
const PHOTO_ACCEPT   = ['image/jpeg', 'image/png', 'image/webp'];

const INITIAL_PROFILE = {
  fullName: '', email: '', university: '', phoneNumber: '',
  location: '', linkedin: '', summary: '',
  technicalSkills: '', softSkills: '',
  education: [], workExperience: [], projects: [],
  certifications: '', achievements: '', references: '', languages: '',
};

// ─── Helpers ───────────────────────────────────────────────────
const getUser = () => {
  try { return JSON.parse(localStorage.getItem('user')) || null; }
  catch { return null; }
};

const toCommaString = (val) => {
  if (Array.isArray(val)) return val.join(', ');
  return typeof val === 'string' ? val : '';
};

const toArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim())
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

const getInitials = (name = '') =>
  name.trim().split(' ').filter(Boolean).slice(0, 2)
    .map((w) => w[0].toUpperCase()).join('') || '?';

const formatBytes = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── Delete Confirmation Modal ──────────────────────────────────
function DeleteModal({ isOpen, onConfirm, onCancel, itemLabel }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">⚠️</div>
        <h4>Delete {itemLabel}?</h4>
        <p>This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn-cancel-modal" onClick={onCancel}>Cancel</button>
          <button className="btn-delete-modal" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Array Item Card ────────────────────────────────────────────
function ArrayItemCard({ children, index, arrayName, label, isEditing, onToggleEdit, onDelete }) {
  return (
    <div className={`array-item-card ${isEditing ? 'editing' : 'view-mode'}`}>
      <div className="card-toolbar">
        <span className="card-label">{label} #{index + 1}</span>
        <div className="card-actions">
          <button
            type="button"
            className={`btn-icon ${isEditing ? 'btn-icon-done' : 'btn-icon-edit'}`}
            onClick={onToggleEdit}
          >
            {isEditing ? '✓ Done' : '✎ Edit'}
          </button>
          <button
            type="button"
            className="btn-icon btn-icon-delete"
            onClick={() => onDelete(index, arrayName)}
          >
            🗑 Delete
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
function StudentProfile() {
  const [profile, setProfile]               = useState(INITIAL_PROFILE);
  const [profilePicture, setProfilePicture] = useState('');
  const [picFileName, setPicFileName]       = useState('');
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [message, setMessage]               = useState({ text: '', type: '' });
  const [fieldErrors, setFieldErrors]       = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingCards, setEditingCards]     = useState({});
  const [deleteConfirm, setDeleteConfirm]   = useState({
    open: false, index: null, arrayName: null, label: '',
  });

  const user   = getUser();
  const apiUrl = environment?.apiUrl || 'http://localhost:5000/api/users';

  // ─── Fetch Profile ──────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      setMessage({ text: 'User data not found. Please log in again.', type: 'error' });
      return;
    }
    try {
      const res  = await fetch(`${apiUrl}/profile/${user.id}`);
      const data = await res.json();
      if (res.ok) {
        setProfile({
          fullName:        data.fullName        || user.name  || '',
          email:           data.email           || user.email || '',
          university:      data.university      || '',
          phoneNumber:     data.phoneNumber     || '',
          location:        data.location        || '',
          linkedin:        data.linkedin        || '',
          summary:         data.summary         || '',
          technicalSkills: toCommaString(data.technicalSkills),
          softSkills:      toCommaString(data.softSkills),
          education:       Array.isArray(data.education)      ? data.education      : [],
          workExperience:  Array.isArray(data.workExperience) ? data.workExperience : [],
          projects:        Array.isArray(data.projects)       ? data.projects       : [],
          certifications:  toCommaString(data.certifications),
          achievements:    toCommaString(data.achievements),
          references:      data.references      || '',
          languages:       toCommaString(data.languages),
        });
        if (data.profilePicture) setProfilePicture(data.profilePicture);
      } else {
        setMessage({ text: data.message || 'Failed to fetch profile.', type: 'error' });
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setMessage({ text: 'Network error while loading profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [apiUrl, user?.id, user?.name, user?.email]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  useEffect(() => {
    const handler = (e) => {
      if (hasUnsavedChanges) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (message.text && message.type === 'success') {
      const t = setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  // ─── Profile Picture Upload ─────────────────────────────────
  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Type check
    if (!PHOTO_ACCEPT.includes(file.type)) {
      setMessage({ text: 'Only JPG, PNG or WebP images are accepted.', type: 'error' });
      e.target.value = '';
      return;
    }

    // Size check
    if (file.size > PHOTO_MAX_BYTES) {
      setMessage({
        text: `Photo too large (${formatBytes(file.size)}). Maximum allowed size is ${PHOTO_MAX_MB} MB.`,
        type: 'error',
      });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilePicture(ev.target.result);
      setPicFileName(file.name);
      setHasUnsavedChanges(true);
      setMessage({ text: '', type: '' });
    };
    reader.readAsDataURL(file);
  };

  const removePicture = () => {
    setProfilePicture('');
    setPicFileName('');
    setHasUnsavedChanges(true);
    const input = document.getElementById('picInput');
    if (input) input.value = '';
  };

  // ─── Field Handlers ─────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
    if (fieldErrors[name])
      setFieldErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
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

  // ─── Add ────────────────────────────────────────────────────
  const addArrayItem = (arrayName, emptyItem) => {
    const newIndex = profile[arrayName].length;
    setProfile((prev) => ({ ...prev, [arrayName]: [...prev[arrayName], { ...emptyItem }] }));
    setEditingCards((prev) => ({ ...prev, [`${arrayName}-${newIndex}`]: true }));
    setHasUnsavedChanges(true);
  };

  // ─── Edit Toggle ────────────────────────────────────────────
  const toggleEditCard = (arrayName, index) => {
    const key = `${arrayName}-${index}`;
    setEditingCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const isCardEditing = (arrayName, index) => !!editingCards[`${arrayName}-${index}`];

  // ─── Delete ─────────────────────────────────────────────────
  const requestDelete = (index, arrayName) => {
    const labelMap = { education: 'Education', workExperience: 'Work Experience', projects: 'Project' };
    setDeleteConfirm({ open: true, index, arrayName, label: labelMap[arrayName] || 'Item' });
  };

  const confirmDelete = () => {
    const { index, arrayName } = deleteConfirm;
    setProfile((prev) => ({ ...prev, [arrayName]: prev[arrayName].filter((_, i) => i !== index) }));
    setEditingCards((prev) => {
      const next = {};
      Object.keys(prev).forEach((key) => {
        const [arr, idxStr] = key.split('-');
        const idx = parseInt(idxStr);
        if (arr !== arrayName) next[key] = prev[key];
        else if (idx < index)  next[key] = prev[key];
        else if (idx > index)  next[`${arr}-${idx - 1}`] = prev[key];
      });
      return next;
    });
    setHasUnsavedChanges(true);
    setDeleteConfirm({ open: false, index: null, arrayName: null, label: '' });
  };

  const cancelDelete = () =>
    setDeleteConfirm({ open: false, index: null, arrayName: null, label: '' });

  // ─── Validation ─────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    if (!profile.fullName.trim())   errors.fullName   = 'Full name is required';
    if (!profile.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!profile.university.trim()) errors.university = 'University is required';
    if (profile.phoneNumber && !/^[+\d\s()-]{7,20}$/.test(profile.phoneNumber))
      errors.phoneNumber = 'Please enter a valid phone number';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── Submit ─────────────────────────────────────────────────
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
      const payload = {
        ...profile,
        profilePicture,
        technicalSkills: toArray(profile.technicalSkills),
        softSkills:      toArray(profile.softSkills),
        certifications:  toArray(profile.certifications),
        achievements:    toArray(profile.achievements),
        languages:       toArray(profile.languages),
      };
      const res  = await fetch(`${apiUrl}/profile/${user.id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: 'Profile saved successfully!', type: 'success' });
        setHasUnsavedChanges(false);
        if (data.user?.fullName)
          localStorage.setItem('user', JSON.stringify({ ...user, name: data.user.fullName }));
      } else {
        setMessage({ text: data.message || 'Failed to save profile.', type: 'error' });
      }
    } catch (err) {
      console.error('Save error:', err);
      setMessage({ text: 'Network error while saving.', type: 'error' });
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ─── Loading ────────────────────────────────────────────────
  if (loading)
    return <div className="profile-container"><div className="profile-loading">Loading profile…</div></div>;

  // ─── Render Helpers ─────────────────────────────────────────
  const fieldError = (name) =>
    fieldErrors[name] ? (
      <span style={{ color: '#e11d48', fontSize: '0.75rem', marginTop: 3, display: 'block' }}>
        {fieldErrors[name]}
      </span>
    ) : null;

  const viewRow = (fields) => (
    <div className="view-row">
      {fields.map(({ label, value }) => (
        <div key={label} className="view-field">
          <span className="view-label">{label}</span>
          <span className="view-value">{value || <em className="empty-val">—</em>}</span>
        </div>
      ))}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="profile-container">

      <DeleteModal
        isOpen={deleteConfirm.open}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        itemLabel={deleteConfirm.label}
      />

      <div className="profile-header">
        <h2>My Resume / Profile</h2>
        <p>Complete your profile to build your resume automatically and stand out to employers.</p>
      </div>

      {message.text && (
        <div className={`profile-alert ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="profile-form" noValidate>

        {/* ── Profile Picture ─────────────────────────────── */}
        <div className="profile-section">
          <h3>Profile Picture</h3>
          <div className="pic-section">

            {/* Avatar / initials circle */}
            <div className="pic-wrapper" onClick={() => document.getElementById('picInput').click()}>
              {profilePicture
                ? <img className="pic-avatar" src={profilePicture} alt="Profile" />
                : <div className="pic-initials">{getInitials(profile.fullName)}</div>
              }
              <div className="pic-overlay"><span className="pic-overlay-icon">📷</span></div>
            </div>

            {/* Info + buttons */}
            <div className="pic-info">
              <h4>
                {profilePicture
                  ? picFileName || 'Photo uploaded'
                  : 'Upload a professional photo'}
              </h4>
              <p>
                JPG, PNG or WebP only · Max {PHOTO_MAX_MB} MB<br />
                Click the circle or the button below to choose a file.
              </p>
              <div className="pic-btns">
                <button type="button" className="btn-upload-pic"
                  onClick={() => document.getElementById('picInput').click()}>
                  {profilePicture ? '🔄 Change Photo' : '📁 Choose Photo'}
                </button>
                {profilePicture && (
                  <button type="button" className="btn-remove-pic" onClick={removePicture}>
                    ✕ Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Hidden file input — accept + no size attr (we validate in JS) */}
          <input
            type="file"
            id="picInput"
            accept={PHOTO_ACCEPT.join(',')}
            style={{ display: 'none' }}
            onChange={handlePicUpload}
          />
        </div>

        {/* ── 1. Personal Information ──────────────────────── */}
        <div className="profile-section">
          <h3>1. Personal Information</h3>
          <div className="form-group row">
            <div className="col-half">
              <label>Full Name</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} required
                style={fieldErrors.fullName ? { borderColor: '#e11d48' } : undefined} />
              {fieldError('fullName')}
            </div>
            <div className="col-half">
              <label>Email Address</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} required
                style={fieldErrors.email ? { borderColor: '#e11d48' } : undefined} />
              {fieldError('email')}
            </div>
          </div>
          <div className="form-group row">
            <div className="col-half">
              <label>Phone Number</label>
              <input type="tel" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange}
                placeholder="+94 77 123 4567"
                style={fieldErrors.phoneNumber ? { borderColor: '#e11d48' } : undefined} />
              {fieldError('phoneNumber')}
            </div>
            <div className="col-half">
              <label>Location (City, Country)</label>
              <input type="text" name="location" value={profile.location} onChange={handleChange}
                placeholder="e.g. Colombo, Sri Lanka" />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-half">
              <label>LinkedIn / Portfolio</label>
              <input type="text" name="linkedin" value={profile.linkedin} onChange={handleChange}
                placeholder="linkedin.com/in/yourname" />
            </div>
            <div className="col-half">
              <label>University / College</label>
              <input type="text" name="university" value={profile.university} onChange={handleChange} required
                style={fieldErrors.university ? { borderColor: '#e11d48' } : undefined} />
              {fieldError('university')}
            </div>
          </div>
        </div>

        {/* ── 2. Professional Summary ──────────────────────── */}
        <div className="profile-section">
          <h3>2. Professional Summary</h3>
          <div className="form-group">
            <textarea name="summary" value={profile.summary} onChange={handleChange} rows="3"
              placeholder="A short paragraph about who you are, your skills, and your career goals…" />
          </div>
        </div>

        {/* ── 3. Education ─────────────────────────────────── */}
        <div className="profile-section">
          <div className="section-header-flex">
            <h3>3. Education</h3>
            <button type="button" className="btn-add" onClick={() => addArrayItem('education', EMPTY_EDUCATION)}>
              + Add Education
            </button>
          </div>
          {profile.education.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
              No education entries yet. Click "+ Add Education" to get started.
            </p>
          )}
          {profile.education.map((edu, i) => (
            <ArrayItemCard key={i} index={i} arrayName="education" label="Education"
              isEditing={isCardEditing('education', i)}
              onToggleEdit={() => toggleEditCard('education', i)}
              onDelete={requestDelete}
            >
              {isCardEditing('education', i) ? (
                <div className="form-group row" style={{ marginTop: 10 }}>
                  <div className="col-1">
                    <label>Degree / Course</label>
                    <input type="text" name="degree" value={edu.degree}
                      onChange={(e) => handleArrayChange(e, i, 'education')}
                      placeholder="e.g. B.Sc. Computer Science" />
                  </div>
                  <div className="col-1">
                    <label>University / School</label>
                    <input type="text" name="institution" value={edu.institution}
                      onChange={(e) => handleArrayChange(e, i, 'education')}
                      placeholder="e.g. University of Colombo" />
                  </div>
                  <div className="col-small">
                    <label>Year</label>
                    <input type="text" name="year" value={edu.year}
                      onChange={(e) => handleArrayChange(e, i, 'education')}
                      placeholder="2024" />
                  </div>
                </div>
              ) : viewRow([
                { label: 'Degree', value: edu.degree },
                { label: 'Institution', value: edu.institution },
                { label: 'Year', value: edu.year },
              ])}
            </ArrayItemCard>
          ))}
        </div>

        {/* ── 4. Skills ────────────────────────────────────── */}
        <div className="profile-section">
          <h3>4. Skills</h3>
          <div className="form-group">
            <label>Technical Skills (comma separated)</label>
            <input type="text" name="technicalSkills" value={profile.technicalSkills} onChange={handleChange}
              placeholder="e.g. Java, React, Node.js, SQL" />
          </div>
          <div className="form-group">
            <label>Soft Skills (comma separated)</label>
            <input type="text" name="softSkills" value={profile.softSkills} onChange={handleChange}
              placeholder="e.g. Communication, Teamwork, Leadership" />
          </div>
        </div>

        {/* ── 5. Work Experience ───────────────────────────── */}
        <div className="profile-section">
          <div className="section-header-flex">
            <h3>5. Work Experience</h3>
            <button type="button" className="btn-add"
              onClick={() => addArrayItem('workExperience', EMPTY_EXPERIENCE)}>
              + Add Experience
            </button>
          </div>
          {profile.workExperience.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
              No work experience yet. Click "+ Add Experience" to add your roles.
            </p>
          )}
          {profile.workExperience.map((exp, i) => (
            <ArrayItemCard key={i} index={i} arrayName="workExperience" label="Experience"
              isEditing={isCardEditing('workExperience', i)}
              onToggleEdit={() => toggleEditCard('workExperience', i)}
              onDelete={requestDelete}
            >
              {isCardEditing('workExperience', i) ? (
                <>
                  <div className="form-group row" style={{ marginTop: 10 }}>
                    <div className="col-half">
                      <label>Job Title</label>
                      <input type="text" name="jobTitle" value={exp.jobTitle}
                        onChange={(e) => handleArrayChange(e, i, 'workExperience')}
                        placeholder="e.g. Software Engineer" />
                    </div>
                    <div className="col-half">
                      <label>Company</label>
                      <input type="text" name="company" value={exp.company}
                        onChange={(e) => handleArrayChange(e, i, 'workExperience')}
                        placeholder="e.g. WSO2" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input type="text" name="duration" value={exp.duration}
                      onChange={(e) => handleArrayChange(e, i, 'workExperience')}
                      placeholder="e.g. Jan 2023 – Present" />
                  </div>
                  <div className="form-group">
                    <label>Key Responsibilities / Achievements</label>
                    <textarea name="responsibilities" value={exp.responsibilities}
                      onChange={(e) => handleArrayChange(e, i, 'workExperience')}
                      rows="2" placeholder="Describe your key contributions…" />
                  </div>
                </>
              ) : (
                <>
                  {viewRow([
                    { label: 'Job Title', value: exp.jobTitle },
                    { label: 'Company',   value: exp.company  },
                    { label: 'Duration',  value: exp.duration },
                  ])}
                  {exp.responsibilities && (
                    <div className="view-field" style={{ marginTop: 8 }}>
                      <span className="view-label">Responsibilities</span>
                      <span className="view-value">{exp.responsibilities}</span>
                    </div>
                  )}
                </>
              )}
            </ArrayItemCard>
          ))}
        </div>

        {/* ── 6. Projects ──────────────────────────────────── */}
        <div className="profile-section">
          <div className="section-header-flex">
            <h3>6. Projects</h3>
            <button type="button" className="btn-add"
              onClick={() => addArrayItem('projects', EMPTY_PROJECT)}>
              + Add Project
            </button>
          </div>
          {profile.projects.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
              No projects yet. Click "+ Add Project" to showcase your work.
            </p>
          )}
          {profile.projects.map((proj, i) => (
            <ArrayItemCard key={i} index={i} arrayName="projects" label="Project"
              isEditing={isCardEditing('projects', i)}
              onToggleEdit={() => toggleEditCard('projects', i)}
              onDelete={requestDelete}
            >
              {isCardEditing('projects', i) ? (
                <>
                  <div className="form-group row" style={{ marginTop: 10 }}>
                    <div className="col-half">
                      <label>Project Name</label>
                      <input type="text" name="projectName" value={proj.projectName}
                        onChange={(e) => handleArrayChange(e, i, 'projects')}
                        placeholder="e.g. Job Portal App" />
                    </div>
                    <div className="col-half">
                      <label>Technologies Used</label>
                      <input type="text" name="technologies" value={proj.technologies}
                        onChange={(e) => handleArrayChange(e, i, 'projects')}
                        placeholder="e.g. React, Node.js, MongoDB" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Short Description</label>
                    <textarea name="description" value={proj.description}
                      onChange={(e) => handleArrayChange(e, i, 'projects')}
                      rows="2" placeholder="Brief description of what the project does…" />
                  </div>
                </>
              ) : (
                <>
                  {viewRow([
                    { label: 'Project',      value: proj.projectName },
                    { label: 'Technologies', value: proj.technologies },
                  ])}
                  {proj.description && (
                    <div className="view-field" style={{ marginTop: 8 }}>
                      <span className="view-label">Description</span>
                      <span className="view-value">{proj.description}</span>
                    </div>
                  )}
                </>
              )}
            </ArrayItemCard>
          ))}
        </div>

        {/* ── 7. Additional Information ─────────────────────── */}
        <div className="profile-section">
          <h3>7. Additional Information</h3>
          <div className="form-group row">
            <div className="col-half">
              <label>Certifications (comma separated)</label>
              <input type="text" name="certifications" value={profile.certifications} onChange={handleChange}
                placeholder="e.g. AWS Cloud Practitioner, Scrum Master" />
            </div>
            <div className="col-half">
              <label>Achievements / Activities (comma separated)</label>
              <input type="text" name="achievements" value={profile.achievements} onChange={handleChange}
                placeholder="e.g. Hackathon Winner, Club President" />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-half">
              <label>Languages (comma separated)</label>
              <input type="text" name="languages" value={profile.languages} onChange={handleChange}
                placeholder="e.g. English (Native), Sinhala" />
            </div>
            <div className="col-half">
              <label>References</label>
              <input type="text" name="references" value={profile.references} onChange={handleChange}
                placeholder="e.g. Available upon request" />
            </div>
          </div>
        </div>

        {/* ── Save ─────────────────────────────────────────── */}
        <div className="form-actions sticky-actions">
          <button type="submit" className="btn-save" disabled={saving}>
            {saving
              ? 'Saving…'
              : hasUnsavedChanges
                ? '💾 Save All Profile Changes'
                : '✓ All Changes Saved'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default StudentProfile;