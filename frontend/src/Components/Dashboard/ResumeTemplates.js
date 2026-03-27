import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { environment } from '../../environments/environment';
import './ResumeTemplates.css';

const templates = [
  { id: 'classic', name: 'Classic', description: 'Traditional clean layout', previewBg: '#f8fafc', accentColor: '#1e293b' },
  { id: 'modern', name: 'Modern', description: 'Sidebar with skill bars', previewBg: '#eff6ff', accentColor: '#1e3a5f' },
  { id: 'minimal', name: 'Minimal', description: 'Whitespace-focused readability', previewBg: '#f0fdf4', accentColor: '#10b981' },
  { id: 'professional', name: 'Professional', description: 'Dark accent header style', previewBg: '#faf5ff', accentColor: '#7c3aed' },
];

function ResumeTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [profileId, setProfileId] = useState(null);
  const [showError, setShowError] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('profileId');
    let id = storedId;
    if (!id) {
      const user = JSON.parse(localStorage.getItem('user'));
      id = user?.id || null;
      if (id) {
        localStorage.setItem('profileId', id);
      }
    }

    if (!id) {
      setShowError(true);
      setInfoMessage('No profile found yet; create your profile first to populate resume data.');
    } else {
      setShowError(false);
      setInfoMessage('Profile found. Choose a template and click Preview or Download.');
    }

    setProfileId(id);
  }, []);

  const selectTemplate = (id) => {
    setSelectedTemplate(id);
  };

  const getEffectiveProfileId = () => {
    return (
      profileId ||
      localStorage.getItem('profileId') ||
      JSON.parse(localStorage.getItem('user'))?.id ||
      null
    );
  };

  const onPreview = () => {
    const effectiveProfileId = getEffectiveProfileId();
    if (!selectedTemplate) return;
    localStorage.setItem('selectedTemplate', selectedTemplate);
    if (!effectiveProfileId) {
      setShowError(true);
      setInfoMessage('No profile found yet. Please complete your profile first to preview or download.');
      return;
    }
    setShowError(false);
    navigate('/cv-preview');
  };

  const onDownload = async () => {
    const effectiveProfileId = getEffectiveProfileId();
    if (!selectedTemplate) return;
    if (!effectiveProfileId) {
      setShowError(true);
      setInfoMessage('No profile found yet. Please complete your profile first to preview or download.');
      return;
    }

    setShowError(false);
    const apiUrl = environment.apiUrl;

    try {
      const res = await fetch(`${apiUrl}/users/profile/${effectiveProfileId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');

      const user = JSON.parse(localStorage.getItem('user'));
      const profile = {
        fullName: data.fullName || user.name || 'Your Name',
        email: data.email || user.email || 'email@example.com',
        phoneNumber: data.phoneNumber || '',
        location: data.location || '',
        linkedin: data.linkedin || '',
        summary: data.summary || '',
        technicalSkills: data.technicalSkills || [],
        softSkills: data.softSkills || [],
        education: data.education || [],
        workExperience: data.workExperience || [],
        projects: data.projects || [],
        certifications: data.certifications || [],
        achievements: data.achievements || [],
        references: data.references || ''
      };

      const cvHTML = generateCVHTML(profile, selectedTemplate);
      const element = document.createElement('div');
      element.innerHTML = cvHTML;
      element.id = 'cv-temp-document';
      document.body.appendChild(element);

      const opt = {
        margin: 10,
        filename: `${profile.fullName || 'resume'}-${selectedTemplate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };

      html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(element);
      });
    } catch (err) {
      setInfoMessage('Error downloading PDF: ' + (err.message || 'Unknown error'));
    }
  };

  const generateCVHTML = (profile, template) => {
    return `
      <div class="cv-document cv-template-${template}" style="padding: 30px; font-family: Arial, sans-serif; line-height: 1.4;">
        <header style="text-align: center; border-bottom: 2px solid #222; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="font-size: 2rem; margin: 0; text-transform: uppercase; letter-spacing: 1px;">${profile.fullName}</h1>
          <div style="font-size: 0.95rem; color: #333;">
            ${profile.email}${profile.phoneNumber ? ' • ' + profile.phoneNumber : ''}${profile.location ? ' • ' + profile.location : ''}${profile.linkedin ? ' • ' + profile.linkedin : ''}
          </div>
        </header>

        ${profile.summary ? `
          <section style="margin-bottom: 15px;">
            <h3 style="font-size: 1.1rem; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 8px;">Professional Summary</h3>
            <p style="margin: 0; font-size: 1rem; color: #333;">${profile.summary}</p>
          </section>
        ` : ''}

        ${profile.workExperience && profile.workExperience.length > 0 ? `
          <section style="margin-bottom: 15px;">
            <h3 style="font-size: 1.1rem; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 8px;">Work Experience</h3>
            ${profile.workExperience.map(exp => `
              <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: bold;">${exp.jobTitle}</span>
                  <span style="font-style: italic; color: #555;">${exp.duration}</span>
                </div>
                <div style="font-weight: 600; color: #444;">${exp.company}</div>
                <p style="margin: 5px 0; font-size: 0.95rem; color: #333;">${exp.responsibilities}</p>
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${profile.education && profile.education.length > 0 ? `
          <section style="margin-bottom: 15px;">
            <h3 style="font-size: 1.1rem; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 8px;">Education</h3>
            ${profile.education.map(edu => `
              <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: bold;">${edu.degree}</span>
                  <span style="font-style: italic; color: #555;">${edu.year}</span>
                </div>
                <div style="font-weight: 600; color: #444;">${edu.institution}</div>
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${profile.projects && profile.projects.length > 0 ? `
          <section style="margin-bottom: 15px;">
            <h3 style="font-size: 1.1rem; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 8px;">Projects</h3>
            ${profile.projects.map(proj => `
              <div style="margin-bottom: 10px;">
                <span style="font-weight: bold;">${proj.projectName}</span>
                <p style="margin: 5px 0; font-size: 0.95rem; color: #333;">${proj.description}</p>
              </div>
            `).join('')}
          </section>
        ` : ''}

        ${(profile.technicalSkills?.length > 0 || profile.softSkills?.length > 0) ? `
          <section style="margin-bottom: 15px;">
            <h3 style="font-size: 1.1rem; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 8px;">Skills</h3>
            ${profile.technicalSkills?.length > 0 ? `<div style="margin-bottom: 5px;"><strong>Technical:</strong> ${profile.technicalSkills.join(', ')}</div>` : ''}
            ${profile.softSkills?.length > 0 ? `<div style="margin-bottom: 5px;"><strong>Interpersonal:</strong> ${profile.softSkills.join(', ')}</div>` : ''}
          </section>
        ` : ''}

        ${profile.certifications?.length > 0 || profile.achievements?.length > 0 ? `
          <section style="margin-bottom: 15px;">
            <h3 style="font-size: 1.1rem; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 8px;">Additional Info</h3>
            ${profile.certifications?.length > 0 ? `<div style="margin-bottom: 5px;"><strong>Certifications:</strong> ${profile.certifications.join(', ')}</div>` : ''}
            ${profile.achievements?.length > 0 ? `<div style="margin-bottom: 5px;"><strong>Achievements:</strong> ${profile.achievements.join(', ')}</div>` : ''}
          </section>
        ` : ''}
      </div>
    `;
  };

  return (
    <div className="resume-templates-container">
      <div className="page-header">
        <h2>Resume Templates</h2>
        <p>Select a template to generate your resume</p>
      </div>
      {infoMessage && <div className="alert alert-info" style={{ marginBottom: '1rem' }}>{infoMessage}</div>}

      {showError && (
        <div className="alert alert-danger">
          Please create your profile first. Go to <strong>My Profile</strong>.
        </div>
      )}

      <div className="templates-grid">
        {templates.map((t) => (
          <div
            key={t.id}
            className={`template-card ${selectedTemplate === t.id ? 'selected' : ''}`}
            onClick={() => selectTemplate(t.id)}
          >
            <div className="template-preview" style={{ background: t.previewBg }}>
              <div className="template-mock">
                <div className="mock-header" style={{ background: t.accentColor }} />
                <div className="mock-line" />
                <div className="mock-line" />
                <div className="mock-section" style={{ borderColor: t.accentColor }} />
                <div className="mock-line" />
              </div>
            </div>
            <div className="template-info">
              <h3>{t.name}</h3>
              <p>{t.description}</p>
            </div>
            {selectedTemplate === t.id && <div className="template-check">✓</div>}
          </div>
        ))}
      </div>

      <div className="template-actions">
        <button className="btn btn-primary" disabled={!selectedTemplate} onClick={onPreview}>
          <span style={{ marginRight: '0.4rem' }}>👁️</span> Preview Resume
        </button>
        <button className="btn btn-success" disabled={!selectedTemplate} onClick={onDownload}>
          <span style={{ marginRight: '0.4rem' }}>⬇️</span> Direct Download PDF
        </button>
      </div>
    </div>
  );
}

export default ResumeTemplates;
