import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { environment } from '../../environments/environment';
import './ResumeTemplates.css';

const templates = [
  { id: 'corporate', name: 'Corporate Professional', description: 'Classic universally accepted CV', previewBg: '#ffffff', accentColor: '#374151' },
  { id: 'modernTech', name: 'Modern Tech CV', description: 'Tech-focused clean layout with skills segments', previewBg: '#f7fbff', accentColor: '#0ea5e9' },
  { id: 'ats', name: 'ATS-Friendly Minimal', description: 'Clean text-focused resume for scanners', previewBg: '#ffffff', accentColor: '#4b5563' },
  { id: 'enterprise', name: 'Premium Enterprise', description: 'High-end corporate CV for top companies', previewBg: '#f3f4f6', accentColor: '#1a2b4c' },
];

function ResumeTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [profileId, setProfileId] = useState(null);
  const [showError, setShowError] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState(null);

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

  const onPreview = async () => {
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
      const res = await fetch(`${apiUrl}/profile/${effectiveProfileId}`);
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

      setPreviewData(profile);
      setPreviewMode(true);
    } catch (err) {
      setInfoMessage('Error loading preview: ' + (err.message || 'Unknown error'));
    }
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
      const res = await fetch(`${apiUrl}/profile/${effectiveProfileId}`);
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

      {previewMode && previewData && (
        <div style={{
          marginTop: '2rem',
          padding: '2rem',
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          border: '1px solid #ddd'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>CV Preview - {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}</h2>
            <button onClick={() => setPreviewMode(false)} style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#999',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Close Preview
            </button>
          </div>
          <div id="cv-document" style={{
            backgroundColor: 'white',
            padding: '30px 40px',
            maxWidth: '900px',
            margin: '0 auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.4'
          }} className={`cv-template-${selectedTemplate}`}>
            {selectedTemplate === 'corporate' && (
              <>
                <header style={{ textAlign: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '15px', marginBottom: '20px' }}>
                  <h1 style={{ fontSize: '2.1rem', margin: '0', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#1f2937', fontWeight: 700 }}>{previewData.fullName}</h1>
                  <div style={{ fontSize: '0.95rem', color: '#4b5563' }}>
                    {previewData.email}{previewData.phoneNumber ? ' • ' + previewData.phoneNumber : ''}{previewData.location ? ' • ' + previewData.location : ''}{previewData.linkedin ? ' • ' + previewData.linkedin : ''}
                  </div>
                </header>

                {previewData.summary && (
                  <section style={{ marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '8px' }}>Professional Summary</h3>
                    <p style={{ margin: '0', fontSize: '1rem', color: '#333' }}>{previewData.summary}</p>
                  </section>
                )}

                {previewData.workExperience && previewData.workExperience.length > 0 && (
                  <section style={{ marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '8px' }}>Work Experience</h3>
                    {previewData.workExperience.map((exp, i) => (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 'bold' }}>{exp.jobTitle}</span>
                          <span style={{ fontStyle: 'italic', color: '#555' }}>{exp.duration}</span>
                        </div>
                        <div style={{ fontWeight: '600', color: '#444' }}>{exp.company}</div>
                        <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#333' }}>{exp.responsibilities}</p>
                      </div>
                    ))}
                  </section>
                )}

                {previewData.education && previewData.education.length > 0 && (
                  <section style={{ marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '8px' }}>Education</h3>
                    {previewData.education.map((edu, i) => (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 'bold' }}>{edu.degree}</span>
                          <span style={{ fontStyle: 'italic', color: '#555' }}>{edu.year}</span>
                        </div>
                        <div style={{ fontWeight: '600', color: '#444' }}>{edu.institution}</div>
                      </div>
                    ))}
                  </section>
                )}

                {previewData.projects && previewData.projects.length > 0 && (
                  <section style={{ marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '8px' }}>Projects</h3>
                    {previewData.projects.map((proj, i) => (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold' }}>{proj.projectName}</span>
                        <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#333' }}>{proj.description}</p>
                      </div>
                    ))}
                  </section>
                )}

                {(previewData.technicalSkills?.length > 0 || previewData.softSkills?.length > 0) && (
                  <section style={{ marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '8px' }}>Skills</h3>
                    {previewData.technicalSkills?.length > 0 && <div style={{ marginBottom: '5px' }}><strong>Technical:</strong> {previewData.technicalSkills.join(', ')}</div>}
                    {previewData.softSkills?.length > 0 && <div style={{ marginBottom: '5px' }}><strong>Interpersonal:</strong> {previewData.softSkills.join(', ')}</div>}
                  </section>
                )}
              </>
            )}

            {selectedTemplate === 'modernTech' && (
              <div style={{ display: 'flex' }}>
                <div style={{ flex: '1', paddingRight: '20px' }}>
                  <header style={{ textAlign: 'center', borderBottom: '3px solid #1e3a5f', paddingBottom: '15px', marginBottom: '20px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                    <h1 style={{ fontSize: '2rem', margin: '0', color: '#1e3a5f' }}>{previewData.fullName}</h1>
                    <div style={{ fontSize: '0.95rem', color: '#333' }}>
                      {previewData.email}{previewData.phoneNumber ? ' • ' + previewData.phoneNumber : ''}{previewData.location ? ' • ' + previewData.location : ''}{previewData.linkedin ? ' • ' + previewData.linkedin : ''}
                    </div>
                  </header>

                  {previewData.summary && (
                    <section style={{ marginBottom: '15px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '8px' }}>Professional Summary</h3>
                      <p style={{ margin: '0', fontSize: '1rem', color: '#333' }}>{previewData.summary}</p>
                    </section>
                  )}

                  {previewData.workExperience && previewData.workExperience.length > 0 && (
                    <section style={{ marginBottom: '15px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '8px' }}>Work Experience</h3>
                      {previewData.workExperience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 'bold' }}>{exp.jobTitle}</span>
                            <span style={{ fontStyle: 'italic', color: '#555' }}>{exp.duration}</span>
                          </div>
                          <div style={{ fontWeight: '600', color: '#444' }}>{exp.company}</div>
                          <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#333' }}>{exp.responsibilities}</p>
                        </div>
                      ))}
                    </section>
                  )}
                </div>

                <div style={{ width: '200px', backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
                  <h4 style={{ marginTop: '0', color: '#1e3a5f' }}>Skills</h4>
                  {previewData.technicalSkills?.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Technical</strong>
                      {previewData.technicalSkills.map((skill, i) => (
                        <div key={i} style={{ margin: '5px 0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span>{skill}</span>
                            <span>●●●●●</span>
                          </div>
                          <div style={{ height: '4px', backgroundColor: '#ddd', borderRadius: '2px' }}>
                            <div style={{ height: '100%', width: '80%', backgroundColor: '#1e3a5f', borderRadius: '2px' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {previewData.softSkills?.length > 0 && (
                    <div>
                      <strong>Soft Skills</strong>
                      <ul style={{ paddingLeft: '15px', margin: '5px 0' }}>
                        {previewData.softSkills.map((skill, i) => (
                          <li key={i} style={{ fontSize: '0.9rem' }}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTemplate === 'ats' && (
              <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', lineHeight: '1.6', color: '#111827', backgroundColor: '#ffffff' }}>
                <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', fontWeight: '300', letterSpacing: '2px' }}>{previewData.fullName}</h1>
                  <div style={{ fontSize: '1rem', color: '#666', letterSpacing: '1px' }}>
                    {previewData.email}{previewData.phoneNumber ? ' • ' + previewData.phoneNumber : ''}{previewData.location ? ' • ' + previewData.location : ''}{previewData.linkedin ? ' • ' + previewData.linkedin : ''}
                  </div>
                </header>

                {previewData.summary && (
                  <section style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '300', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Summary</h3>
                    <p style={{ margin: '0', fontSize: '1rem', lineHeight: '1.7' }}>{previewData.summary}</p>
                  </section>
                )}

                {previewData.workExperience && previewData.workExperience.length > 0 && (
                  <section style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '300', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Experience</h3>
                    {previewData.workExperience.map((exp, i) => (
                      <div key={i} style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontWeight: '500' }}>{exp.jobTitle}</span>
                          <span style={{ fontSize: '0.9rem', color: '#666' }}>{exp.duration}</span>
                        </div>
                        <div style={{ fontSize: '0.95rem', color: '#666', marginBottom: '5px' }}>{exp.company}</div>
                        <p style={{ margin: '0', fontSize: '0.95rem', lineHeight: '1.6' }}>{exp.responsibilities}</p>
                      </div>
                    ))}
                  </section>
                )}

                {previewData.education && previewData.education.length > 0 && (
                  <section style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '300', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Education</h3>
                    {previewData.education.map((edu, i) => (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: '500' }}>{edu.degree}</span>
                          <span style={{ fontSize: '0.9rem', color: '#666' }}>{edu.year}</span>
                        </div>
                        <div style={{ fontSize: '0.95rem', color: '#666' }}>{edu.institution}</div>
                      </div>
                    ))}
                  </section>
                )}

                {previewData.projects && previewData.projects.length > 0 && (
                  <section style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '300', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Projects</h3>
                    {previewData.projects.map((proj, i) => (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        <span style={{ fontWeight: '500' }}>{proj.projectName}</span>
                        <p style={{ margin: '5px 0', fontSize: '0.95rem', lineHeight: '1.6' }}>{proj.description}</p>
                      </div>
                    ))}
                  </section>
                )}

                {(previewData.technicalSkills?.length > 0 || previewData.softSkills?.length > 0) && (
                  <section style={{ marginBottom: '25px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '300', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Skills</h3>
                    {previewData.technicalSkills?.length > 0 && <div style={{ marginBottom: '5px' }}><strong>Technical:</strong> {previewData.technicalSkills.join(', ')}</div>}
                    {previewData.softSkills?.length > 0 && <div style={{ marginBottom: '5px' }}><strong>Interpersonal:</strong> {previewData.softSkills.join(', ')}</div>}
                  </section>
                )}
              </div>
            )}

            {selectedTemplate === 'enterprise' && (
              <div style={{ fontFamily: 'Georgia, serif', color: '#1a2b4c' }}>
                <header style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                  color: 'white',
                  padding: '25px',
                  textAlign: 'center',
                  marginBottom: '25px',
                  borderRadius: '8px'
                }}>
                  <h1 style={{ fontSize: '2.2rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>{previewData.fullName}</h1>
                  <div style={{ fontSize: '1rem', opacity: '0.9' }}>
                    📧 {previewData.email} {previewData.phoneNumber ? ' • 📱 ' + previewData.phoneNumber : ''} {previewData.location ? ' • 📍 ' + previewData.location : ''} {previewData.linkedin ? ' • 💼 ' + previewData.linkedin : ''}
                  </div>
                </header>

                {previewData.summary && (
                  <section style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#7c3aed', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                      📋 Professional Summary
                    </h3>
                    <p style={{ margin: '0', fontSize: '1rem', lineHeight: '1.6' }}>{previewData.summary}</p>
                  </section>
                )}

                {previewData.workExperience && previewData.workExperience.length > 0 && (
                  <section style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#7c3aed', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                      💼 Work Experience
                    </h3>
                    {previewData.workExperience.map((exp, i) => (
                      <div key={i} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{exp.jobTitle}</span>
                          <span style={{ fontStyle: 'italic', color: '#666', fontSize: '0.9rem' }}>{exp.duration}</span>
                        </div>
                        <div style={{ fontWeight: '600', color: '#7c3aed', marginBottom: '5px' }}>{exp.company}</div>
                        <p style={{ margin: '0', fontSize: '0.95rem', lineHeight: '1.6' }}>{exp.responsibilities}</p>
                      </div>
                    ))}
                  </section>
                )}

                {previewData.education && previewData.education.length > 0 && (
                  <section style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#7c3aed', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                      🎓 Education
                    </h3>
                    {previewData.education.map((edu, i) => (
                      <div key={i} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 'bold' }}>{edu.degree}</span>
                          <span style={{ fontStyle: 'italic', color: '#666', fontSize: '0.9rem' }}>{edu.year}</span>
                        </div>
                        <div style={{ fontWeight: '600', color: '#7c3aed' }}>{edu.institution}</div>
                      </div>
                    ))}
                  </section>
                )}

                {previewData.projects && previewData.projects.length > 0 && (
                  <section style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#7c3aed', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                      🚀 Projects
                    </h3>
                    {previewData.projects.map((proj, i) => (
                      <div key={i} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{proj.projectName}</span>
                        <p style={{ margin: '5px 0', fontSize: '0.95rem', lineHeight: '1.6' }}>{proj.description}</p>
                      </div>
                    ))}
                  </section>
                )}

                {(previewData.technicalSkills?.length > 0 || previewData.softSkills?.length > 0) && (
                  <section style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#7c3aed', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                      ⚡ Skills
                    </h3>
                    {previewData.technicalSkills?.length > 0 && <div style={{ marginBottom: '5px', padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}><strong>Technical:</strong> {previewData.technicalSkills.join(', ')}</div>}
                    {previewData.softSkills?.length > 0 && <div style={{ marginBottom: '5px', padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}><strong>Interpersonal:</strong> {previewData.softSkills.join(', ')}</div>}
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeTemplates;
