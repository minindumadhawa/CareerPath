import React, { useState, useEffect, useCallback, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from '../../environments/environment';
import './CVPreview.css';

// ─── Constants ─────────────────────────────────────────────────
const COLOR_OPTIONS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec489a' },
  { name: 'Teal', value: '#06b6d4' },
  { name: 'Indigo', value: '#6366f1' },
];

const TEMPLATES = [
  { id: 'corporate', name: 'Corporate Professional', icon: '💼', desc: 'Classic universally accepted CV' },
  { id: 'modern', name: 'Modern Tech CV', icon: '⚡', desc: 'Tech-focused clean layout with skills segments' },
  { id: 'ats', name: 'ATS-Friendly Minimal', icon: '📝', desc: 'Clean text-focused resume for scanners' },
  { id: 'premium', name: 'Premium Enterprise', icon: '👑', desc: 'High-end corporate CV for top companies' },
];

const FONT_OPTIONS = [
  { id: 'default', name: 'Default (System)', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { id: 'serif', name: 'Libre Baskerville', family: '"Libre Baskerville", Georgia, serif', url: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap' },
  { id: 'garamond', name: 'Cormorant Garamond', family: '"Cormorant Garamond", Georgia, serif', url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap' },
  { id: 'dm-sans', name: 'DM Sans', family: '"DM Sans", sans-serif', url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap' },
  { id: 'plex', name: 'IBM Plex Sans', family: '"IBM Plex Sans", sans-serif', url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap' },
  { id: 'outfit', name: 'Outfit', family: '"Outfit", sans-serif', url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap' },
  { id: 'lora', name: 'Lora', family: '"Lora", Georgia, serif', url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap' },
  { id: 'source-serif', name: 'Source Serif Pro', family: '"Source Serif Pro", Georgia, serif', url: 'https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&display=swap' },
];

const DEMO_PROFILE = {
  fullName: 'Michael Anderson',
  email: 'michael.anderson@email.com',
  phoneNumber: '+1 (555) 234-5678',
  location: 'Austin, Texas',
  linkedin: 'linkedin.com/in/michaelanderson',
  summary: 'Results-driven Full Stack Developer with 8+ years of experience in building scalable web applications. Expertise in React, Node.js, and cloud technologies.',
  technicalSkills: ['JavaScript/TypeScript', 'React.js', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker'],
  softSkills: ['Team Leadership', 'Agile Methodologies', 'Problem Solving', 'Communication'],
  education: [
    { degree: 'Master of Science in Computer Science', institution: 'University of Texas at Austin', year: '2015 - 2017' },
    { degree: 'Bachelor of Engineering in Software Engineering', institution: 'Texas A&M University', year: '2011 - 2015' },
  ],
  workExperience: [
    { jobTitle: 'Senior Full Stack Developer', company: 'Tech Innovations Inc.', duration: '2021 — Present', responsibilities: 'Lead a team of 6 developers. Architected microservices using Node.js and Docker.' },
    { jobTitle: 'Software Engineer', company: 'Digital Solutions LLC', duration: '2017 — 2021', responsibilities: 'Developed 15+ full-stack applications using React and Node.js.' },
  ],
  projects: [
    { projectName: 'E-Commerce Platform', technologies: 'React, Node.js, MongoDB', description: 'Built e-commerce platform handling 10,000+ transactions' },
  ],
  certifications: ['AWS Certified Solutions Architect', 'MongoDB Certified Developer'],
  achievements: ['Best Developer Award 2023'],
  languages: ['English (Native)', 'Spanish (Professional)'],
  references: 'Available upon request.',
};

const DEMO_SOCIAL = {
  github: 'github.com/michaelanderson',
  portfolio: 'michaelanderson.dev',
  twitter: '',
  website: '',
};

// ─── Helpers ───────────────────────────────────────────────────
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || {};
  } catch {
    return {};
  }
};

const ensureArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim()) return val.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

const esc = (str) => (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ─── DOCX Generator ───────────────────────────────────────────
const generateDOCX = (profile, template, primaryColor, socialLinks) => {
  const skillsList = ensureArray(profile.technicalSkills).map(esc).join(', ');
  const softSkillsList = ensureArray(profile.softSkills).map(esc).join(', ');

  const experienceHtml = (profile.workExperience || []).map((exp) => `
    <p><b>${esc(exp.jobTitle)}</b> — ${esc(exp.company)}<br/><i>${esc(exp.duration)}</i></p>
    <p>${esc(exp.responsibilities)}</p>
  `).join('');

  const educationHtml = (profile.education || []).map((edu) => `
    <p><b>${esc(edu.degree)}</b><br/>${esc(edu.institution)} — ${esc(edu.year)}</p>
  `).join('');

  const projectsHtml = (profile.projects || []).map((proj) => `
    <p><b>${esc(proj.projectName)}</b> (${esc(proj.technologies)})<br/>${esc(proj.description)}</p>
  `).join('');

  const certsHtml = ensureArray(profile.certifications).map((c) => `<li>${esc(c)}</li>`).join('');
  const achieveHtml = ensureArray(profile.achievements).map((a) => `<li>${esc(a)}</li>`).join('');
  const langsHtml = ensureArray(profile.languages).map(esc).join(', ');

  const socialHtml = [
    socialLinks.github ? `<p>GitHub: ${esc(socialLinks.github)}</p>` : '',
    socialLinks.portfolio ? `<p>Portfolio: ${esc(socialLinks.portfolio)}</p>` : '',
    socialLinks.twitter ? `<p>Twitter: ${esc(socialLinks.twitter)}</p>` : '',
    socialLinks.website ? `<p>Website: ${esc(socialLinks.website)}</p>` : '',
  ].filter(Boolean).join('');

  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8">
    <style>
      body { font-family: Calibri, sans-serif; font-size: 11pt; color: #222; margin: 40px; }
      h1 { color: ${primaryColor}; font-size: 22pt; margin-bottom: 2px; }
      h2 { color: ${primaryColor}; font-size: 13pt; border-bottom: 2px solid ${primaryColor}; padding-bottom: 4px; margin-top: 18px; }
      .subtitle { color: #555; font-size: 12pt; }
      .contact { color: #666; font-size: 10pt; }
      p { margin: 4px 0; line-height: 1.5; }
      li { margin: 2px 0; }
    </style></head>
    <body>
      <h1>${esc(profile.fullName)}</h1>
      <p class="subtitle">${esc(profile.workExperience?.[0]?.jobTitle || 'Professional')}</p>
      <p class="contact">${[profile.email, profile.phoneNumber, profile.location].filter(Boolean).map(esc).join(' • ')}</p>
      ${profile.linkedin ? `<p class="contact">LinkedIn: ${esc(profile.linkedin)}</p>` : ''}
      ${socialHtml}
      ${profile.summary ? `<h2>Professional Summary</h2><p>${esc(profile.summary)}</p>` : ''}
      ${experienceHtml ? `<h2>Work Experience</h2>${experienceHtml}` : ''}
      ${educationHtml ? `<h2>Education</h2>${educationHtml}` : ''}
      ${skillsList ? `<h2>Technical Skills</h2><p>${skillsList}</p>` : ''}
      ${softSkillsList ? `<h2>Soft Skills</h2><p>${softSkillsList}</p>` : ''}
      ${projectsHtml ? `<h2>Projects</h2>${projectsHtml}` : ''}
      ${certsHtml ? `<h2>Certifications</h2><ul>${certsHtml}</ul>` : ''}
      ${achieveHtml ? `<h2>Achievements</h2><ul>${achieveHtml}</ul>` : ''}
      ${langsHtml ? `<h2>Languages</h2><p>${langsHtml}</p>` : ''}
      ${profile.references ? `<h2>References</h2><p>${esc(profile.references)}</p>` : ''}
    </body></html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(profile.fullName || 'Resume').replace(/\s/g, '_')}_${template}_resume.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ─── Template Thumbnail ────────────────────────────────────────
function TemplateThumbnail({ templateId, primaryColor }) {
  const configs = {
    corporate: { style: 'full-header' },
    modern: { style: 'sidebar' },
    ats: { style: 'minimal-header' },
    premium: { style: 'gradient-header' },
  };
  const cfg = configs[templateId] || configs.corporate;

  if (cfg.style === 'sidebar') {
    return (
      <div className="tmpl-thumb">
        <div className="tmpl-thumb-sidebar" style={{ background: primaryColor }}>
          <div className="tmpl-thumb-line" style={{ width: '70%', background: '#fff', opacity: 0.9 }} />
          <div className="tmpl-thumb-line" style={{ width: '50%', background: '#fff', opacity: 0.5 }} />
          <div className="tmpl-thumb-spacer" />
          <div className="tmpl-thumb-line" style={{ width: '80%', background: '#fff', opacity: 0.4 }} />
          <div className="tmpl-thumb-line" style={{ width: '60%', background: '#fff', opacity: 0.4 }} />
        </div>
        <div className="tmpl-thumb-main">
          <div className="tmpl-thumb-line" style={{ width: '80%', background: primaryColor, opacity: 0.7 }} />
          <div className="tmpl-thumb-line" style={{ width: '95%' }} />
          <div className="tmpl-thumb-line" style={{ width: '70%' }} />
          <div className="tmpl-thumb-spacer" />
          <div className="tmpl-thumb-line" style={{ width: '60%', background: primaryColor, opacity: 0.6 }} />
          <div className="tmpl-thumb-line" style={{ width: '90%' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="tmpl-thumb tmpl-thumb-col">
      <div
        className="tmpl-thumb-header"
        style={{
          background: cfg.style === 'minimal-header' ? '#fff' : cfg.style === 'gradient-header' ? `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` : primaryColor,
          borderBottom: cfg.style === 'minimal-header' ? `2px solid ${primaryColor}` : 'none',
        }}
      >
        <div className="tmpl-thumb-line" style={{ width: '55%', background: cfg.style === 'minimal-header' ? '#333' : '#fff', opacity: 0.9, height: 7 }} />
        <div className="tmpl-thumb-line" style={{ width: '35%', background: cfg.style === 'minimal-header' ? '#666' : '#fff', opacity: 0.5 }} />
      </div>
      <div className="tmpl-thumb-body">
        <div className="tmpl-thumb-line" style={{ width: '70%', background: primaryColor, opacity: 0.6 }} />
        <div className="tmpl-thumb-line" style={{ width: '95%' }} />
        <div className="tmpl-thumb-line" style={{ width: '80%' }} />
        <div className="tmpl-thumb-spacer" />
        <div className="tmpl-thumb-line" style={{ width: '55%', background: primaryColor, opacity: 0.5 }} />
        <div className="tmpl-thumb-line" style={{ width: '90%' }} />
        <div className="tmpl-thumb-line" style={{ width: '65%' }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
function CVPreview({ studentId, readOnly = false }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState('corporate');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [modalAnimateIn, setModalAnimateIn] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [selectedFont, setSelectedFont] = useState('default');
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSocialEditor, setShowSocialEditor] = useState(false);
  const [socialLinks, setSocialLinks] = useState({ github: '', portfolio: '', twitter: '', website: '' });
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const photoInputRef = useRef(null);
  const user = getUser();
  const fetchId = studentId || user?.id || null;
  const apiUrl = environment?.apiUrl || 'http://localhost:5001/api/users';

  // ─── Load Demo Data ───────────────────────────────────────
  const loadDemoData = useCallback(() => {
    setProfile(DEMO_PROFILE);
    setSocialLinks(DEMO_SOCIAL);
  }, []);

  // ─── Normalize profile data from API ──────────────────────
  const normalizeProfile = useCallback((data) => ({
    fullName: data.fullName || user?.name || 'Your Name',
    email: data.email || user?.email || 'email@example.com',
    phoneNumber: data.phoneNumber || '',
    location: data.location || '',
    linkedin: data.linkedin || '',
    summary: data.summary || '',
    technicalSkills: ensureArray(data.technicalSkills),
    softSkills: ensureArray(data.softSkills),
    education: Array.isArray(data.education) ? data.education : [],
    workExperience: Array.isArray(data.workExperience) ? data.workExperience : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    certifications: ensureArray(data.certifications),
    achievements: ensureArray(data.achievements),
    references: data.references || '',
    languages: ensureArray(data.languages),
  }), [user?.name, user?.email]);

  // ─── Fetch Profile ────────────────────────────────────────
  const fetchProfile = useCallback(async (id) => {
    try {
      const res = await fetch(`${apiUrl}/profile/${id}`);
      const data = await res.json();

      if (res.ok) {
        setProfile(normalizeProfile(data));
        // Sync social links from API if available
        if (data.github || data.portfolio) {
          setSocialLinks((prev) => ({
            ...prev,
            github: data.github || prev.github,
            portfolio: data.portfolio || prev.portfolio,
          }));
        }
      } else {
        setError(data.message || 'Failed to fetch profile — loading demo data');
        loadDemoData();
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Network error — loading demo data');
      loadDemoData();
    } finally {
      setLoading(false);
    }
  }, [apiUrl, normalizeProfile, loadDemoData]);

  // ─── Load saved preferences + fetch profile ───────────────
  useEffect(() => {
    try {
      setTemplate(localStorage.getItem('selectedTemplate') || 'corporate');
      setPrimaryColor(localStorage.getItem('selectedColor') || '#3b82f6');
      setSelectedFont(localStorage.getItem('selectedFont') || 'default');
      setProfilePhoto(localStorage.getItem('profilePhoto') || null);
      const savedSocial = JSON.parse(localStorage.getItem('socialLinks') || 'null');
      if (savedSocial) setSocialLinks(savedSocial);
    } catch {
      // Ignore localStorage errors
    }

    if (fetchId) {
      fetchProfile(fetchId);
    } else {
      loadDemoData();
      setLoading(false);
      setError('User not logged in — using demo data.');
    }
  }, [fetchId, fetchProfile, loadDemoData]);

  // ─── Load Google Font ─────────────────────────────────────
  useEffect(() => {
    const font = FONT_OPTIONS.find((f) => f.id === selectedFont);
    if (font?.url) {
      const existing = document.querySelector(`link[data-font-id="${font.id}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = font.url;
        link.dataset.fontId = font.id;
        document.head.appendChild(link);
      }
    }
  }, [selectedFont]);

  // ─── Modal animation ──────────────────────────────────────
  useEffect(() => {
    if (showPreviewModal) {
      requestAnimationFrame(() => setModalAnimateIn(true));
      document.body.style.overflow = 'hidden';
    } else {
      setModalAnimateIn(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showPreviewModal]);

  // ─── Handlers ─────────────────────────────────────────────
  const handleTemplateChange = (templateId) => {
    setTemplate(templateId);
    try { localStorage.setItem('selectedTemplate', templateId); } catch {}
  };

  const handleColorChange = (color) => {
    setPrimaryColor(color);
    try { localStorage.setItem('selectedColor', color); } catch {}
    setShowColorPicker(false);
  };

  const handleFontChange = (fontId) => {
    setSelectedFont(fontId);
    try { localStorage.setItem('selectedFont', fontId); } catch {}
    setShowFontPicker(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setProfilePhoto(dataUrl);
      try { localStorage.setItem('profilePhoto', dataUrl); } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    try { localStorage.removeItem('profilePhoto'); } catch {}
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleSocialChange = (key, value) => {
    const updated = { ...socialLinks, [key]: value };
    setSocialLinks(updated);
    try { localStorage.setItem('socialLinks', JSON.stringify(updated)); } catch {}
  };

  const handleCloseModal = () => {
    setModalAnimateIn(false);
    setTimeout(() => setShowPreviewModal(false), 280);
  };

  const handlePrint = () => window.print();

  const getSelectedFontFamily = () => {
    const font = FONT_OPTIONS.find((f) => f.id === selectedFont);
    return font ? font.family : FONT_OPTIONS[0].family;
  };

  // ─── PDF Download (multi-page) ────────────────────────────
  const downloadPDF = async () => {
    if (!profile || pdfGenerating) return;
    setPdfGenerating(true);

    const element = document.getElementById('cv-document');
    if (!element) {
      setPdfGenerating(false);
      return;
    }

    // Show loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'pdf-loading-overlay';
    overlay.innerHTML = `
      <div class="pdf-loading-content">
        <div class="pdf-spinner"></div>
        <p>Generating PDF... Please wait</p>
      </div>
    `;
    document.body.appendChild(overlay);

    try {
      // Save original styles
      const originalStyles = {
        width: element.style.width,
        maxWidth: element.style.maxWidth,
        margin: element.style.margin,
        padding: element.style.padding,
        boxShadow: element.style.boxShadow,
      };

      // Apply PDF rendering styles
      Object.assign(element.style, {
        width: '794px',
        maxWidth: '794px',
        margin: '0',
        padding: '0',
        boxShadow: 'none',
      });

      await new Promise((r) => setTimeout(r, 200));

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 794,
        windowWidth: 794,
      });

      // Restore original styles
      Object.assign(element.style, originalStyles);

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageCanvasHeight = (pageHeight / imgHeight) * canvas.height;

      let yOffset = 0;
      let pageNum = 0;

      while (yOffset < canvas.height) {
        if (pageNum > 0) pdf.addPage();

        const sliceHeight = Math.min(pageCanvasHeight, canvas.height - yOffset);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, yOffset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

        const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
        const sliceImgHeight = (sliceHeight * imgWidth) / canvas.width;
        pdf.addImage(pageImgData, 'PNG', 0, 0, imgWidth, sliceImgHeight);

        yOffset += pageCanvasHeight;
        pageNum++;
      }

      const fileName = `${(profile.fullName || 'Resume').replace(/\s/g, '_')}_${template}_resume.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
      setPdfGenerating(false);
    }
  };

  const downloadDOCX = () => {
    if (!profile) return;
    generateDOCX(profile, template, primaryColor, socialLinks);
  };

  // ─── Social Links Renderer ────────────────────────────────
  const renderSocialLinks = (style = 'default') => {
    const links = [
      { key: 'linkedin', icon: '🔗', value: profile.linkedin },
      { key: 'github', icon: '💻', value: socialLinks.github },
      { key: 'portfolio', icon: '🌐', value: socialLinks.portfolio },
      { key: 'twitter', icon: '🐦', value: socialLinks.twitter },
      { key: 'website', icon: '🏠', value: socialLinks.website },
    ].filter((l) => l.value);
    if (links.length === 0) return null;
    return (
      <div className={`cv-social-links cv-social-links-${style}`}>
        {links.map((link) => (
          <span key={link.key} className="social-link-item">
            <span className="social-icon">{link.icon}</span>
            <span className="social-text">{link.value}</span>
          </span>
        ))}
      </div>
    );
  };

  // ─── Profile Photo Renderer ───────────────────────────────
  const renderProfilePhoto = (size = 80, borderColor = '#fff') => {
    if (!profilePhoto) return null;
    return (
      <div className="cv-profile-photo-wrapper" style={{ width: size, height: size }}>
        <img src={profilePhoto} alt="Profile" className="cv-profile-photo" style={{ width: size, height: size, border: `3px solid ${borderColor}` }} />
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // TEMPLATE RENDERERS
  // ═══════════════════════════════════════════════════════════════

  const renderCorporateTemplate = () => (
    <div className="cv-template-corporate" style={{ '--primary-color': primaryColor, fontFamily: getSelectedFontFamily() }}>
      <div className="cv-header">
        <div className="cv-header-content">
          {renderProfilePhoto(75, primaryColor)}
          <div className="cv-header-text">
            <h1 className="cv-name">{profile.fullName}</h1>
            <div className="cv-title">{profile.workExperience?.[0]?.jobTitle || 'Professional'}</div>
            <div className="cv-contact-info">
              {profile.email && <span>📧 {profile.email}</span>}
              {profile.phoneNumber && <span>📞 {profile.phoneNumber}</span>}
              {profile.location && <span>📍 {profile.location}</span>}
            </div>
            {renderSocialLinks('header')}
          </div>
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
          {profile.workExperience.map((exp, i) => (
            <div key={i} className="cv-item">
              <div className="cv-item-header">
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
        <section className="cv-section">
          <h3 className="cv-section-title">Education</h3>
          {profile.education.map((edu, i) => (
            <div key={i} className="cv-item">
              <div className="cv-item-header">
                <span className="cv-item-title">{edu.degree}</span>
                <span className="cv-item-date">{edu.year}</span>
              </div>
              <div className="cv-item-subtitle">{edu.institution}</div>
            </div>
          ))}
        </section>
      )}

      {profile.technicalSkills?.length > 0 && (
        <section className="cv-section">
          <h3 className="cv-section-title">Technical Skills</h3>
          <div className="cv-skills">
            {profile.technicalSkills.map((skill, i) => (
              <span key={i} className="skill-tag" style={{ background: primaryColor }}>{skill}</span>
            ))}
          </div>
        </section>
      )}

      {profile.softSkills?.length > 0 && (
        <section className="cv-section">
          <h3 className="cv-section-title">Soft Skills</h3>
          <div className="cv-skills">
            {profile.softSkills.map((skill, i) => (
              <span key={i} className="skill-tag skill-tag-outline" style={{ borderColor: primaryColor, color: primaryColor }}>{skill}</span>
            ))}
          </div>
        </section>
      )}

      {profile.projects?.length > 0 && (
        <section className="cv-section">
          <h3 className="cv-section-title">Projects</h3>
          {profile.projects.map((proj, i) => (
            <div key={i} className="cv-item">
              <div className="cv-item-header">
                <span className="cv-item-title">{proj.projectName}</span>
                <span className="cv-item-tech">{proj.technologies}</span>
              </div>
              <p className="cv-item-desc">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {profile.certifications?.length > 0 && (
        <section className="cv-section">
          <h3 className="cv-section-title">Certifications</h3>
          <div className="cv-cert-list">
            {profile.certifications.map((cert, i) => <span key={i} className="cert-item">🏆 {cert}</span>)}
          </div>
        </section>
      )}

      {profile.languages?.length > 0 && (
        <section className="cv-section">
          <h3 className="cv-section-title">Languages</h3>
          <p>{profile.languages.join(' • ')}</p>
        </section>
      )}

      {profile.references && (
        <section className="cv-section">
          <h3 className="cv-section-title">References</h3>
          <p>{profile.references}</p>
        </section>
      )}
    </div>
  );

  const renderModernTemplate = () => (
    <div className="cv-template-modern" style={{ '--primary-color': primaryColor, fontFamily: getSelectedFontFamily() }}>
      <div className="cv-sidebar">
        {renderProfilePhoto(90, '#ffffff55')}
        <div className="cv-name-sidebar">{profile.fullName}</div>
        <div className="cv-title-sidebar">{profile.workExperience?.[0]?.jobTitle || 'Professional'}</div>
        <hr />
        <div className="cv-contact-sidebar">
          {profile.email && <div><strong>📧 Email</strong><br />{profile.email}</div>}
          {profile.phoneNumber && <div><strong>📞 Phone</strong><br />{profile.phoneNumber}</div>}
          {profile.location && <div><strong>📍 Location</strong><br />{profile.location}</div>}
        </div>
        {(() => {
          const links = [
            { icon: '🔗', value: profile.linkedin },
            { icon: '💻', value: socialLinks.github },
            { icon: '🌐', value: socialLinks.portfolio },
          ].filter((l) => l.value);
          if (links.length === 0) return null;
          return (
            <div className="cv-social-sidebar">
              <strong>🔗 Links</strong>
              {links.map((l, i) => <div key={i} className="social-sidebar-item">{l.icon} {l.value}</div>)}
            </div>
          );
        })()}
        {profile.technicalSkills?.length > 0 && (
          <div className="cv-skills-sidebar">
            <strong>⚡ Skills</strong>
            <div className="cv-skills-list">
              {profile.technicalSkills.map((skill, i) => (
                <span key={i} className="skill-tag-sidebar">{skill}</span>
              ))}
            </div>
          </div>
        )}
        {profile.languages?.length > 0 && (
          <div className="cv-languages-sidebar">
            <strong>🌍 Languages</strong>
            {profile.languages.map((lang, i) => <div key={i} className="lang-item">{lang}</div>)}
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
            {profile.workExperience.map((exp, i) => (
              <div key={i} className="cv-item-modern">
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
            {profile.education.map((edu, i) => (
              <div key={i} className="cv-item-modern">
                <div className="cv-item-title">{edu.degree}</div>
                <div className="cv-item-subtitle">{edu.institution}</div>
                <div className="cv-item-date">{edu.year}</div>
              </div>
            ))}
          </section>
        )}
        {profile.projects?.length > 0 && (
          <section>
            <h3 className="cv-section-title-modern">Projects</h3>
            {profile.projects.map((proj, i) => (
              <div key={i} className="cv-item-modern">
                <div className="cv-item-title">{proj.projectName}</div>
                <div className="cv-item-tech" style={{ color: primaryColor }}>{proj.technologies}</div>
                <p className="cv-item-desc">{proj.description}</p>
              </div>
            ))}
          </section>
        )}
        {profile.certifications?.length > 0 && (
          <section>
            <h3 className="cv-section-title-modern">Certifications</h3>
            {profile.certifications.map((cert, i) => <div key={i} className="cert-modern">🏆 {cert}</div>)}
          </section>
        )}
      </div>
    </div>
  );

  const renderATSTemplate = () => (
    <div className="cv-template-ats" style={{ fontFamily: getSelectedFontFamily() }}>
      <div className="cv-header-ats">
        <div className="cv-header-ats-row">
          {renderProfilePhoto(60, '#ddd')}
          <div>
            <h1>{profile.fullName}</h1>
            <p>{profile.workExperience?.[0]?.jobTitle || 'Professional'}</p>
            <div className="cv-contact-ats">
              {[profile.email, profile.phoneNumber, profile.location].filter(Boolean).join(' | ')}
            </div>
            {renderSocialLinks('ats')}
          </div>
        </div>
      </div>
      {profile.summary && (<div className="cv-section-ats"><h3>SUMMARY</h3><p>{profile.summary}</p></div>)}
      {profile.workExperience?.length > 0 && (
        <div className="cv-section-ats">
          <h3>WORK EXPERIENCE</h3>
          {profile.workExperience.map((exp, i) => (
            <div key={i} className="cv-item-ats">
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
          {profile.education.map((edu, i) => (
            <div key={i}><strong>{edu.degree}</strong><br />{edu.institution}, {edu.year}</div>
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
      {profile.projects?.length > 0 && (
        <div className="cv-section-ats">
          <h3>PROJECTS</h3>
          {profile.projects.map((proj, i) => (
            <div key={i} className="cv-item-ats"><strong>{proj.projectName}</strong> ({proj.technologies})<br />{proj.description}</div>
          ))}
        </div>
      )}
      {profile.certifications?.length > 0 && (<div className="cv-section-ats"><h3>CERTIFICATIONS</h3><p>{profile.certifications.join(', ')}</p></div>)}
      {profile.languages?.length > 0 && (<div className="cv-section-ats"><h3>LANGUAGES</h3><p>{profile.languages.join(', ')}</p></div>)}
      {profile.references && (<div className="cv-section-ats"><h3>REFERENCES</h3><p>{profile.references}</p></div>)}
    </div>
  );

  const renderPremiumTemplate = () => (
    <div className="cv-template-premium" style={{ '--primary-color': primaryColor, fontFamily: getSelectedFontFamily() }}>
      <div className="cv-premium-header">
        <div className="cv-premium-header-row">
          {renderProfilePhoto(85, `${primaryColor}88`)}
          <div className="cv-premium-header-text">
            <h1>{profile.fullName}</h1>
            <p>{profile.workExperience?.[0]?.jobTitle || 'Professional'}</p>
            <div className="cv-premium-contact">
              {[profile.email, profile.phoneNumber, profile.location].filter(Boolean).join(' • ')}
            </div>
            {renderSocialLinks('premium')}
          </div>
        </div>
      </div>
      {profile.summary && (<div className="cv-premium-section"><h3 style={{ color: primaryColor }}>Executive Summary</h3><p>{profile.summary}</p></div>)}
      {profile.workExperience?.length > 0 && (
        <div className="cv-premium-section">
          <h3 style={{ color: primaryColor }}>Professional Experience</h3>
          {profile.workExperience.map((exp, i) => (
            <div key={i} className="cv-premium-item">
              <div className="cv-premium-item-header"><strong>{exp.jobTitle}</strong><span>{exp.duration}</span></div>
              <div className="cv-premium-company">{exp.company}</div>
              <p>{exp.responsibilities}</p>
            </div>
          ))}
        </div>
      )}
      {profile.education?.length > 0 && (
        <div className="cv-premium-section">
          <h3 style={{ color: primaryColor }}>Education</h3>
          {profile.education.map((edu, i) => (
            <div key={i} className="cv-premium-item">
              <strong>{edu.degree}</strong>
              <div className="cv-premium-company">{edu.institution} — {edu.year}</div>
            </div>
          ))}
        </div>
      )}
      {profile.technicalSkills?.length > 0 && (
        <div className="cv-premium-section">
          <h3 style={{ color: primaryColor }}>Core Competencies</h3>
          <div className="cv-premium-skills">
            {profile.technicalSkills.map((skill, i) => (
              <span key={i} className="premium-skill-tag" style={{ background: primaryColor }}>{skill}</span>
            ))}
          </div>
        </div>
      )}
      {profile.projects?.length > 0 && (
        <div className="cv-premium-section">
          <h3 style={{ color: primaryColor }}>Key Projects</h3>
          {profile.projects.map((proj, i) => (
            <div key={i} className="cv-premium-item">
              <strong>{proj.projectName}</strong><span className="cv-premium-tech">{proj.technologies}</span>
              <p>{proj.description}</p>
            </div>
          ))}
        </div>
      )}
      {(profile.certifications?.length > 0 || profile.achievements?.length > 0) && (
        <div className="cv-premium-section">
          <h3 style={{ color: primaryColor }}>Certifications & Awards</h3>
          <div className="cv-premium-certs">
            {profile.certifications?.map((cert, i) => <span key={i} className="premium-cert-item">🏆 {cert}</span>)}
            {profile.achievements?.map((a, i) => <span key={`a-${i}`} className="premium-cert-item">⭐ {a}</span>)}
          </div>
        </div>
      )}
      {profile.languages?.length > 0 && (<div className="cv-premium-section"><h3 style={{ color: primaryColor }}>Languages</h3><p>{profile.languages.join(' • ')}</p></div>)}
    </div>
  );

  const renderCurrentTemplate = () => {
    switch (template) {
      case 'modern': return renderModernTemplate();
      case 'ats': return renderATSTemplate();
      case 'premium': return renderPremiumTemplate();
      default: return renderCorporateTemplate();
    }
  };

  // ─── Loading / Error States ───────────────────────────────
  if (loading) {
    return (
      <div className="cv-wrapper">
        <div className="cv-loading"><div className="loading-spinner"></div><p>Loading resume data...</p></div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="cv-wrapper">
        <div className="cv-error"><p>{error}</p></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="cv-wrapper">
        <div className="cv-error"><p>No profile data found. Please complete your profile first.</p></div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className={`cv-wrapper ${readOnly ? 'cv-readonly' : ''}`}>
      {!readOnly && (
        <div className="resume-templates-section no-print">
          <div className="templates-header">
            <h2>Resume Templates</h2>
            <p>Select a template to generate your resume</p>
          </div>

          <div className="profile-status">
            <i className="status-icon">✓</i>
            <span>Profile found. Choose a template and click Preview or Download.</span>
          </div>

          {/* Template Cards */}
          <div className="templates-grid">
            {TEMPLATES.map((temp) => (
              <div key={temp.id} className={`template-card ${template === temp.id ? 'active' : ''}`} onClick={() => handleTemplateChange(temp.id)}>
                <TemplateThumbnail templateId={temp.id} primaryColor={primaryColor} />
                {template === temp.id && (
                  <div className="template-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                )}
                <div className="template-name">{temp.name}</div>
                <div className="template-desc">{temp.desc}</div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-preview" onClick={() => setShowPreviewModal(true)}>
              <span className="btn-icon">👁️</span> Preview Resume
            </button>
            <button className="btn-download" onClick={downloadPDF} disabled={pdfGenerating}>
              <span className="btn-icon">⬇️</span> {pdfGenerating ? 'Generating...' : 'Download PDF'}
            </button>
            <button className="btn-docx" onClick={downloadDOCX}>
              <span className="btn-icon">📄</span> Download DOCX
            </button>
          </div>

          {/* Customization Toolbar */}
          <div className="customization-toolbar">
            <div className="toolbar-item">
              <button className="color-trigger" onClick={() => { setShowColorPicker(!showColorPicker); setShowFontPicker(false); }} style={{ backgroundColor: primaryColor }}>
                <span>🎨</span> Accent Color
              </button>
              {showColorPicker && (
                <div className="color-dropdown">
                  {COLOR_OPTIONS.map((color) => (
                    <div key={color.value} className={`color-option ${primaryColor === color.value ? 'active' : ''}`} style={{ backgroundColor: color.value }} onClick={() => handleColorChange(color.value)} title={color.name} />
                  ))}
                </div>
              )}
            </div>
            <div className="toolbar-item">
              <button className="font-trigger" onClick={() => { setShowFontPicker(!showFontPicker); setShowColorPicker(false); }}>
                <span>🔤</span> {FONT_OPTIONS.find((f) => f.id === selectedFont)?.name || 'Font'}
              </button>
              {showFontPicker && (
                <div className="font-dropdown">
                  {FONT_OPTIONS.map((font) => (
                    <div key={font.id} className={`font-option ${selectedFont === font.id ? 'active' : ''}`} style={{ fontFamily: font.family }} onClick={() => handleFontChange(font.id)}>
                      {font.name}
                      {selectedFont === font.id && <span className="font-check">✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="toolbar-item">
              <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoUpload} style={{ display: 'none' }} id="photo-upload" />
              <button className="photo-trigger" onClick={() => photoInputRef.current?.click()}>
                <span>📸</span> {profilePhoto ? 'Change Photo' : 'Add Photo'}
              </button>
              {profilePhoto && <button className="photo-remove" onClick={handleRemovePhoto} title="Remove photo">✕</button>}
            </div>
            <div className="toolbar-item">
              <button className="social-trigger" onClick={() => setShowSocialEditor(!showSocialEditor)}>
                <span>🔗</span> Social Links
              </button>
            </div>
          </div>

          {/* Social Links Editor */}
          {showSocialEditor && (
            <div className="social-editor-panel">
              <h4>Social & Portfolio Links</h4>
              <div className="social-editor-grid">
                <div className="social-input-group">
                  <label>💻 GitHub</label>
                  <input type="text" placeholder="github.com/username" value={socialLinks.github} onChange={(e) => handleSocialChange('github', e.target.value)} />
                </div>
                <div className="social-input-group">
                  <label>🌐 Portfolio</label>
                  <input type="text" placeholder="yourportfolio.com" value={socialLinks.portfolio} onChange={(e) => handleSocialChange('portfolio', e.target.value)} />
                </div>
                <div className="social-input-group">
                  <label>🐦 Twitter</label>
                  <input type="text" placeholder="twitter.com/username" value={socialLinks.twitter} onChange={(e) => handleSocialChange('twitter', e.target.value)} />
                </div>
                <div className="social-input-group">
                  <label>🏠 Website</label>
                  <input type="text" placeholder="yourwebsite.com" value={socialLinks.website} onChange={(e) => handleSocialChange('website', e.target.value)} />
                </div>
              </div>
              <button className="social-editor-close" onClick={() => setShowSocialEditor(false)}>Done</button>
            </div>
          )}
        </div>
      )}

      {readOnly && (
        <div className="cv-readonly-header no-print">
          <div className="readonly-info">
            <span className="readonly-badge">Student CV View</span>
            <h3>{profile.fullName}</h3>
          </div>
          <div className="readonly-actions">
            <button className="btn-readonly-download" onClick={downloadPDF} disabled={pdfGenerating}>
              {pdfGenerating ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
      )}

      {/* CV Document */}
      <div className="cv-print-container" id="cv-document">
        {renderCurrentTemplate()}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className={`preview-modal-overlay ${modalAnimateIn ? 'visible' : ''}`} onClick={handleCloseModal}>
          <div className="preview-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <div className="preview-modal-title-area">
                <h3>{TEMPLATES.find((t) => t.id === template)?.name || 'Resume Preview'}</h3>
                <span className="preview-modal-subtitle">Live Preview</span>
              </div>
              <div className="preview-modal-controls">
                <div className="preview-template-switcher">
                  {TEMPLATES.map((t) => (
                    <button key={t.id} className={`preview-tmpl-btn ${template === t.id ? 'active' : ''}`} onClick={() => handleTemplateChange(t.id)} title={t.name}>{t.icon}</button>
                  ))}
                </div>
                <div className="preview-color-switcher">
                  {COLOR_OPTIONS.slice(0, 6).map((c) => (
                    <div key={c.value} className={`preview-color-dot ${primaryColor === c.value ? 'active' : ''}`} style={{ background: c.value }} onClick={() => handleColorChange(c.value)} title={c.name} />
                  ))}
                </div>
                <button className="preview-modal-close" onClick={handleCloseModal}>✕</button>
              </div>
            </div>
            <div className="preview-modal-body">
              <div className="preview-cv-paper">{renderCurrentTemplate()}</div>
            </div>
            <div className="preview-modal-footer">
              <button className="btn-modal-pdf" onClick={downloadPDF} disabled={pdfGenerating}>
                <span>⬇️</span> {pdfGenerating ? 'Generating...' : 'Download PDF'}
              </button>
              <button className="btn-modal-docx" onClick={downloadDOCX}><span>📄</span> Download DOCX</button>
              <button className="btn-modal-print" onClick={handlePrint}><span>🖨️</span> Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CVPreview;