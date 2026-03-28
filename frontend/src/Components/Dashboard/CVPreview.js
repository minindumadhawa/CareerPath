// CVPreview.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { environment } from '../../environments/environment';
import './CVPreview.css';

function CVPreview({ studentId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState('corporate');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const previewRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const fetchId = studentId || (user ? user.id : null);
  const apiUrl = environment.apiUrl;

  // Color options for the template
  const colorOptions = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec489a' },
    { name: 'Teal', value: '#06b6d4' },
    { name: 'Indigo', value: '#6366f1' }
  ];

  // Template definitions
  const templates = [
    { id: 'corporate', name: 'Corporate Professional', icon: '💼', desc: 'Classic universally accepted CV' },
    { id: 'modern', name: 'Modern Tech CV', icon: '⚡', desc: 'Tech-focused clean layout with skills segments' },
    { id: 'ats', name: 'ATS-Friendly Minimal', icon: '📝', desc: 'Clean text-focused resume for scanners' },
    { id: 'premium', name: 'Premium Enterprise', icon: '👑', desc: 'High-end corporate CV for top companies' }
  ];

  useEffect(() => {
    const savedTemplate = localStorage.getItem('selectedTemplate') || 'corporate';
    const savedColor = localStorage.getItem('selectedColor') || '#3b82f6';
    setTemplate(savedTemplate);
    setPrimaryColor(savedColor);
    
    if (fetchId) {
      fetchProfile(fetchId);
    } else {
      setLoading(false);
      setError('User ID not found or not logged in.');
    }
  }, [fetchId]);

  const fetchProfile = useCallback(async (id) => {
    try {
      const res = await fetch(`${apiUrl}/profile/${id}`);
      const data = await res.json();
      if (res.ok) {
        setProfile({
          fullName: data.fullName || user?.name || 'Your Name',
          email: data.email || user?.email || 'email@example.com',
          phoneNumber: data.phoneNumber || '',
          location: data.location || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          summary: data.summary || '',
          technicalSkills: data.technicalSkills || [],
          softSkills: data.softSkills || [],
          education: data.education || [],
          workExperience: data.workExperience || [],
          projects: data.projects || [],
          certifications: data.certifications || [],
          achievements: data.achievements || [],
          references: data.references || '',
          languages: data.languages || ['English (Native)']
        });
      } else {
        setError(data.message || 'Failed to fetch profile');
        // Load demo data for testing
        loadDemoData();
      }
    } catch (error) {
      setError('Network error - Loading demo data');
      // Load demo data for testing when API fails
      loadDemoData();
    } finally {
      setLoading(false);
    }
  }, [apiUrl, user]);

  // Demo data for testing
  const loadDemoData = () => {
    setProfile({
      fullName: "Michael Anderson",
      email: "michael.anderson@email.com",
      phoneNumber: "+1 (555) 234-5678",
      location: "Austin, Texas",
      linkedin: "linkedin.com/in/michaelanderson",
      github: "github.com/michaelanderson",
      summary: "Results-driven Full Stack Developer with 8+ years of experience in building scalable web applications. Expertise in React, Node.js, and cloud technologies. Proven track record of leading development teams and delivering high-quality software solutions that improve business efficiency by 40%.",
      technicalSkills: ["JavaScript/TypeScript", "React.js", "Node.js", "Python", "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "GraphQL"],
      softSkills: ["Team Leadership", "Agile Methodologies", "Problem Solving", "Communication", "Project Management"],
      education: [
        { degree: "Master of Science in Computer Science", institution: "University of Texas at Austin", year: "2015 - 2017", location: "Austin, TX", gpa: "3.8/4.0" },
        { degree: "Bachelor of Engineering in Software Engineering", institution: "Texas A&M University", year: "2011 - 2015", location: "College Station, TX", gpa: "3.6/4.0" }
      ],
      workExperience: [
        { 
          jobTitle: "Senior Full Stack Developer", 
          company: "Tech Innovations Inc.", 
          duration: "2021 — Present", 
          location: "Austin, TX",
          responsibilities: "Lead a team of 6 developers in building enterprise-level React applications. Architected microservices using Node.js and Docker, improving scalability by 50%. Implemented CI/CD pipelines reducing deployment time by 70%."
        },
        { 
          jobTitle: "Software Engineer", 
          company: "Digital Solutions LLC", 
          duration: "2017 — 2021", 
          location: "Dallas, TX",
          responsibilities: "Developed and maintained 15+ full-stack applications using React and Node.js. Optimized database queries resulting in 40% faster response times. Collaborated with product managers to define technical requirements."
        }
      ],
      projects: [
        { projectName: "E-Commerce Platform", technologies: "React, Node.js, MongoDB, Stripe", description: "Built a full-featured e-commerce platform handling 10,000+ monthly transactions" },
        { projectName: "Task Management System", technologies: "Vue.js, Express, PostgreSQL", description: "Developed a project management tool used by 500+ teams" }
      ],
      certifications: ["AWS Certified Solutions Architect", "MongoDB Certified Developer", "Scrum Master Certification"],
      achievements: ["Best Developer Award 2023", "Hackathon Winner 2022"],
      languages: ["English (Native)", "Spanish (Professional)"],
      references: "Available upon request. Professional references from previous employers can be provided."
    });
  };

  const handleTemplateChange = (templateId) => {
    setTemplate(templateId);
    localStorage.setItem('selectedTemplate', templateId);
  };

  const handleColorChange = (color) => {
    setPrimaryColor(color);
    localStorage.setItem('selectedColor', color);
    setShowColorPicker(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = async () => {
    if (!profile) return;
    
    const element = document.getElementById('cv-document');
    if (!element) return;
    
    try {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${profile.fullName.replace(/\s/g, '_')}_${template}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  // Render Corporate Template
  const renderCorporateTemplate = () => (
    <div className="cv-template-corporate" style={{ '--primary-color': primaryColor }}>
      <div className="cv-header">
        <h1 className="cv-name">{profile.fullName}</h1>
        <div className="cv-title">{profile.workExperience?.[0]?.jobTitle || 'Professional'}</div>
        <div className="cv-contact-info">
          {profile.email && <span>📧 {profile.email}</span>}
          {profile.phoneNumber && <span>📞 {profile.phoneNumber}</span>}
          {profile.location && <span>📍 {profile.location}</span>}
          {profile.linkedin && <span>🔗 {profile.linkedin}</span>}
        </div>
      </div>

      {profile.summary && (
        <section className="cv-section">
          <h3 className="cv-section-title">Professional Summary</h3>
          <p className="cv-summary-text">{profile.summary}</p>
        </section>
      )}

      {profile.workExperience?.length > 0 && (
        <section className="cv-section">
          <h3 className="cv-section-title">Work Experience</h3>
          {profile.workExperience.map((exp, index) => (
            <div key={index} className="cv-item">
              <div className="cv-item-header">
                <span className="cv-item-title">{exp.jobTitle}</span>
                <span className="cv-item-date">{exp.duration}</span>
              </div>
              <div className="cv-item-subtitle">{exp.company} {exp.location && `| ${exp.location}`}</div>
              <p className="cv-item-desc">{exp.responsibilities}</p>
            </div>
          ))}
        </section>
      )}

      {profile.education?.length > 0 && (
        <section className="cv-section">
          <h3 className="cv-section-title">Education</h3>
          {profile.education.map((edu, index) => (
            <div key={index} className="cv-item">
              <div className="cv-item-header">
                <span className="cv-item-title">{edu.degree}</span>
                <span className="cv-item-date">{edu.year}</span>
              </div>
              <div className="cv-item-subtitle">{edu.institution}</div>
              {edu.gpa && <div className="cv-item-desc">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </section>
      )}

      {profile.technicalSkills?.length > 0 && (
        <section className="cv-section">
          <h3 className="cv-section-title">Technical Skills</h3>
          <div className="cv-skills">
            {profile.technicalSkills.map((skill, index) => (
              <span key={index} className="skill-tag" style={{ background: primaryColor }}>{skill}</span>
            ))}
          </div>
        </section>
      )}

      {profile.certifications?.length > 0 && (
        <section className="cv-section">
          <h3 className="cv-section-title">Certifications</h3>
          <div className="cv-skills">
            {profile.certifications.map((cert, index) => (
              <span key={index} className="skill-tag" style={{ background: primaryColor }}>{cert}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Render Modern Template
  const renderModernTemplate = () => (
    <div className="cv-template-modern" style={{ '--primary-color': primaryColor }}>
      <div className="cv-sidebar">
        <div className="cv-name-sidebar">{profile.fullName}</div>
        <div className="cv-title-sidebar">{profile.workExperience?.[0]?.jobTitle || 'Professional'}</div>
        <hr />
        <div className="cv-contact-sidebar">
          {profile.email && <div><strong>📧 Email</strong><br />{profile.email}</div>}
          {profile.phoneNumber && <div><strong>📞 Phone</strong><br />{profile.phoneNumber}</div>}
          {profile.location && <div><strong>📍 Location</strong><br />{profile.location}</div>}
          {profile.linkedin && <div><strong>🔗 LinkedIn</strong><br />{profile.linkedin}</div>}
        </div>
        {profile.technicalSkills?.length > 0 && (
          <div className="cv-skills-sidebar">
            <strong>⚡ Skills</strong>
            <div className="cv-skills-list">
              {profile.technicalSkills.slice(0, 6).map((skill, index) => (
                <span key={index} className="skill-tag-sidebar">{skill}</span>
              ))}
            </div>
          </div>
        )}
        {profile.languages?.length > 0 && (
          <div className="cv-languages-sidebar">
            <strong>🌐 Languages</strong>
            {profile.languages.map((lang, index) => (
              <div key={index}>• {lang}</div>
            ))}
          </div>
        )}
      </div>
      <div className="cv-main">
        {profile.summary && (
          <section>
            <h3 className="cv-section-title-modern">Profile</h3>
            <p>{profile.summary}</p>
          </section>
        )}
        {profile.workExperience?.length > 0 && (
          <section>
            <h3 className="cv-section-title-modern">Experience</h3>
            {profile.workExperience.map((exp, index) => (
              <div key={index} className="cv-item-modern">
                <div className="cv-item-header-modern">
                  <span className="cv-item-title">{exp.jobTitle}</span>
                  <span className="cv-item-date">{exp.duration}</span>
                </div>
                <div className="cv-item-subtitle">{exp.company}</div>
                <p className="cv-item-desc">{exp.responsibilities}</p>
              </div>
            ))}
          </section>
        )}
        {profile.education?.length > 0 && (
          <section>
            <h3 className="cv-section-title-modern">Education</h3>
            {profile.education.map((edu, index) => (
              <div key={index} className="cv-item-modern">
                <div className="cv-item-title">{edu.degree}</div>
                <div className="cv-item-subtitle">{edu.institution}</div>
                <div className="cv-item-date">{edu.year}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );

  // Render ATS Friendly Template
  const renderATSTemplate = () => (
    <div className="cv-template-ats">
      <div className="cv-header-ats">
        <h1>{profile.fullName}</h1>
        <p>{profile.workExperience?.[0]?.jobTitle || 'Professional'}</p>
        <div className="cv-contact-ats">
          {profile.email} | {profile.phoneNumber} | {profile.location}
        </div>
      </div>

      {profile.summary && (
        <div className="cv-section-ats">
          <h3>SUMMARY</h3>
          <p>{profile.summary}</p>
        </div>
      )}

      {profile.workExperience?.length > 0 && (
        <div className="cv-section-ats">
          <h3>WORK EXPERIENCE</h3>
          {profile.workExperience.map((exp, index) => (
            <div key={index} className="cv-item-ats">
              <strong>{exp.jobTitle}</strong> | {exp.company}<br />
              <em>{exp.duration}</em>
              <p>{exp.responsibilities}</p>
            </div>
          ))}
        </div>
      )}

      {profile.education?.length > 0 && (
        <div className="cv-section-ats">
          <h3>EDUCATION</h3>
          {profile.education.map((edu, index) => (
            <div key={index}>
              <strong>{edu.degree}</strong><br />
              {edu.institution}, {edu.year}
            </div>
          ))}
        </div>
      )}

      {profile.technicalSkills?.length > 0 && (
        <div className="cv-section-ats">
          <h3>SKILLS</h3>
          <p><strong>Technical:</strong> {profile.technicalSkills.join(', ')}</p>
          {profile.softSkills?.length > 0 && <p><strong>Soft Skills:</strong> {profile.softSkills.join(', ')}</p>}
        </div>
      )}
    </div>
  );

  // Render Premium Template
  const renderPremiumTemplate = () => (
    <div className="cv-template-premium" style={{ '--primary-color': primaryColor }}>
      <div className="cv-premium-header">
        <h1>{profile.fullName}</h1>
        <p>{profile.workExperience?.[0]?.jobTitle || 'Professional'}</p>
        <div className="cv-premium-contact">
          {profile.email} • {profile.phoneNumber} • {profile.location}
        </div>
      </div>

      {profile.summary && (
        <div className="cv-premium-section">
          <h3 style={{ color: primaryColor }}>Executive Summary</h3>
          <p>{profile.summary}</p>
        </div>
      )}

      {profile.workExperience?.length > 0 && (
        <div className="cv-premium-section">
          <h3 style={{ color: primaryColor }}>Professional Experience</h3>
          {profile.workExperience.map((exp, index) => (
            <div key={index} className="cv-premium-item">
              <div className="cv-premium-item-header">
                <strong>{exp.jobTitle}</strong>
                <span>{exp.duration}</span>
              </div>
              <div className="cv-premium-company">{exp.company}</div>
              <p>{exp.responsibilities}</p>
            </div>
          ))}
        </div>
      )}

      {profile.education?.length > 0 && (
        <div className="cv-premium-section">
          <h3 style={{ color: primaryColor }}>Education</h3>
          {profile.education.map((edu, index) => (
            <div key={index} className="cv-premium-item">
              <strong>{edu.degree}</strong>
              <div>{edu.institution}</div>
              <div className="cv-premium-date">{edu.year}</div>
            </div>
          ))}
        </div>
      )}

      {profile.technicalSkills?.length > 0 && (
        <div className="cv-premium-section">
          <h3 style={{ color: primaryColor }}>Core Competencies</h3>
          <div className="cv-premium-skills">
            {profile.technicalSkills.map((skill, index) => (
              <span key={index} className="premium-skill-tag" style={{ background: primaryColor }}>{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCurrentTemplate = () => {
    switch(template) {
      case 'modern':
        return renderModernTemplate();
      case 'ats':
        return renderATSTemplate();
      case 'premium':
        return renderPremiumTemplate();
      default:
        return renderCorporateTemplate();
    }
  };

  if (loading) {
    return (
      <div className="cv-wrapper">
        <div className="cv-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading resume data...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="cv-wrapper">
        <div className="cv-error">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="cv-wrapper">
        <div className="cv-error">
          <p>No profile data found. Please complete your profile first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-wrapper">
      {/* Template Selector Bar */}
      <div className="cv-template-bar no-print">
        <div className="cv-template-selector">
          {templates.map((temp) => (
            <button
              key={temp.id}
              className={`cv-template-btn ${template === temp.id ? 'active' : ''}`}
              onClick={() => handleTemplateChange(temp.id)}
            >
              <span className="template-icon">{temp.icon}</span>
              <div className="template-info">
                <div className="template-name">{temp.name}</div>
                <div className="template-desc">{temp.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Color Picker */}
        <div className="cv-color-picker">
          <button 
            className="color-trigger"
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{ backgroundColor: primaryColor }}
          >
            <i className="fas fa-palette"></i> Color
          </button>
          {showColorPicker && (
            <div className="color-dropdown">
              {colorOptions.map((color) => (
                <div
                  key={color.value}
                  className={`color-option ${primaryColor === color.value ? 'active' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorChange(color.value)}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="cv-actions">
          <button onClick={downloadPDF} className="btn-download">
            <i className="fas fa-download"></i> Download PDF
          </button>
          <button onClick={handlePrint} className="btn-print">
            <i className="fas fa-print"></i> Print
          </button>
        </div>
      </div>

      {/* CV Document */}
      <div className="cv-print-container" id="cv-document">
        {renderCurrentTemplate()}
      </div>
    </div>
  );
}

export default CVPreview;
