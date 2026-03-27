import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('profileId');
    if (!id) setShowError(true);
    setProfileId(id);
  }, []);

  const selectTemplate = (id) => {
    setSelectedTemplate(id);
  };

  const onPreview = () => {
    if (!profileId || !selectedTemplate) return;
    localStorage.setItem('selectedTemplate', selectedTemplate);
    navigate('/cv-preview');
  };

  const onDownload = () => {
    if (!profileId || !selectedTemplate) return;
    localStorage.setItem('selectedTemplate', selectedTemplate);
    navigate('/cv-preview');
  };

  return (
    <div className="resume-templates-container">
      <div className="page-header">
        <h2>Resume Templates</h2>
        <p>Choose one template and preview/download your resume</p>
      </div>

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
        <button className="btn btn-primary" disabled={!selectedTemplate || !profileId} onClick={onPreview}>
          Preview Resume
        </button>
        <button className="btn btn-success" disabled={!selectedTemplate || !profileId} onClick={onDownload}>
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default ResumeTemplates;
