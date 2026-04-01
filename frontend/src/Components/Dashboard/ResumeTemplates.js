import React, { useState, useEffect, useCallback, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from '../../environments/environment';
import './ResumeTemplates.css';

// ─── Constants ─────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: '◎' },
  { id: 'professional', label: 'Professional', icon: '◆' },
  { id: 'creative', label: 'Creative', icon: '✦' },
  { id: 'minimal', label: 'Minimal', icon: '○' },
  { id: 'modern', label: 'Modern', icon: '◈' },
  { id: 'ats', label: 'ATS-Friendly', icon: '☰' },
];

const TEMPLATES = [
  { id: 'corporate', name: 'Corporate Classic', category: 'professional', premium: false, accent: '#2d3748', secondary: '#3182ce', layout: 'top-bar', description: 'Classic universally accepted CV' },
  { id: 'modernTech', name: 'Tech Forward', category: 'modern', premium: false, accent: '#0f766e', secondary: '#14b8a6', layout: 'sidebar-left', description: 'Tech-focused clean layout with skills segments' },
  { id: 'ats', name: 'ATS Optimized', category: 'ats', premium: false, accent: '#374151', secondary: '#6b7280', layout: 'plain-text', description: 'Clean text-focused resume for scanners' },
  { id: 'enterprise', name: 'Premium Enterprise', category: 'professional', premium: true, accent: '#4f46e5', secondary: '#818cf8', layout: 'gradient-header', description: 'High-end corporate CV for top companies' },
  { id: 'executive', name: 'Executive Suite', category: 'professional', premium: true, accent: '#1a2744', secondary: '#c9a227', layout: 'split-gold', description: 'C-level & senior leadership' },
  { id: 'minimal-edge', name: 'Minimal Edge', category: 'minimal', premium: false, accent: '#18181b', secondary: '#a1a1aa', layout: 'clean-top', description: 'Clean, distraction-free layout' },
  { id: 'creative-bold', name: 'Bold Creative', category: 'creative', premium: true, accent: '#be185d', secondary: '#f472b6', layout: 'asymmetric', description: 'Design & marketing roles' },
  { id: 'nordic', name: 'Nordic Clean', category: 'minimal', premium: false, accent: '#1e3a5f', secondary: '#94a3b8', layout: 'scandinavian', description: 'Elegant Scandinavian style' },
  { id: 'two-column', name: 'Dual Column', category: 'professional', premium: false, accent: '#0369a1', secondary: '#38bdf8', layout: 'two-col', description: 'Balanced two-column layout' },
  { id: 'mono-type', name: 'Monotype', category: 'minimal', premium: false, accent: '#292524', secondary: '#78716c', layout: 'typewriter', description: 'Typography-focused design' },
  { id: 'startup', name: 'Startup Vibe', category: 'creative', premium: false, accent: '#ea580c', secondary: '#fb923c', layout: 'card-style', description: 'Startup & founder resumes' },
  { id: 'consulting', name: 'Consulting Elite', category: 'professional', premium: true, accent: '#1e293b', secondary: '#475569', layout: 'consulting', description: 'MBB & Big4 consulting' },
  { id: 'developer', name: 'Dev Terminal', category: 'modern', premium: false, accent: '#022c22', secondary: '#4ade80', layout: 'terminal', description: 'Developer & engineer roles' },
  { id: 'academic', name: 'Academic CV', category: 'ats', premium: false, accent: '#3f3f46', secondary: '#71717a', layout: 'academic', description: 'Research & academic positions' },
  { id: 'portfolio', name: 'Portfolio Plus', category: 'creative', premium: true, accent: '#7e22ce', secondary: '#c084fc', layout: 'portfolio', description: 'Visual portfolio integration' },
  { id: 'simple-ats', name: 'Simply Clean', category: 'ats', premium: false, accent: '#334155', secondary: '#94a3b8', layout: 'simple-clean', description: 'No-frills professional format' },
];

// ─── Helpers ───────────────────────────────────────────────────
const getUser = () => {
  try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; }
};

const getEffectiveProfileId = () => {
  try {
    return localStorage.getItem('profileId') || getUser()?.id || null;
  } catch { return null; }
};

const ensureArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim()) return val.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

const normalizeProfile = (data) => {
  const user = getUser();
  return {
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
  };
};

const fetchProfileData = async (profileId) => {
  const apiUrl = environment?.apiUrl || 'http://localhost:5000/api/users';
  const res = await fetch(`${apiUrl}/profile/${profileId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
  return normalizeProfile(data);
};

// ─── CV HTML Generator ────────────────────────────────────────
const generateCVHTML = (profile) => {
  const techSkills = ensureArray(profile.technicalSkills).join(', ');
  const softSkills = ensureArray(profile.softSkills).join(', ');
  const certs = ensureArray(profile.certifications).join(', ');
  const achievements = ensureArray(profile.achievements).join(', ');
  const languages = ensureArray(profile.languages).join(', ');

  return `
    <div style="padding:30px;font-family:Arial,sans-serif;line-height:1.4;">
      <header style="text-align:center;border-bottom:2px solid #222;padding-bottom:15px;margin-bottom:20px;">
        <h1 style="font-size:2rem;margin:0;text-transform:uppercase;letter-spacing:1px;">${profile.fullName}</h1>
        <div style="font-size:0.95rem;color:#333;">
          ${[profile.email, profile.phoneNumber, profile.location, profile.linkedin].filter(Boolean).join(' • ')}
        </div>
      </header>
      ${profile.summary ? `<section style="margin-bottom:15px;"><h3 style="font-size:1.1rem;font-weight:bold;text-transform:uppercase;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:8px;">Professional Summary</h3><p style="margin:0;font-size:1rem;color:#333;">${profile.summary}</p></section>` : ''}
      ${profile.workExperience?.length > 0 ? `<section style="margin-bottom:15px;"><h3 style="font-size:1.1rem;font-weight:bold;text-transform:uppercase;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:8px;">Work Experience</h3>${profile.workExperience.map((e) => `<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;"><span style="font-weight:bold;">${e.jobTitle}</span><span style="font-style:italic;color:#555;">${e.duration}</span></div><div style="font-weight:600;color:#444;">${e.company}</div><p style="margin:5px 0;font-size:0.95rem;color:#333;">${e.responsibilities}</p></div>`).join('')}</section>` : ''}
      ${profile.education?.length > 0 ? `<section style="margin-bottom:15px;"><h3 style="font-size:1.1rem;font-weight:bold;text-transform:uppercase;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:8px;">Education</h3>${profile.education.map((e) => `<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;"><span style="font-weight:bold;">${e.degree}</span><span style="font-style:italic;color:#555;">${e.year}</span></div><div style="font-weight:600;color:#444;">${e.institution}</div></div>`).join('')}</section>` : ''}
      ${profile.projects?.length > 0 ? `<section style="margin-bottom:15px;"><h3 style="font-size:1.1rem;font-weight:bold;text-transform:uppercase;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:8px;">Projects</h3>${profile.projects.map((p) => `<div style="margin-bottom:10px;"><span style="font-weight:bold;">${p.projectName}</span>${p.technologies ? ` <span style="color:#666;font-size:0.9rem;">(${p.technologies})</span>` : ''}<p style="margin:5px 0;font-size:0.95rem;color:#333;">${p.description}</p></div>`).join('')}</section>` : ''}
      ${techSkills || softSkills ? `<section style="margin-bottom:15px;"><h3 style="font-size:1.1rem;font-weight:bold;text-transform:uppercase;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:8px;">Skills</h3>${techSkills ? `<div style="margin-bottom:5px;"><strong>Technical:</strong> ${techSkills}</div>` : ''}${softSkills ? `<div style="margin-bottom:5px;"><strong>Interpersonal:</strong> ${softSkills}</div>` : ''}</section>` : ''}
      ${certs || achievements ? `<section style="margin-bottom:15px;"><h3 style="font-size:1.1rem;font-weight:bold;text-transform:uppercase;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:8px;">Additional Info</h3>${certs ? `<div style="margin-bottom:5px;"><strong>Certifications:</strong> ${certs}</div>` : ''}${achievements ? `<div style="margin-bottom:5px;"><strong>Achievements:</strong> ${achievements}</div>` : ''}</section>` : ''}
      ${languages ? `<section style="margin-bottom:15px;"><h3 style="font-size:1.1rem;font-weight:bold;text-transform:uppercase;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:8px;">Languages</h3><p style="margin:0;">${languages}</p></section>` : ''}
      ${profile.references ? `<section style="margin-bottom:15px;"><h3 style="font-size:1.1rem;font-weight:bold;text-transform:uppercase;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:8px;">References</h3><p style="margin:0;">${profile.references}</p></section>` : ''}
    </div>
  `;
};

// ═══════════════════════════════════════════════════════════════
// MINI RESUME THUMBNAIL
// ═══════════════════════════════════════════════════════════════
function MiniResume({ template }) {
  const { accent, secondary, layout } = template;
  const L = (w, bg = '#d4d4d8', h = 4, op = 1) => (
    <div style={{ width: w, height: h, borderRadius: 2, background: bg, opacity: op }} />
  );
  const G = (h = 6) => <div style={{ height: h }} />;
  const Ls = (n, bg) => Array.from({ length: n }, (_, i) => (
    <div key={i}>{L(`${65 + Math.random() * 30}%`, bg)}{i < n - 1 && G(3)}</div>
  ));
  const ST = (w = '40%') => L(w, accent, 5, 0.7);

  const body = () => (
    <>{ST('38%')}{G(4)}{Ls(3)}{G(8)}{ST('45%')}{G(4)}{Ls(2)}{G(8)}{ST('32%')}{G(4)}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {[40, 52, 36, 48].map((w, i) => <div key={i} style={{ width: w, height: 10, borderRadius: 3, background: secondary, opacity: 0.2 }} />)}
      </div>
    </>
  );

  const layouts = {
    'split-gold': (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ width: '35%', background: accent, padding: '14px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: secondary, opacity: 0.6, margin: '0 auto 4px' }} />
          {L('80%', '#fff', 6, 0.9)}{L('60%', '#fff', 3, 0.4)}{G(8)}
          {L('70%', secondary, 4, 0.5)}{L('85%', '#fff', 3, 0.3)}{L('65%', '#fff', 3, 0.3)}{G(6)}
          {L('70%', secondary, 4, 0.5)}{L('90%', '#fff', 3, 0.3)}{L('50%', '#fff', 3, 0.3)}
        </div>
        <div style={{ flex: 1, padding: '14px 10px' }}>{body()}</div>
      </div>
    ),
    'top-bar': (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: accent, padding: '14px 12px 10px' }}>
          {L('65%', '#fff', 7, 0.95)}{G(3)}{L('45%', '#fff', 3, 0.45)}
        </div>
        <div style={{ flex: 1, padding: '10px 12px', overflow: 'hidden' }}>{body()}</div>
      </div>
    ),
    'sidebar-left': (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ width: '32%', background: `${accent}10`, borderRight: `2px solid ${accent}22`, padding: '14px 8px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: accent, opacity: 0.15, margin: '0 auto 4px' }} />
          {L('85%', accent, 5, 0.7)}{L('65%', accent, 3, 0.3)}{G(6)}
          {L('55%', secondary, 4, 0.5)}{Ls(3, `${accent}30`)}{G(4)}
          {L('55%', secondary, 4, 0.5)}{Ls(2, `${accent}30`)}
        </div>
        <div style={{ flex: 1, padding: '14px 10px' }}>{body()}</div>
      </div>
    ),
    'clean-top': (
      <div style={{ height: '100%', padding: '16px 14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: 10, paddingBottom: 8, borderBottom: `1.5px solid ${accent}20` }}>
          {L('55%', accent, 7, 0.85)}{G(3)}{L('70%', '#a1a1aa', 3, 0.5)}
        </div>
        {body()}
      </div>
    ),
    asymmetric: (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: `linear-gradient(135deg, ${accent}, ${secondary})`, padding: '16px 12px 12px', clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}>
          {L('60%', '#fff', 7, 0.95)}{G(3)}{L('40%', '#fff', 3, 0.5)}
        </div>
        <div style={{ flex: 1, padding: '6px 12px', overflow: 'hidden' }}>{body()}</div>
      </div>
    ),
    'plain-text': (
      <div style={{ height: '100%', padding: '14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #e4e4e7' }}>
          {L('60%', '#27272a', 6, 0.9)}{G(3)}{L('80%', '#a1a1aa', 3, 0.5)}
        </div>
        {L('30%', '#52525b', 4, 0.6)}{G(3)}{Ls(4)}{G(6)}{L('35%', '#52525b', 4, 0.6)}{G(3)}{Ls(3)}
      </div>
    ),
    scandinavian: (
      <div style={{ height: '100%', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {L('45%', accent, 8, 0.8)}{L('60%', '#94a3b8', 3, 0.4)}{G(4)}
        <div style={{ height: 1.5, background: `${accent}18`, margin: '2px 0' }} />
        {body()}
      </div>
    ),
    'gradient-header': (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: `linear-gradient(135deg, ${accent}, ${secondary})`, padding: '18px 14px 14px', borderRadius: '0 0 8px 8px' }}>
          {L('55%', '#fff', 7, 0.95)}{G(3)}{L('70%', '#fff', 3, 0.4)}
        </div>
        <div style={{ flex: 1, padding: '10px 14px' }}>{body()}</div>
      </div>
    ),
    'two-col': (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: accent, padding: '12px 12px 8px', textAlign: 'center' }}>
          {L('50%', '#fff', 6, 0.9)}{G(2)}{L('65%', '#fff', 3, 0.4)}
        </div>
        <div style={{ flex: 1, display: 'flex', padding: '8px 10px', gap: 8 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>{ST('50%')}{G(2)}{Ls(4)}</div>
          <div style={{ width: 1, background: '#e4e4e7' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>{ST('55%')}{G(2)}{Ls(4)}</div>
        </div>
      </div>
    ),
    typewriter: (
      <div style={{ height: '100%', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {L('50%', accent, 9, 0.85)}{G(2)}
        <div style={{ height: 2, background: accent, opacity: 0.8, width: '100%' }} />
        {G(4)}{L('35%', accent, 4, 0.5)}{G(3)}{Ls(3, '#78716c40')}{G(6)}{L('40%', accent, 4, 0.5)}{G(3)}{Ls(3, '#78716c40')}
      </div>
    ),
    'card-style': (
      <div style={{ height: '100%', padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ background: `${accent}0d`, borderRadius: 6, padding: '10px 8px', border: `1.5px solid ${accent}20` }}>
          {L('55%', accent, 6, 0.85)}{G(2)}{L('70%', secondary, 3, 0.4)}
        </div>
        <div style={{ background: `${accent}08`, borderRadius: 6, padding: 8, flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {ST('42%')}{G(2)}{Ls(3)}{G(4)}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[38, 46, 32].map((w, i) => <div key={i} style={{ width: w, height: 12, borderRadius: 4, background: accent, opacity: 0.12 }} />)}
          </div>
        </div>
      </div>
    ),
    consulting: (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 14px 10px', borderBottom: `3px solid ${accent}` }}>
          {L('50%', accent, 8, 0.9)}{G(3)}{L('75%', '#64748b', 3, 0.4)}
        </div>
        <div style={{ flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {ST('38%')}{G(2)}
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 3, background: accent, opacity: 0.3, borderRadius: 2 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>{Ls(3)}</div>
          </div>
          {G(6)}{ST('42%')}{G(2)}
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 3, background: accent, opacity: 0.3, borderRadius: 2 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>{Ls(2)}</div>
          </div>
        </div>
      </div>
    ),
    terminal: (
      <div style={{ height: '100%', background: accent, padding: '10px', display: 'flex', flexDirection: 'column', gap: 3, borderRadius: 4 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          {['#ef4444', '#eab308', '#22c55e'].map((c, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
        </div>
        {L('55%', secondary, 6, 0.9)}{G(2)}{L('70%', secondary, 3, 0.3)}{G(6)}
        {L('30%', secondary, 4, 0.6)}{G(2)}{Ls(3, `${secondary}40`)}{G(5)}
        {L('35%', secondary, 4, 0.6)}{G(2)}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[36, 44, 30, 40].map((w, i) => <div key={i} style={{ width: w, height: 10, borderRadius: 3, background: secondary, opacity: 0.15 }} />)}
        </div>
      </div>
    ),
    academic: (
      <div style={{ height: '100%', padding: '14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #d4d4d8' }}>
          {L('55%', accent, 6, 0.85)}{G(3)}{L('80%', '#71717a', 3, 0.4)}
        </div>
        {L('35%', accent, 5, 0.6)}{G(3)}{Ls(3)}{G(6)}{L('40%', accent, 5, 0.6)}{G(3)}{Ls(2)}{G(6)}{L('30%', accent, 5, 0.6)}{G(3)}{Ls(2)}
      </div>
    ),
    portfolio: (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: `linear-gradient(135deg, ${accent}, ${secondary}90)`, padding: '14px 12px 10px' }}>
          {L('50%', '#fff', 7, 0.95)}{G(2)}{L('35%', '#fff', 3, 0.4)}
        </div>
        <div style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ height: 22, borderRadius: 4, background: `${accent}${12 + i * 4}`, opacity: 0.3 }} />)}
          </div>
          {G(2)}{ST('40%')}{G(2)}{Ls(2)}
        </div>
      </div>
    ),
    'simple-clean': (
      <div style={{ height: '100%', padding: '16px 14px', display: 'flex', flexDirection: 'column' }}>
        {L('50%', accent, 7, 0.85)}{G(2)}{L('75%', '#94a3b8', 3, 0.4)}{G(8)}
        {L('28%', accent, 4, 0.5)}{G(3)}{Ls(4)}{G(8)}{L('33%', accent, 4, 0.5)}{G(3)}{Ls(3)}
      </div>
    ),
  };

  return (
    <div style={{ width: '100%', height: '100%', background: layout === 'terminal' ? 'transparent' : '#fff', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
      {layouts[layout] || layouts['clean-top']}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PREVIEW SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════
function SectionBlock({ title, children }) {
  return (
    <section style={{ marginBottom: 15 }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: 5, marginBottom: 8 }}>{title}</h3>
      {children}
    </section>
  );
}

function ExpItem({ title, subtitle, date, desc }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 'bold' }}>{title}</span>
        {date && <span style={{ fontStyle: 'italic', color: '#555' }}>{date}</span>}
      </div>
      {subtitle && <div style={{ fontWeight: 600, color: '#444' }}>{subtitle}</div>}
      {desc && <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#333' }}>{desc}</p>}
    </div>
  );
}

function SkillsBlock({ technicalSkills, softSkills }) {
  if (!technicalSkills?.length && !softSkills?.length) return null;
  return (
    <SectionBlock title="Skills">
      {technicalSkills?.length > 0 && <div style={{ marginBottom: 5 }}><strong>Technical:</strong> {technicalSkills.join(', ')}</div>}
      {softSkills?.length > 0 && <div style={{ marginBottom: 5 }}><strong>Interpersonal:</strong> {softSkills.join(', ')}</div>}
    </SectionBlock>
  );
}

function PreviewContent({ data, templateId }) {
  const accent = TEMPLATES.find((t) => t.id === templateId)?.accent || '#374151';
  return (
    <>
      <header style={{ textAlign: 'center', borderBottom: `2px solid ${accent}`, paddingBottom: 15, marginBottom: 20 }}>
        <h1 style={{ fontSize: '2.1rem', margin: 0, textTransform: 'uppercase', letterSpacing: '1.5px', color: accent, fontWeight: 700 }}>{data.fullName}</h1>
        <div style={{ fontSize: '0.95rem', color: '#4b5563', marginTop: 4 }}>
          {[data.email, data.phoneNumber, data.location, data.linkedin].filter(Boolean).join(' • ')}
        </div>
      </header>
      {data.summary && <SectionBlock title="Professional Summary"><p style={{ margin: 0, fontSize: '1rem', color: '#333', lineHeight: 1.6 }}>{data.summary}</p></SectionBlock>}
      {data.workExperience?.length > 0 && <SectionBlock title="Work Experience">{data.workExperience.map((e, i) => <ExpItem key={i} title={e.jobTitle} subtitle={e.company} date={e.duration} desc={e.responsibilities} />)}</SectionBlock>}
      {data.education?.length > 0 && <SectionBlock title="Education">{data.education.map((e, i) => <ExpItem key={i} title={e.degree} subtitle={e.institution} date={e.year} />)}</SectionBlock>}
      {data.projects?.length > 0 && <SectionBlock title="Projects">{data.projects.map((p, i) => <ExpItem key={i} title={`${p.projectName}${p.technologies ? ` (${p.technologies})` : ''}`} desc={p.description} />)}</SectionBlock>}
      <SkillsBlock technicalSkills={data.technicalSkills} softSkills={data.softSkills} />
      {(data.certifications?.length > 0 || data.achievements?.length > 0) && (
        <SectionBlock title="Additional Info">
          {data.certifications?.length > 0 && <div style={{ marginBottom: 5 }}><strong>Certifications:</strong> {data.certifications.join(', ')}</div>}
          {data.achievements?.length > 0 && <div style={{ marginBottom: 5 }}><strong>Achievements:</strong> {data.achievements.join(', ')}</div>}
        </SectionBlock>
      )}
      {data.languages?.length > 0 && <SectionBlock title="Languages"><p style={{ margin: 0 }}>{data.languages.join(', ')}</p></SectionBlock>}
      {data.references && <SectionBlock title="References"><p style={{ margin: 0 }}>{data.references}</p></SectionBlock>}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
function ResumeTemplates() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [animatedIds, setAnimatedIds] = useState(new Set());
  const [profileId, setProfileId] = useState(null);
  const [showError, setShowError] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const filtered = TEMPLATES.filter((t) => {
    const matchesCat = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch = !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  useEffect(() => {
    const id = getEffectiveProfileId();
    if (!id) {
      setShowError(true);
      setInfoMessage('No profile found yet. Create your profile first to populate resume data.');
    } else {
      setShowError(false);
      setInfoMessage('Profile found. Choose a template and click Preview or Download.');
      try { localStorage.setItem('profileId', id); } catch {}
    }
    setProfileId(id);
  }, []);

  useEffect(() => {
    setAnimatedIds(new Set());
    const timer = setTimeout(() => setAnimatedIds(new Set(filtered.map((t) => t.id))), 50);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    if (infoMessage && !showError) {
      const timer = setTimeout(() => setInfoMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [infoMessage, showError]);

  const onPreview = useCallback(async () => {
    const id = profileId || getEffectiveProfileId();
    if (!selectedTemplate) { setInfoMessage('Please select a template first.'); return; }
    if (!id) { setShowError(true); setInfoMessage('No profile found. Please complete your profile first.'); return; }
    setShowError(false); setIsLoading(true);
    try {
      setPreviewData(await fetchProfileData(id));
      setPreviewMode(true);
    } catch (err) {
      setInfoMessage('Error loading preview: ' + (err.message || 'Unknown error'));
    } finally { setIsLoading(false); }
  }, [selectedTemplate, profileId]);

  const onDownload = useCallback(async () => {
    const id = profileId || getEffectiveProfileId();
    if (!selectedTemplate) { setInfoMessage('Please select a template first.'); return; }
    if (!id) { setShowError(true); setInfoMessage('No profile found. Please complete your profile first.'); return; }
    setShowError(false); setPdfGenerating(true);
    try {
      const profile = await fetchProfileData(id);
      const tempDiv = document.createElement('div');
      Object.assign(tempDiv.style, { position: 'absolute', left: '-9999px', top: '0', width: '800px', backgroundColor: '#fff', padding: '30px' });
      tempDiv.innerHTML = generateCVHTML(profile);
      document.body.appendChild(tempDiv);
      const overlay = document.createElement('div');
      Object.assign(overlay.style, { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, color: '#fff', fontSize: '18px' });
      overlay.innerHTML = `<div style="text-align:center;"><div style="width:50px;height:50px;border:4px solid #fff;border-top-color:#3b82f6;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px;"></div><p>Generating PDF...</p></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>`;
      document.body.appendChild(overlay);
      try {
        const canvas = await html2canvas(tempDiv, { scale: 2.5, logging: false, useCORS: true, backgroundColor: '#fff' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
        const pW = pdf.internal.pageSize.getWidth(), pH = pdf.internal.pageSize.getHeight();
        const iW = pW - 20, iH = (canvas.height * iW) / canvas.width;
        let hL = iH, pos = 0;
        pdf.addImage(imgData, 'PNG', 10, pos, iW, iH); hL -= pH;
        while (hL > 0) { pos = hL - iH; pdf.addPage(); pdf.addImage(imgData, 'PNG', 10, pos, iW, iH); hL -= pH; }
        pdf.save(`${(profile.fullName || 'Resume').replace(/\s/g, '_')}_${selectedTemplate}_resume.pdf`);
      } finally {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
        if (document.body.contains(tempDiv)) document.body.removeChild(tempDiv);
      }
    } catch (err) {
      setInfoMessage('Error downloading PDF: ' + (err.message || 'Unknown error'));
    } finally { setPdfGenerating(false); }
  }, [selectedTemplate, profileId]);

  const selectedTmpl = TEMPLATES.find((t) => t.id === selectedTemplate);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif', color: '#1c1c1c' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .rt-card{transition:transform 0.28s cubic-bezier(0.22,1,0.36,1),box-shadow 0.28s ease;cursor:pointer;}
        .rt-card:hover{transform:translateY(-6px) scale(1.015);box-shadow:0 20px 50px rgba(0,0,0,0.12),0 6px 16px rgba(0,0,0,0.06);}
        .rt-cat-btn{transition:all 0.2s ease;cursor:pointer;border:none;outline:none;white-space:nowrap;}
        .rt-cat-btn:hover{background:#eceae6!important;}
        .rt-overlay{opacity:0;transition:opacity 0.22s ease;}
        .rt-card:hover .rt-overlay{opacity:1;}
        .rt-enter{opacity:0;transform:translateY(16px);}
        .rt-visible{opacity:1;transform:translateY(0);transition:opacity 0.4s ease,transform 0.4s cubic-bezier(0.22,1,0.36,1);}
        .rt-btn{transition:all 0.2s ease;cursor:pointer;border:none;outline:none;font-family:inherit;}
        .rt-btn:hover{transform:scale(1.04);filter:brightness(1.08);}
        .rt-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;filter:none;}
        .rt-search:focus{outline:none;border-color:#1c1c1c;box-shadow:0 0 0 3px rgba(28,28,28,0.06);}
      `}</style>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 32px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Resume Templates</h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.95rem', color: '#7a7a72', fontWeight: 500 }}>{TEMPLATES.length} professional templates — pick one and make it yours</p>
          </div>
          <div style={{ position: 'relative', width: 280 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#b0b0a8', fontSize: 16, pointerEvents: 'none' }}>⌕</span>
            <input className="rt-search" type="text" placeholder="Search templates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px 14px 10px 36px', fontSize: '0.88rem', fontFamily: 'inherit', border: '1.5px solid #e0deda', borderRadius: 10, background: '#fff', color: '#1c1c1c', boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* Alert */}
        {infoMessage && (
          <div style={{ padding: '12px 18px', borderRadius: 10, marginBottom: 20, fontSize: '0.88rem', fontWeight: 600, background: showError ? '#fef2f2' : '#ecfdf5', color: showError ? '#991b1b' : '#065f46', border: `1px solid ${showError ? '#fecaca' : '#a7f3d0'}` }}>
            {infoMessage}
          </div>
        )}

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, paddingBottom: 4, overflowX: 'auto' }}>
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} className="rt-cat-btn" onClick={() => setActiveCategory(cat.id)} style={{ padding: '8px 16px', fontSize: '0.84rem', fontWeight: active ? 700 : 500, fontFamily: 'inherit', borderRadius: 8, background: active ? '#1c1c1c' : '#edebe7', color: active ? '#fff' : '#5a5a52', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11 }}>{cat.icon}</span>{cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Banner */}
      {selectedTmpl && (
        <div style={{ maxWidth: 1240, margin: '0 auto 20px', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#1c1c1c', borderRadius: 12, color: '#fff', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: selectedTmpl.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#fff', fontWeight: 800 }}>✓</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedTmpl.name}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.6 }}>{selectedTmpl.description}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="rt-btn" disabled={isLoading} onClick={onPreview} style={{ padding: '9px 22px', background: '#fff', color: '#1c1c1c', borderRadius: 8, fontWeight: 700, fontSize: '0.84rem' }}>
                {isLoading ? '⏳ Loading...' : '👁 Preview Resume'}
              </button>
              <button className="rt-btn" disabled={pdfGenerating} onClick={onDownload} style={{ padding: '9px 22px', background: selectedTmpl.accent, color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: '0.84rem' }}>
                {pdfGenerating ? '⏳ Generating...' : '⬇ Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Grid */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px 60px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a0a098' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>∅</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>No templates found</div>
            <div style={{ fontSize: '0.88rem', marginTop: 4 }}>Try a different search or category</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {filtered.map((t, index) => {
              const isSelected = selectedTemplate === t.id;
              return (
                <div key={t.id} className={`rt-card ${animatedIds.has(t.id) ? 'rt-visible' : 'rt-enter'}`}
                  style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: isSelected ? `2.5px solid ${t.accent}` : '2.5px solid transparent', boxShadow: isSelected ? `0 0 0 3px ${t.accent}18, 0 8px 24px rgba(0,0,0,0.08)` : '0 2px 8px rgba(0,0,0,0.04)', position: 'relative', transitionDelay: `${index * 40}ms` }}
                  onClick={() => setSelectedTemplate(t.id === selectedTemplate ? '' : t.id)}
                  onMouseEnter={() => setHoveredId(t.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div style={{ height: 210, padding: 10, background: '#fafaf8', position: 'relative' }}>
                    <MiniResume template={t} />
                    <div className="rt-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(28,28,28,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                      <div style={{ padding: '10px 24px', background: '#fff', color: '#1c1c1c', borderRadius: 8, fontWeight: 700, fontSize: '0.84rem', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                        {isSelected ? '✓ Selected' : 'Use Template'}
                      </div>
                    </div>
                    {t.premium && <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4, background: '#f5c518', color: '#1c1c1c' }}>PRO</div>}
                    {isSelected && <div style={{ position: 'absolute', top: 16, left: 16, width: 24, height: 24, borderRadius: '50%', background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 800, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>✓</div>}
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 2, letterSpacing: '-0.01em' }}>{t.name}</div>
                    <div style={{ fontSize: '0.76rem', color: '#9a9a92', fontWeight: 500 }}>{t.description}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 4, background: t.accent }} />
                      <div style={{ width: 14, height: 14, borderRadius: 4, background: t.secondary, opacity: 0.6 }} />
                      <span style={{ fontSize: '0.7rem', color: '#b0b0a8', marginLeft: 2, textTransform: 'capitalize' }}>{t.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Panel */}
      {previewMode && previewData && (
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px 60px' }}>
          <div style={{ padding: '2rem', background: '#fff', borderRadius: 16, border: '1px solid #e4e4e7', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>CV Preview — {selectedTmpl?.name || selectedTemplate}</h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#9a9a92' }}>Review your resume before downloading</p>
              </div>
              <button className="rt-btn" onClick={() => { setPreviewMode(false); setPreviewData(null); }} style={{ padding: '8px 20px', background: '#f4f4f5', color: '#3f3f46', borderRadius: 8, fontWeight: 600, fontSize: '0.84rem' }}>✕ Close</button>
            </div>
            <div id="cv-document" style={{ background: '#fff', padding: '30px 40px', maxWidth: 900, margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontFamily: 'Arial, sans-serif', lineHeight: 1.4, borderRadius: 8 }}>
              <PreviewContent data={previewData} templateId={selectedTemplate} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
              <button className="rt-btn" disabled={pdfGenerating} onClick={onDownload} style={{ padding: '12px 28px', background: selectedTmpl?.accent || '#1c1c1c', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem' }}>
                {pdfGenerating ? '⏳ Generating...' : '⬇ Download PDF'}
              </button>
              <button className="rt-btn" onClick={() => window.print()} style={{ padding: '12px 28px', background: '#f4f4f5', color: '#3f3f46', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem' }}>🖨 Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeTemplates;
