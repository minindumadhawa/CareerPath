import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import './CVPreview.css';

function CVPreview({ studentId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState('classic');

  const user = JSON.parse(localStorage.getItem('user'));
  const fetchId = studentId || (user ? user.id : null);

  useEffect(() => {
    const selectedTemp = localStorage.getItem('selectedTemplate') || 'classic';
    setTemplate(selectedTemp);
    if (fetchId) {
      fetchProfile(fetchId);
    } else {
      setLoading(false);
      setError('User ID not found or not logged in.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchId]);

  const fetchProfile = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/profile/${id}`);
      const data = await res.json();
      if (res.ok) {
        setProfile({
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
        });
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = () => {
    const element = document.getElementById('cv-document');
    if (!element) return;
    
    const opt = {
      margin: 10,
      filename: `${profile.fullName || 'resume'}-${template}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  if (loading) return <div className="cv-loading">Loading resume data...</div>;
  if (error) return <div className="cv-error">{error}</div>;
  if (!profile) return <div className="cv-error">No profile data found.</div>;

  return (
    <div className="cv-wrapper">
      <div className="cv-actions no-print">
        <h2>Resume Preview - {template.charAt(0).toUpperCase() + template.slice(1)}</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={downloadPDF} className="btn-print" style={{ backgroundColor: '#10b981' }}>
            <span className="icon">⬇️</span> Download PDF
          </button>
          <button onClick={handlePrint} className="btn-print">
            <span className="icon">🖨️</span> Print
          </button>
        </div>
      </div>

      {/* Wrapping container for the print view */}
      <div className="cv-print-container" id="cv-document">
        <div className={`cv-document cv-template-${template}`}>
          {/* Header */}
          <header className="cv-header">
            <h1 className="cv-name">{profile.fullName}</h1>
            <div className="cv-contact-info">
              {profile.email && <span>{profile.email}</span>}
              {profile.phoneNumber && <span> • {profile.phoneNumber}</span>}
              {profile.location && <span> • {profile.location}</span>}
              {profile.linkedin && <span> • {profile.linkedin}</span>}
            </div>
          </header>

          {/* Summary */}
          {profile.summary && (
            <section className="cv-section">
              <h3 className="cv-section-title">Professional Summary</h3>
              <p className="cv-summary-text">{profile.summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {profile.workExperience && profile.workExperience.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-section-title">Work Experience</h3>
              <div className="cv-list">
                {profile.workExperience.map((exp, index) => (
                  <div key={index} className="cv-item">
                    <div className="cv-item-header">
                      <span className="cv-item-title">{exp.jobTitle}</span>
                      <span className="cv-item-date">{exp.duration}</span>
                    </div>
                    <div className="cv-item-subtitle">{exp.company}</div>
                    <p className="cv-item-desc">{exp.responsibilities}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-section-title">Education</h3>
              <div className="cv-list">
                {profile.education.map((edu, index) => (
                  <div key={index} className="cv-item">
                    <div className="cv-item-header">
                      <span className="cv-item-title">{edu.degree}</span>
                      <span className="cv-item-date">{edu.year}</span>
                    </div>
                    <div className="cv-item-subtitle">{edu.institution}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-section-title">Projects</h3>
              <div className="cv-list">
                {profile.projects.map((proj, index) => (
                  <div key={index} className="cv-item">
                    <div className="cv-item-header">
                      <span className="cv-item-title">{proj.projectName}</span>
                      {proj.technologies && <span className="cv-item-tech">{proj.technologies}</span>}
                    </div>
                    <p className="cv-item-desc">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {(profile.technicalSkills.length > 0 || profile.softSkills.length > 0) && (
            <section className="cv-section">
              <h3 className="cv-section-title">Skills</h3>
              <div className="cv-skills">
                {profile.technicalSkills.length > 0 && (
                  <div className="cv-skill-group">
                    <strong>Technical:</strong> {profile.technicalSkills.join(', ')}
                  </div>
                )}
                {profile.softSkills.length > 0 && (
                  <div className="cv-skill-group">
                    <strong>Interpersonal:</strong> {profile.softSkills.join(', ')}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Certifications and Achievements */}
          {(profile.certifications?.length > 0 || profile.achievements?.length > 0) && (
            <section className="cv-section">
              <h3 className="cv-section-title">Additional Info</h3>
              {profile.certifications?.length > 0 && (
                <div className="cv-additional">
                  <strong>Certifications:</strong> {profile.certifications.join(', ')}
                </div>
              )}
              {profile.achievements?.length > 0 && (
                <div className="cv-additional">
                  <strong>Achievements:</strong> {profile.achievements.join(', ')}
                </div>
              )}
            </section>
          )}

          {/* References */}
          {profile.references && profile.references.trim() !== '' && (
            <section className="cv-section">
                <h3 className="cv-section-title">References</h3>
                <p className="cv-references-text">{profile.references}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default CVPreview;
