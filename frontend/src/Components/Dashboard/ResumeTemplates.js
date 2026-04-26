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
  { id: 'corporate', name: 'Corporate Classic', category: 'professional', premium: false, accent: '#2d3748', secondary: '#3182ce', layout: 'top-bar', previewLayout: 'corporate', description: 'Classic universally accepted CV' },
  { id: 'modernTech', name: 'Tech Forward', category: 'modern', premium: false, accent: '#0f766e', secondary: '#14b8a6', layout: 'sidebar-left', previewLayout: 'sidebar', description: 'Tech-focused clean layout with skills segments' },
  { id: 'ats', name: 'ATS Optimized', category: 'ats', premium: false, accent: '#374151', secondary: '#6b7280', layout: 'plain-text', previewLayout: 'ats', description: 'Clean text-focused resume for scanners' },
  { id: 'enterprise', name: 'Premium Enterprise', category: 'professional', premium: true, accent: '#4f46e5', secondary: '#818cf8', layout: 'gradient-header', previewLayout: 'enterprise', description: 'High-end corporate CV for top companies' },
  { id: 'executive', name: 'Executive Suite', category: 'professional', premium: true, accent: '#1a2744', secondary: '#c9a227', layout: 'split-gold', previewLayout: 'executive', description: 'C-level & senior leadership' },
  { id: 'minimal-edge', name: 'Minimal Edge', category: 'minimal', premium: false, accent: '#18181b', secondary: '#a1a1aa', layout: 'clean-top', previewLayout: 'minimal', description: 'Clean, distraction-free layout' },
  { id: 'creative-bold', name: 'Bold Creative', category: 'creative', premium: true, accent: '#be185d', secondary: '#f472b6', layout: 'asymmetric', previewLayout: 'creative', description: 'Design & marketing roles' },
  { id: 'nordic', name: 'Nordic Clean', category: 'minimal', premium: false, accent: '#1e3a5f', secondary: '#94a3b8', layout: 'scandinavian', previewLayout: 'nordic', description: 'Elegant Scandinavian style' },
  { id: 'two-column', name: 'Dual Column', category: 'professional', premium: false, accent: '#0369a1', secondary: '#38bdf8', layout: 'two-col', previewLayout: 'twocolumn', description: 'Balanced two-column layout' },
  { id: 'mono-type', name: 'Monotype', category: 'minimal', premium: false, accent: '#292524', secondary: '#78716c', layout: 'typewriter', previewLayout: 'monotype', description: 'Typography-focused design' },
  { id: 'startup', name: 'Startup Vibe', category: 'creative', premium: false, accent: '#ea580c', secondary: '#fb923c', layout: 'card-style', previewLayout: 'startup', description: 'Startup & founder resumes' },
  { id: 'consulting', name: 'Consulting Elite', category: 'professional', premium: true, accent: '#1e293b', secondary: '#475569', layout: 'consulting', previewLayout: 'consulting', description: 'MBB & Big4 consulting' },
  { id: 'developer', name: 'Dev Terminal', category: 'modern', premium: false, accent: '#022c22', secondary: '#4ade80', layout: 'terminal', previewLayout: 'terminal', description: 'Developer & engineer roles' },
  { id: 'academic', name: 'Academic CV', category: 'ats', premium: false, accent: '#3f3f46', secondary: '#71717a', layout: 'academic', previewLayout: 'academic', description: 'Research & academic positions' },
  { id: 'portfolio', name: 'Portfolio Plus', category: 'creative', premium: true, accent: '#7e22ce', secondary: '#c084fc', layout: 'portfolio', previewLayout: 'portfolio', description: 'Visual portfolio integration' },
  { id: 'simple-ats', name: 'Simply Clean', category: 'ats', premium: false, accent: '#334155', secondary: '#94a3b8', layout: 'simple-clean', previewLayout: 'simpleclean', description: 'No-frills professional format' },
];

// ─── Helpers ───────────────────────────────────────────────────
const getUser = () => { try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; } };
const getEffectiveProfileId = () => { 
  try { 
    const pid = localStorage.getItem('profileId');
    // Check if it's a valid 24-character hex string (MongoDB ObjectId)
    if (pid && /^[0-9a-fA-F]{24}$/.test(pid)) return pid;
    
    const user = getUser();
    const uid = user?.id || user?._id;
    if (uid && /^[0-9a-fA-F]{24}$/.test(uid)) return uid;
    
    return null; 
  } catch { 
    return null; 
  } 
};
const ensureArray = (v) => { if (Array.isArray(v)) return v; if (typeof v === 'string' && v.trim()) return v.split(',').map(s => s.trim()).filter(Boolean); return []; };

const normalizeProfile = (data) => {
  const u = getUser();
  return {
    fullName: data.fullName || u?.name || 'Your Name',
    email: data.email || u?.email || 'email@example.com',
    phoneNumber: data.phoneNumber || '', location: data.location || '',
    linkedin: data.linkedin || '', summary: data.summary || '',
    technicalSkills: ensureArray(data.technicalSkills), softSkills: ensureArray(data.softSkills),
    education: Array.isArray(data.education) ? data.education : [],
    workExperience: Array.isArray(data.workExperience) ? data.workExperience : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    certifications: ensureArray(data.certifications), achievements: ensureArray(data.achievements),
    references: data.references || '', languages: ensureArray(data.languages),
  };
};

const fetchProfileData = async (id) => {
  const apiUrl = environment?.apiUrl || 'http://localhost:5001/api/users';
  if (!id || id === 'undefined' || id === 'null') throw new Error('No valid profile ID provided');
  
  const res = await fetch(`${apiUrl}/profile/${id}`);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error('Server returned an invalid response');
  }
  
  if (!res.ok) {
    if (res.status === 404 && data.message === 'User not found') {
      localStorage.removeItem('profileId');
      throw new Error('User profile not found in database. Please complete your profile or try logging in again.');
    }
    throw new Error(data.message || 'Failed to fetch profile');
  }
  return normalizeProfile(data);
};

// ═══════════════════════════════════════════════════════════════
// MINI RESUME THUMBNAIL
// ═══════════════════════════════════════════════════════════════
function MiniResume({ template }) {
  const { accent, secondary, layout } = template;
  const L = (w, bg='#d4d4d8', h=4, op=1) => <div style={{width:w,height:h,borderRadius:2,background:bg,opacity:op}} />;
  const G = (h=6) => <div style={{height:h}} />;
  const Ls = (n, bg) => Array.from({length:n},(_,i) => <div key={i}>{L(`${65+Math.random()*30}%`,bg)}{i<n-1&&G(3)}</div>);
  const ST = (w='40%') => L(w, accent, 5, 0.7);
  const body = () => (<>{ST('38%')}{G(4)}{Ls(3)}{G(8)}{ST('45%')}{G(4)}{Ls(2)}{G(8)}{ST('32%')}{G(4)}<div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{[40,52,36,48].map((w,i)=><div key={i} style={{width:w,height:10,borderRadius:3,background:secondary,opacity:0.2}} />)}</div></>);

  const layouts = {
    'split-gold': (<div style={{display:'flex',height:'100%'}}><div style={{width:'35%',background:accent,padding:'14px 8px',display:'flex',flexDirection:'column',gap:4}}><div style={{width:28,height:28,borderRadius:'50%',background:secondary,opacity:0.6,margin:'0 auto 4px'}} />{L('80%','#fff',6,0.9)}{L('60%','#fff',3,0.4)}{G(8)}{L('70%',secondary,4,0.5)}{L('85%','#fff',3,0.3)}{L('65%','#fff',3,0.3)}{G(6)}{L('70%',secondary,4,0.5)}{L('90%','#fff',3,0.3)}</div><div style={{flex:1,padding:'14px 10px'}}>{body()}</div></div>),
    'top-bar': (<div style={{height:'100%',display:'flex',flexDirection:'column'}}><div style={{background:accent,padding:'14px 12px 10px'}}>{L('65%','#fff',7,0.95)}{G(3)}{L('45%','#fff',3,0.45)}</div><div style={{flex:1,padding:'10px 12px',overflow:'hidden'}}>{body()}</div></div>),
    'sidebar-left': (<div style={{display:'flex',height:'100%'}}><div style={{width:'32%',background:`${accent}10`,borderRight:`2px solid ${accent}22`,padding:'14px 8px',display:'flex',flexDirection:'column',gap:3}}><div style={{width:26,height:26,borderRadius:6,background:accent,opacity:0.15,margin:'0 auto 4px'}} />{L('85%',accent,5,0.7)}{L('65%',accent,3,0.3)}{G(6)}{L('55%',secondary,4,0.5)}{Ls(3,`${accent}30`)}</div><div style={{flex:1,padding:'14px 10px'}}>{body()}</div></div>),
    'clean-top': (<div style={{height:'100%',padding:'16px 14px',display:'flex',flexDirection:'column'}}><div style={{textAlign:'center',marginBottom:10,paddingBottom:8,borderBottom:`1.5px solid ${accent}20`}}>{L('55%',accent,7,0.85)}{G(3)}{L('70%','#a1a1aa',3,0.5)}</div>{body()}</div>),
    asymmetric: (<div style={{height:'100%',display:'flex',flexDirection:'column'}}><div style={{background:`linear-gradient(135deg,${accent},${secondary})`,padding:'16px 12px 12px',clipPath:'polygon(0 0,100% 0,100% 85%,0 100%)'}}>{L('60%','#fff',7,0.95)}{G(3)}{L('40%','#fff',3,0.5)}</div><div style={{flex:1,padding:'6px 12px',overflow:'hidden'}}>{body()}</div></div>),
    'plain-text': (<div style={{height:'100%',padding:'14px',display:'flex',flexDirection:'column'}}><div style={{marginBottom:8,paddingBottom:6,borderBottom:'1px solid #e4e4e7'}}>{L('60%','#27272a',6,0.9)}{G(3)}{L('80%','#a1a1aa',3,0.5)}</div>{L('30%','#52525b',4,0.6)}{G(3)}{Ls(4)}{G(6)}{L('35%','#52525b',4,0.6)}{G(3)}{Ls(3)}</div>),
    scandinavian: (<div style={{height:'100%',padding:'20px 16px',display:'flex',flexDirection:'column',gap:6}}>{L('45%',accent,8,0.8)}{L('60%','#94a3b8',3,0.4)}{G(4)}<div style={{height:1.5,background:`${accent}18`}} />{body()}</div>),
    'gradient-header': (<div style={{height:'100%',display:'flex',flexDirection:'column'}}><div style={{background:`linear-gradient(135deg,${accent},${secondary})`,padding:'18px 14px 14px',borderRadius:'0 0 8px 8px'}}>{L('55%','#fff',7,0.95)}{G(3)}{L('70%','#fff',3,0.4)}</div><div style={{flex:1,padding:'10px 14px'}}>{body()}</div></div>),
    'two-col': (<div style={{height:'100%',display:'flex',flexDirection:'column'}}><div style={{background:accent,padding:'12px 12px 8px',textAlign:'center'}}>{L('50%','#fff',6,0.9)}{G(2)}{L('65%','#fff',3,0.4)}</div><div style={{flex:1,display:'flex',padding:'8px 10px',gap:8}}><div style={{flex:1,display:'flex',flexDirection:'column',gap:3}}>{ST('50%')}{G(2)}{Ls(4)}</div><div style={{width:1,background:'#e4e4e7'}} /><div style={{flex:1,display:'flex',flexDirection:'column',gap:3}}>{ST('55%')}{G(2)}{Ls(4)}</div></div></div>),
    typewriter: (<div style={{height:'100%',padding:'18px 16px',display:'flex',flexDirection:'column',gap:4}}>{L('50%',accent,9,0.85)}{G(2)}<div style={{height:2,background:accent,opacity:0.8,width:'100%'}} />{G(4)}{L('35%',accent,4,0.5)}{G(3)}{Ls(3,'#78716c40')}{G(6)}{L('40%',accent,4,0.5)}{G(3)}{Ls(3,'#78716c40')}</div>),
    'card-style': (<div style={{height:'100%',padding:10,display:'flex',flexDirection:'column',gap:6}}><div style={{background:`${accent}0d`,borderRadius:6,padding:'10px 8px',border:`1.5px solid ${accent}20`}}>{L('55%',accent,6,0.85)}{G(2)}{L('70%',secondary,3,0.4)}</div><div style={{background:`${accent}08`,borderRadius:6,padding:8,flex:1,display:'flex',flexDirection:'column',gap:3}}>{ST('42%')}{G(2)}{Ls(3)}</div></div>),
    consulting: (<div style={{height:'100%',display:'flex',flexDirection:'column'}}><div style={{padding:'14px 14px 10px',borderBottom:`3px solid ${accent}`}}>{L('50%',accent,8,0.9)}{G(3)}{L('75%','#64748b',3,0.4)}</div><div style={{flex:1,padding:'10px 14px',display:'flex',flexDirection:'column',gap:3}}>{ST('38%')}{G(2)}<div style={{display:'flex',gap:6}}><div style={{width:3,background:accent,opacity:0.3,borderRadius:2}} /><div style={{flex:1,display:'flex',flexDirection:'column',gap:3}}>{Ls(3)}</div></div></div></div>),
    terminal: (<div style={{height:'100%',background:accent,padding:'10px',display:'flex',flexDirection:'column',gap:3,borderRadius:4}}><div style={{display:'flex',gap:4,marginBottom:4}}>{['#ef4444','#eab308','#22c55e'].map((c,i)=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:c,opacity:0.7}} />)}</div>{L('55%',secondary,6,0.9)}{G(2)}{L('70%',secondary,3,0.3)}{G(6)}{L('30%',secondary,4,0.6)}{G(2)}{Ls(3,`${secondary}40`)}</div>),
    academic: (<div style={{height:'100%',padding:'14px',display:'flex',flexDirection:'column'}}><div style={{textAlign:'center',marginBottom:8,paddingBottom:6,borderBottom:'1px solid #d4d4d8'}}>{L('55%',accent,6,0.85)}{G(3)}{L('80%','#71717a',3,0.4)}</div>{L('35%',accent,5,0.6)}{G(3)}{Ls(3)}{G(6)}{L('40%',accent,5,0.6)}{G(3)}{Ls(2)}</div>),
    portfolio: (<div style={{height:'100%',display:'flex',flexDirection:'column'}}><div style={{background:`linear-gradient(135deg,${accent},${secondary}90)`,padding:'14px 12px 10px'}}>{L('50%','#fff',7,0.95)}{G(2)}{L('35%','#fff',3,0.4)}</div><div style={{flex:1,padding:'8px 10px',display:'flex',flexDirection:'column',gap:4}}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4}}>{[0,1,2,3].map(i=><div key={i} style={{height:22,borderRadius:4,background:`${accent}${12+i*4}`,opacity:0.3}} />)}</div>{G(2)}{ST('40%')}{G(2)}{Ls(2)}</div></div>),
    'simple-clean': (<div style={{height:'100%',padding:'16px 14px',display:'flex',flexDirection:'column'}}>{L('50%',accent,7,0.85)}{G(2)}{L('75%','#94a3b8',3,0.4)}{G(8)}{L('28%',accent,4,0.5)}{G(3)}{Ls(4)}{G(8)}{L('33%',accent,4,0.5)}{G(3)}{Ls(3)}</div>),
  };

  return <div style={{width:'100%',height:'100%',background:layout==='terminal'?'transparent':'#fff',borderRadius:6,overflow:'hidden',position:'relative'}}>{layouts[layout]||layouts['clean-top']}</div>;
}

// ═══════════════════════════════════════════════════════════════
// UNIQUE PREVIEW RENDERERS
// ═══════════════════════════════════════════════════════════════
const contactLine = (d) => [d.email,d.phoneNumber,d.location,d.linkedin].filter(Boolean).join(' • ');

function CorporatePreview({ d, t }) {
  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <div style={{ background: t.accent, color: '#fff', padding: '28px 32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>{d.fullName}</h1>
        <div style={{ marginTop: 8, fontSize: '0.9rem', opacity: 0.8 }}>{contactLine(d)}</div>
      </div>
      <div style={{ padding: '24px 32px' }}>
        {d.summary && <CvSec title="Professional Summary"><p style={{ margin: 0, lineHeight: 1.7 }}>{d.summary}</p></CvSec>}
        {d.workExperience?.length > 0 && <CvSec title="Work Experience">{d.workExperience.map((e,i)=><ExpRow key={i} t={e.jobTitle} s={e.company} dt={e.duration} desc={e.responsibilities} />)}</CvSec>}
        {d.education?.length > 0 && <CvSec title="Education">{d.education.map((e,i)=><ExpRow key={i} t={e.degree} s={e.institution} dt={e.year} />)}</CvSec>}
        {d.projects?.length > 0 && <CvSec title="Projects">{d.projects.map((p,i)=><ExpRow key={i} t={`${p.projectName}${p.technologies?' ('+p.technologies+')':''}`} desc={p.description} />)}</CvSec>}
        <SkillsSec ts={d.technicalSkills} ss={d.softSkills} />
        <ExtraSec d={d} />
      </div>
    </div>
  );
}

function SidebarPreview({ d, t }) {
  return (
    <div style={{ display: 'flex', fontFamily: 'Helvetica, Arial, sans-serif', minHeight: 600 }}>
      <div style={{ width: 240, background: t.accent, color: '#fff', padding: '28px 20px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px', wordBreak: 'break-word' }}>{d.fullName}</h2>
        <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: 20 }}>{d.workExperience?.[0]?.jobTitle || ''}</div>
        <SideInfo label="Email" val={d.email} />
        <SideInfo label="Phone" val={d.phoneNumber} />
        <SideInfo label="Location" val={d.location} />
        <SideInfo label="LinkedIn" val={d.linkedin} />
        {d.technicalSkills?.length > 0 && <div style={{ marginTop: 20 }}><div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.6, marginBottom: 8, letterSpacing: 1 }}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{d.technicalSkills.map((s,i) => <span key={i} style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 8px', borderRadius: 4, fontSize: '0.75rem' }}>{s}</span>)}</div></div>}
        {d.languages?.length > 0 && <div style={{ marginTop: 20 }}><div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.6, marginBottom: 6, letterSpacing: 1 }}>Languages</div>{d.languages.map((l,i) => <div key={i} style={{ fontSize: '0.82rem', marginBottom: 3 }}>{l}</div>)}</div>}
      </div>
      <div style={{ flex: 1, padding: '28px 28px' }}>
        {d.summary && <CvSec title="Profile"><p style={{ margin: 0, lineHeight: 1.7 }}>{d.summary}</p></CvSec>}
        {d.workExperience?.length > 0 && <CvSec title="Experience">{d.workExperience.map((e,i)=><ExpRow key={i} t={e.jobTitle} s={e.company} dt={e.duration} desc={e.responsibilities} />)}</CvSec>}
        {d.education?.length > 0 && <CvSec title="Education">{d.education.map((e,i)=><ExpRow key={i} t={e.degree} s={e.institution} dt={e.year} />)}</CvSec>}
        {d.projects?.length > 0 && <CvSec title="Projects">{d.projects.map((p,i)=><ExpRow key={i} t={p.projectName} s={p.technologies} desc={p.description} />)}</CvSec>}
        <ExtraSec d={d} />
      </div>
    </div>
  );
}

function ATSPreview({ d }) {
  return (
    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', padding: '30px 36px', lineHeight: 1.65 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '2.4rem', margin: 0, fontWeight: 300, letterSpacing: 3 }}>{d.fullName}</h1>
        <div style={{ fontSize: '0.95rem', color: '#666', marginTop: 6, letterSpacing: 1 }}>{contactLine(d)}</div>
      </div>
      {d.summary && <ATSSec title="SUMMARY"><p style={{ margin: 0 }}>{d.summary}</p></ATSSec>}
      {d.workExperience?.length > 0 && <ATSSec title="EXPERIENCE">{d.workExperience.map((e,i)=><div key={i} style={{marginBottom:14}}><div style={{display:'flex',justifyContent:'space-between'}}><b>{e.jobTitle}</b><span style={{color:'#888',fontSize:'0.9rem'}}>{e.duration}</span></div><div style={{color:'#666',fontSize:'0.9rem'}}>{e.company}</div><p style={{margin:'4px 0 0',fontSize:'0.9rem'}}>{e.responsibilities}</p></div>)}</ATSSec>}
      {d.education?.length > 0 && <ATSSec title="EDUCATION">{d.education.map((e,i)=><div key={i} style={{marginBottom:8}}><div style={{display:'flex',justifyContent:'space-between'}}><b>{e.degree}</b><span style={{color:'#888',fontSize:'0.9rem'}}>{e.year}</span></div><div style={{color:'#666',fontSize:'0.9rem'}}>{e.institution}</div></div>)}</ATSSec>}
      {d.projects?.length > 0 && <ATSSec title="PROJECTS">{d.projects.map((p,i)=><div key={i} style={{marginBottom:8}}><b>{p.projectName}</b>{p.technologies&&<span style={{color:'#888'}}> ({p.technologies})</span>}<p style={{margin:'3px 0',fontSize:'0.9rem'}}>{p.description}</p></div>)}</ATSSec>}
      {(d.technicalSkills?.length>0||d.softSkills?.length>0) && <ATSSec title="SKILLS">{d.technicalSkills?.length>0&&<div><b>Technical:</b> {d.technicalSkills.join(', ')}</div>}{d.softSkills?.length>0&&<div><b>Soft:</b> {d.softSkills.join(', ')}</div>}</ATSSec>}
      <ExtraSec d={d} />
    </div>
  );
}

function EnterprisePreview({ d, t }) {
  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <div style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.secondary})`, color: '#fff', padding: '32px', textAlign: 'center', borderRadius: '0 0 12px 12px' }}>
        <h1 style={{ fontSize: '2.3rem', margin: 0, fontWeight: 700 }}>{d.fullName}</h1>
        <div style={{ marginTop: 8, fontSize: '0.92rem', opacity: 0.85 }}>📧 {d.email} {d.phoneNumber&&`• 📱 ${d.phoneNumber}`} {d.location&&`• 📍 ${d.location}`}</div>
      </div>
      <div style={{ padding: '24px 30px' }}>
        {d.summary && <EntSec title="📋 Executive Summary" accent={t.accent}><p style={{margin:0,lineHeight:1.7}}>{d.summary}</p></EntSec>}
        {d.workExperience?.length>0 && <EntSec title="💼 Professional Experience" accent={t.accent}>{d.workExperience.map((e,i)=><div key={i} style={{marginBottom:14,padding:14,background:'#f8f8fa',borderRadius:8,borderLeft:`3px solid ${t.accent}`}}><div style={{display:'flex',justifyContent:'space-between'}}><b style={{fontSize:'1.05rem'}}>{e.jobTitle}</b><i style={{color:'#888',fontSize:'0.85rem'}}>{e.duration}</i></div><div style={{color:t.accent,fontWeight:600,marginTop:2}}>{e.company}</div><p style={{margin:'6px 0 0',fontSize:'0.9rem',lineHeight:1.6}}>{e.responsibilities}</p></div>)}</EntSec>}
        {d.education?.length>0 && <EntSec title="🎓 Education" accent={t.accent}>{d.education.map((e,i)=><div key={i} style={{marginBottom:10,padding:12,background:'#f8f8fa',borderRadius:8}}><div style={{display:'flex',justifyContent:'space-between'}}><b>{e.degree}</b><i style={{color:'#888',fontSize:'0.85rem'}}>{e.year}</i></div><div style={{color:t.accent,fontWeight:600}}>{e.institution}</div></div>)}</EntSec>}
        {d.technicalSkills?.length>0 && <EntSec title="⚡ Core Competencies" accent={t.accent}><div style={{display:'flex',flexWrap:'wrap',gap:6}}>{d.technicalSkills.map((s,i)=><span key={i} style={{background:t.accent,color:'#fff',padding:'4px 12px',borderRadius:20,fontSize:'0.82rem',fontWeight:600}}>{s}</span>)}</div></EntSec>}
        {d.projects?.length>0 && <EntSec title="🚀 Projects" accent={t.accent}>{d.projects.map((p,i)=><div key={i} style={{marginBottom:10,padding:12,background:'#f8f8fa',borderRadius:8}}><b>{p.projectName}</b>{p.technologies&&<span style={{color:'#888'}}> ({p.technologies})</span>}<p style={{margin:'4px 0 0',fontSize:'0.9rem'}}>{p.description}</p></div>)}</EntSec>}
        <ExtraSec d={d} />
      </div>
    </div>
  );
}

function ExecutivePreview({ d, t }) {
  return (
    <div style={{ display: 'flex', fontFamily: '"Palatino Linotype", Georgia, serif', minHeight: 600 }}>
      <div style={{ width: 260, background: t.accent, color: '#fff', padding: '32px 22px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, color: t.secondary, letterSpacing: 1 }}>{d.fullName}</h2>
        <div style={{ width: 40, height: 2, background: t.secondary, margin: '10px 0 16px' }} />
        <SideInfo label="Email" val={d.email} />
        <SideInfo label="Phone" val={d.phoneNumber} />
        <SideInfo label="Location" val={d.location} />
        {d.technicalSkills?.length>0 && <div style={{marginTop:24}}><div style={{fontSize:'0.7rem',textTransform:'uppercase',color:t.secondary,fontWeight:700,letterSpacing:1.5,marginBottom:8}}>Expertise</div>{d.technicalSkills.map((s,i)=><div key={i} style={{fontSize:'0.82rem',marginBottom:4,paddingLeft:10,borderLeft:`2px solid ${t.secondary}40`}}>{s}</div>)}</div>}
        {d.languages?.length>0 && <div style={{marginTop:20}}><div style={{fontSize:'0.7rem',textTransform:'uppercase',color:t.secondary,fontWeight:700,letterSpacing:1.5,marginBottom:6}}>Languages</div>{d.languages.map((l,i)=><div key={i} style={{fontSize:'0.82rem',marginBottom:3}}>{l}</div>)}</div>}
      </div>
      <div style={{ flex: 1, padding: '28px 28px' }}>
        {d.summary && <><h3 style={{color:t.accent,fontSize:'0.85rem',textTransform:'uppercase',letterSpacing:2,borderBottom:`2px solid ${t.secondary}`,paddingBottom:6,marginBottom:10}}>Executive Profile</h3><p style={{lineHeight:1.7,margin:'0 0 20px'}}>{d.summary}</p></>}
        {d.workExperience?.length>0 && <><h3 style={{color:t.accent,fontSize:'0.85rem',textTransform:'uppercase',letterSpacing:2,borderBottom:`2px solid ${t.secondary}`,paddingBottom:6,marginBottom:10}}>Career History</h3>{d.workExperience.map((e,i)=><ExpRow key={i} t={e.jobTitle} s={e.company} dt={e.duration} desc={e.responsibilities} />)}</>}
        {d.education?.length>0 && <><h3 style={{color:t.accent,fontSize:'0.85rem',textTransform:'uppercase',letterSpacing:2,borderBottom:`2px solid ${t.secondary}`,paddingBottom:6,marginTop:20,marginBottom:10}}>Education</h3>{d.education.map((e,i)=><ExpRow key={i} t={e.degree} s={e.institution} dt={e.year} />)}</>}
        {d.projects?.length>0 && <><h3 style={{color:t.accent,fontSize:'0.85rem',textTransform:'uppercase',letterSpacing:2,borderBottom:`2px solid ${t.secondary}`,paddingBottom:6,marginTop:20,marginBottom:10}}>Key Projects</h3>{d.projects.map((p,i)=><ExpRow key={i} t={p.projectName} s={p.technologies} desc={p.description} />)}</>}
      </div>
    </div>
  );
}

function MinimalPreview({ d }) {
  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, sans-serif', padding: '40px 44px', lineHeight: 1.7, maxWidth: 680, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.6rem', fontWeight: 300, margin: 0, textAlign: 'center', letterSpacing: 3 }}>{d.fullName}</h1>
      <div style={{ textAlign: 'center', fontSize: '0.88rem', color: '#999', margin: '8px 0 30px', letterSpacing: 1 }}>{contactLine(d)}</div>
      {d.summary && <><div style={{height:1,background:'#eee',margin:'0 0 20px'}} /><p style={{margin:'0 0 24px',textAlign:'center',fontStyle:'italic',color:'#555'}}>{d.summary}</p></>}
      {d.workExperience?.length>0 && <MinSec title="Experience">{d.workExperience.map((e,i)=><ExpRow key={i} t={e.jobTitle} s={e.company} dt={e.duration} desc={e.responsibilities} />)}</MinSec>}
      {d.education?.length>0 && <MinSec title="Education">{d.education.map((e,i)=><ExpRow key={i} t={e.degree} s={e.institution} dt={e.year} />)}</MinSec>}
      {d.technicalSkills?.length>0 && <MinSec title="Skills"><p style={{margin:0}}>{d.technicalSkills.join(' · ')}</p></MinSec>}
      {d.projects?.length>0 && <MinSec title="Projects">{d.projects.map((p,i)=><ExpRow key={i} t={p.projectName} s={p.technologies} desc={p.description} />)}</MinSec>}
      <ExtraSec d={d} />
    </div>
  );
}

function CreativePreview({ d, t }) {
  return (
    <div style={{ fontFamily: '"Trebuchet MS", sans-serif' }}>
      <div style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.secondary})`, color: '#fff', padding: '36px 32px 28px', clipPath: 'polygon(0 0,100% 0,100% 88%,0 100%)' }}>
        <h1 style={{ fontSize: '2.4rem', margin: 0, fontWeight: 800 }}>{d.fullName}</h1>
        <div style={{ fontSize: '1rem', opacity: 0.8, marginTop: 6 }}>{d.workExperience?.[0]?.jobTitle || 'Professional'}</div>
        <div style={{ fontSize: '0.85rem', opacity: 0.65, marginTop: 4 }}>{contactLine(d)}</div>
      </div>
      <div style={{ padding: '16px 32px 28px' }}>
        {d.summary && <CvSec title="About Me"><p style={{margin:0,lineHeight:1.7}}>{d.summary}</p></CvSec>}
        {d.workExperience?.length>0 && <CvSec title="Experience">{d.workExperience.map((e,i)=><div key={i} style={{marginBottom:12,paddingLeft:14,borderLeft:`3px solid ${t.accent}`}}><b>{e.jobTitle}</b> — {e.company}<br/><span style={{color:'#888',fontSize:'0.85rem'}}>{e.duration}</span><p style={{margin:'4px 0 0',fontSize:'0.9rem'}}>{e.responsibilities}</p></div>)}</CvSec>}
        {d.technicalSkills?.length>0 && <CvSec title="Skills"><div style={{display:'flex',flexWrap:'wrap',gap:6}}>{d.technicalSkills.map((s,i)=><span key={i} style={{background:`${t.accent}15`,color:t.accent,padding:'4px 12px',borderRadius:20,fontSize:'0.82rem',fontWeight:600,border:`1px solid ${t.accent}30`}}>{s}</span>)}</div></CvSec>}
        {d.education?.length>0 && <CvSec title="Education">{d.education.map((e,i)=><ExpRow key={i} t={e.degree} s={e.institution} dt={e.year} />)}</CvSec>}
        {d.projects?.length>0 && <CvSec title="Projects">{d.projects.map((p,i)=><ExpRow key={i} t={p.projectName} s={p.technologies} desc={p.description} />)}</CvSec>}
      </div>
    </div>
  );
}

function TerminalPreview({ d, t }) {
  return (
    <div style={{ background: t.accent, color: t.secondary, fontFamily: '"Courier New", monospace', padding: '24px 28px', minHeight: 500, borderRadius: 8 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['#ef4444','#eab308','#22c55e'].map((c,i) => <div key={i} style={{width:10,height:10,borderRadius:'50%',background:c,opacity:0.8}} />)}
      </div>
      <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>$ cat resume.json</div>
      <h1 style={{ color: '#fff', fontSize: '1.8rem', margin: '8px 0 4px' }}>{d.fullName}</h1>
      <div style={{ fontSize: '0.85rem', opacity: 0.5, marginBottom: 20 }}>{contactLine(d)}</div>
      {d.summary && <><TermSec t="// ABOUT" /><p style={{margin:'4px 0 16px',lineHeight:1.6,opacity:0.8}}>{d.summary}</p></>}
      {d.workExperience?.length>0 && <><TermSec t="// EXPERIENCE" />{d.workExperience.map((e,i)=><div key={i} style={{marginBottom:12,paddingLeft:16,borderLeft:`2px solid ${t.secondary}40`}}><span style={{color:'#fff',fontWeight:700}}>{e.jobTitle}</span> <span style={{opacity:0.4}}>@</span> {e.company}<br/><span style={{opacity:0.4,fontSize:'0.8rem'}}>{e.duration}</span><p style={{margin:'3px 0 0',opacity:0.7,fontSize:'0.85rem'}}>{e.responsibilities}</p></div>)}</>}
      {d.technicalSkills?.length>0 && <><TermSec t="// SKILLS" /><div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>{d.technicalSkills.map((s,i)=><span key={i} style={{border:`1px solid ${t.secondary}40`,padding:'2px 10px',borderRadius:4,fontSize:'0.8rem'}}>{s}</span>)}</div></>}
      {d.education?.length>0 && <><TermSec t="// EDUCATION" />{d.education.map((e,i)=><div key={i} style={{marginBottom:6}}><span style={{color:'#fff'}}>{e.degree}</span> <span style={{opacity:0.4}}>|</span> {e.institution} <span style={{opacity:0.3}}>{e.year}</span></div>)}</>}
      {d.projects?.length>0 && <><TermSec t="// PROJECTS" />{d.projects.map((p,i)=><div key={i} style={{marginBottom:8}}><span style={{color:'#fff'}}>{p.projectName}</span>{p.technologies&&<span style={{opacity:0.4}}> [{p.technologies}]</span>}<p style={{margin:'2px 0 0',opacity:0.6,fontSize:'0.82rem'}}>{p.description}</p></div>)}</>}
    </div>
  );
}

function TwoColumnPreview({ d, t }) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: t.accent, color: '#fff', padding: '24px 30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>{d.fullName}</h1>
        <div style={{ marginTop: 6, fontSize: '0.88rem', opacity: 0.7 }}>{contactLine(d)}</div>
      </div>
      {d.summary && <div style={{padding:'16px 24px 0'}}><p style={{margin:0,lineHeight:1.6,color:'#555',fontStyle:'italic',textAlign:'center'}}>{d.summary}</p></div>}
      <div style={{ display: 'flex', padding: '20px 24px', gap: 24 }}>
        <div style={{ flex: 1 }}>
          {d.workExperience?.length>0 && <CvSec title="Experience">{d.workExperience.map((e,i)=><ExpRow key={i} t={e.jobTitle} s={e.company} dt={e.duration} desc={e.responsibilities} />)}</CvSec>}
          {d.projects?.length>0 && <CvSec title="Projects">{d.projects.map((p,i)=><ExpRow key={i} t={p.projectName} s={p.technologies} desc={p.description} />)}</CvSec>}
        </div>
        <div style={{ width: 1, background: '#e4e4e7' }} />
        <div style={{ flex: 1 }}>
          {d.education?.length>0 && <CvSec title="Education">{d.education.map((e,i)=><ExpRow key={i} t={e.degree} s={e.institution} dt={e.year} />)}</CvSec>}
          <SkillsSec ts={d.technicalSkills} ss={d.softSkills} />
          <ExtraSec d={d} />
        </div>
      </div>
    </div>
  );
}

function StartupPreview({ d, t }) {
  return (
    <div style={{ fontFamily: '"Segoe UI", sans-serif', padding: '20px' }}>
      <div style={{ background: `${t.accent}0a`, border: `2px solid ${t.accent}20`, borderRadius: 12, padding: '24px 28px', marginBottom: 16, textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, color: t.accent }}>{d.fullName}</h1>
        <div style={{ marginTop: 6, fontSize: '0.88rem', color: '#888' }}>{contactLine(d)}</div>
        {d.summary && <p style={{ margin: '12px 0 0', lineHeight: 1.6, color: '#555' }}>{d.summary}</p>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {d.workExperience?.length>0 && <div style={{background:'#fff',border:'1px solid #eee',borderRadius:10,padding:16}}><h3 style={{margin:'0 0 10px',color:t.accent,fontSize:'0.9rem',textTransform:'uppercase'}}>Experience</h3>{d.workExperience.map((e,i)=><div key={i} style={{marginBottom:10}}><b>{e.jobTitle}</b><div style={{color:'#888',fontSize:'0.82rem'}}>{e.company} • {e.duration}</div><p style={{margin:'3px 0',fontSize:'0.85rem'}}>{e.responsibilities}</p></div>)}</div>}
        {d.education?.length>0 && <div style={{background:'#fff',border:'1px solid #eee',borderRadius:10,padding:16}}><h3 style={{margin:'0 0 10px',color:t.accent,fontSize:'0.9rem',textTransform:'uppercase'}}>Education</h3>{d.education.map((e,i)=><div key={i} style={{marginBottom:8}}><b>{e.degree}</b><div style={{color:'#888',fontSize:'0.82rem'}}>{e.institution} • {e.year}</div></div>)}</div>}
        {d.technicalSkills?.length>0 && <div style={{background:'#fff',border:'1px solid #eee',borderRadius:10,padding:16}}><h3 style={{margin:'0 0 10px',color:t.accent,fontSize:'0.9rem',textTransform:'uppercase'}}>Skills</h3><div style={{display:'flex',flexWrap:'wrap',gap:5}}>{d.technicalSkills.map((s,i)=><span key={i} style={{background:`${t.accent}10`,color:t.accent,padding:'3px 10px',borderRadius:6,fontSize:'0.8rem',fontWeight:600}}>{s}</span>)}</div></div>}
        {d.projects?.length>0 && <div style={{background:'#fff',border:'1px solid #eee',borderRadius:10,padding:16}}><h3 style={{margin:'0 0 10px',color:t.accent,fontSize:'0.9rem',textTransform:'uppercase'}}>Projects</h3>{d.projects.map((p,i)=><div key={i} style={{marginBottom:8}}><b>{p.projectName}</b><p style={{margin:'3px 0',fontSize:'0.85rem',color:'#555'}}>{p.description}</p></div>)}</div>}
      </div>
    </div>
  );
}

// ─── Shared sub-components ─────────────────────────────────────
function CvSec({ title, children }) { return <section style={{marginBottom:18}}><h3 style={{fontSize:'1rem',fontWeight:700,textTransform:'uppercase',borderBottom:'1.5px solid #ddd',paddingBottom:5,marginBottom:8,letterSpacing:0.5}}>{title}</h3>{children}</section>; }
function ATSSec({ title, children }) { return <section style={{marginBottom:22}}><h3 style={{fontSize:'1.1rem',fontWeight:300,borderBottom:'1px solid #eee',paddingBottom:5,marginBottom:10}}>{title}</h3>{children}</section>; }
function MinSec({ title, children }) { return <section style={{marginBottom:22}}><h3 style={{fontSize:'0.8rem',fontWeight:400,textTransform:'uppercase',letterSpacing:3,color:'#999',marginBottom:8}}>{title}</h3>{children}</section>; }
function EntSec({ title, accent, children }) { return <section style={{marginBottom:20}}><h3 style={{fontSize:'1.15rem',fontWeight:700,color:accent,marginBottom:10}}>{title}</h3>{children}</section>; }
function TermSec({ t }) { return <div style={{fontSize:'0.8rem',fontWeight:700,marginTop:16,marginBottom:6,opacity:0.6}}>{t}</div>; }
function SideInfo({ label, val }) { if(!val) return null; return <div style={{marginBottom:10}}><div style={{fontSize:'0.68rem',textTransform:'uppercase',opacity:0.5,letterSpacing:1}}>{label}</div><div style={{fontSize:'0.82rem',wordBreak:'break-word'}}>{val}</div></div>; }
function ExpRow({ t, s, dt, desc }) { return <div style={{marginBottom:12}}><div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:4}}><b style={{fontSize:'0.95rem'}}>{t}</b>{dt&&<span style={{color:'#888',fontSize:'0.85rem',fontStyle:'italic'}}>{dt}</span>}</div>{s&&<div style={{color:'#555',fontSize:'0.88rem',fontWeight:600}}>{s}</div>}{desc&&<p style={{margin:'4px 0 0',fontSize:'0.9rem',lineHeight:1.6,color:'#444'}}>{desc}</p>}</div>; }
function SkillsSec({ ts, ss }) { if(!ts?.length&&!ss?.length) return null; return <CvSec title="Skills">{ts?.length>0&&<div style={{marginBottom:4}}><b>Technical:</b> {ts.join(', ')}</div>}{ss?.length>0&&<div><b>Soft:</b> {ss.join(', ')}</div>}</CvSec>; }
function ExtraSec({ d }) { const c=d.certifications,a=d.achievements,l=d.languages,r=d.references; if(!c?.length&&!a?.length&&!l?.length&&!r) return null; return <CvSec title="Additional">{c?.length>0&&<div style={{marginBottom:4}}><b>Certifications:</b> {c.join(', ')}</div>}{a?.length>0&&<div style={{marginBottom:4}}><b>Achievements:</b> {a.join(', ')}</div>}{l?.length>0&&<div style={{marginBottom:4}}><b>Languages:</b> {l.join(', ')}</div>}{r&&<div><b>References:</b> {r}</div>}</CvSec>; }

// ─── Preview Router ────────────────────────────────────────────
function PreviewContent({ data, templateId }) {
  const tmpl = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const pl = tmpl.previewLayout;
  const props = { d: data, t: tmpl };
  switch(pl) {
    case 'corporate': return <CorporatePreview {...props} />;
    case 'sidebar': return <SidebarPreview {...props} />;
    case 'ats': case 'simpleclean': case 'academic': return <ATSPreview {...props} />;
    case 'enterprise': return <EnterprisePreview {...props} />;
    case 'executive': case 'consulting': return <ExecutivePreview {...props} />;
    case 'minimal': case 'nordic': case 'monotype': return <MinimalPreview {...props} />;
    case 'creative': case 'portfolio': return <CreativePreview {...props} />;
    case 'terminal': return <TerminalPreview {...props} />;
    case 'twocolumn': return <TwoColumnPreview {...props} />;
    case 'startup': return <StartupPreview {...props} />;
    default: return <CorporatePreview {...props} />;
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
function ResumeTemplates() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [animatedIds, setAnimatedIds] = useState(new Set());
  const [profileId, setProfileId] = useState(null);
  const [showError, setShowError] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // Hidden render container ref for PDF capture
  const pdfRenderRef = useRef(null);

  const filtered = React.useMemo(() => TEMPLATES.filter(t => {
    const mc = activeCategory==='all'||t.category===activeCategory;
    const ms = !searchQuery||t.name.toLowerCase().includes(searchQuery.toLowerCase())||t.description.toLowerCase().includes(searchQuery.toLowerCase())||t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return mc&&ms;
  }), [activeCategory, searchQuery]);

  useEffect(() => {
    const id = getEffectiveProfileId();
    if(!id) { setShowError(true); setInfoMessage('No profile found yet. Create your profile first.'); }
    else { setShowError(false); setInfoMessage('Profile found. Choose a template and click Preview or Download.'); try{localStorage.setItem('profileId',id);}catch{} }
    setProfileId(id);
  }, []);

  useEffect(() => { setAnimatedIds(new Set()); const t=setTimeout(()=>setAnimatedIds(new Set(filtered.map(t=>t.id))),50); return()=>clearTimeout(t); }, [filtered]);
  useEffect(() => { if(infoMessage&&!showError){const t=setTimeout(()=>setInfoMessage(''),5001);return()=>clearTimeout(t);} }, [infoMessage,showError]);

  // ─── Preview ──────────────────────────────────────────────
  const onPreview = useCallback(async () => {
    const id=profileId||getEffectiveProfileId();
    if(!selectedTemplate){setInfoMessage('Please select a template first.');return;}
    if(!id){setShowError(true);setInfoMessage('No profile found. Complete your profile first.');return;}
    setShowError(false);setIsLoading(true);
    try{setPreviewData(await fetchProfileData(id));setPreviewMode(true);}
    catch(e){setShowError(true); setInfoMessage('Error: '+(e.message||'Unknown'));}
    finally{setIsLoading(false);}
  },[selectedTemplate,profileId]);

  // ─── PDF DOWNLOAD — captures the actual rendered preview ──
  const onDownload = useCallback(async () => {
    const id = profileId || getEffectiveProfileId();
    if (!selectedTemplate) { setInfoMessage('Please select a template first.'); return; }
    if (!id) { setShowError(true); setInfoMessage('No profile found.'); return; }

    setShowError(false);
    setPdfGenerating(true);

    // Show loading overlay
    const overlay = document.createElement('div');
    overlay.id = 'pdf-overlay';
    Object.assign(overlay.style, {
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: '9999', color: '#fff', fontSize: '18px',
    });
    overlay.innerHTML = `<div style="text-align:center;"><div style="width:50px;height:50px;border:4px solid #fff;border-top-color:#6366f1;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px;"></div><p style="font-family:sans-serif;">Generating PDF...</p></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>`;
    document.body.appendChild(overlay);

    try {
      // Fetch profile data
      const profile = await fetchProfileData(id);

      // If preview is already open AND has the cv-document element, capture it directly
      let targetElement = document.getElementById('cv-document');

      if (!targetElement || !previewMode) {
        // Preview not open — we need to render it first
        // Set preview data and mode which will render the preview in the DOM
        setPreviewData(profile);
        setPreviewMode(true);

        // Wait for React to render the preview
        await new Promise(resolve => setTimeout(resolve, 500));

        targetElement = document.getElementById('cv-document');
      }

      if (!targetElement) {
        throw new Error('Could not find CV document element. Please try Preview first, then Download.');
      }

      // Save original styles
      const origStyles = {
        width: targetElement.style.width,
        maxWidth: targetElement.style.maxWidth,
        boxShadow: targetElement.style.boxShadow,
        borderRadius: targetElement.style.borderRadius,
      };

      // Set fixed width for consistent PDF output
      targetElement.style.width = '800px';
      targetElement.style.maxWidth = '800px';
      targetElement.style.boxShadow = 'none';
      targetElement.style.borderRadius = '0';

      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 300));

      // Capture with html2canvas
      const canvas = await html2canvas(targetElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 800,
        windowWidth: 800,
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.getElementById('cv-document');
          if (clonedEl) {
            clonedEl.style.width = '800px';
            clonedEl.style.maxWidth = '800px';
            clonedEl.style.boxShadow = 'none';
            clonedEl.style.borderRadius = '0';
          }
        }
      });

      // Restore original styles
      Object.assign(targetElement.style, origStyles);

      // Generate PDF with multi-page support
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

      const fileName = `${(profile.fullName || 'Resume').replace(/\s/g, '_')}_${selectedTemplate}_resume.pdf`;
      pdf.save(fileName);

      setInfoMessage('PDF downloaded successfully!');

    } catch (err) {
      console.error('PDF generation failed:', err);
      setShowError(true);
      setInfoMessage('PDF error: ' + (err.message || 'Unknown error. Try Preview first, then Download.'));
    } finally {
      const ov = document.getElementById('pdf-overlay');
      if (ov && document.body.contains(ov)) document.body.removeChild(ov);
      setPdfGenerating(false);
    }
  }, [selectedTemplate, profileId, previewMode]);

  const sel = TEMPLATES.find(t=>t.id===selectedTemplate);

  return (
    <div style={{minHeight:'100vh',background:'#f7f7f5',fontFamily:'"DM Sans",-apple-system,sans-serif',color:'#1c1c1c'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .rt-card{transition:transform 0.28s cubic-bezier(0.22,1,0.36,1),box-shadow 0.28s ease;cursor:pointer;}
        .rt-card:hover{transform:translateY(-6px) scale(1.015);box-shadow:0 20px 50px rgba(0,0,0,0.12),0 6px 16px rgba(0,0,0,0.06);}
        .rt-cat{transition:all 0.2s ease;cursor:pointer;border:none;outline:none;white-space:nowrap;}
        .rt-cat:hover{background:#eceae6!important;}
        .rt-ov{opacity:0;transition:opacity 0.22s ease;}.rt-card:hover .rt-ov{opacity:1;}
        .rt-en{opacity:0;transform:translateY(16px);}
        .rt-vi{opacity:1;transform:translateY(0);transition:opacity 0.4s ease,transform 0.4s cubic-bezier(0.22,1,0.36,1);}
        .rt-b{transition:all 0.2s ease;cursor:pointer;border:none;outline:none;font-family:inherit;}
        .rt-b:hover{transform:scale(1.04);filter:brightness(1.08);}
        .rt-b:disabled{opacity:0.5;cursor:not-allowed;transform:none;filter:none;}
        .rt-s:focus{outline:none;border-color:#1c1c1c;box-shadow:0 0 0 3px rgba(28,28,28,0.06);}
      `}</style>

      <div style={{maxWidth:1240,margin:'0 auto',padding:'40px 32px 0'}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:16,marginBottom:28}}>
          <div>
            <h1 style={{fontSize:'2rem',fontWeight:800,margin:0,letterSpacing:'-0.03em'}}>Resume Templates</h1>
            <p style={{margin:'6px 0 0',fontSize:'0.95rem',color:'#7a7a72',fontWeight:500}}>{TEMPLATES.length} professional templates — pick one and make it yours</p>
          </div>
          <div style={{position:'relative',width:280}}>
            <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#b0b0a8',fontSize:16,pointerEvents:'none'}}>⌕</span>
            <input className="rt-s" type="text" placeholder="Search templates..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={{width:'100%',padding:'10px 14px 10px 36px',fontSize:'0.88rem',fontFamily:'inherit',border:'1.5px solid #e0deda',borderRadius:10,background:'#fff',color:'#1c1c1c',boxSizing:'border-box'}} />
          </div>
        </div>

        {infoMessage && <div style={{padding:'12px 18px',borderRadius:10,marginBottom:20,fontSize:'0.88rem',fontWeight:600,background:showError?'#fef2f2':'#ecfdf5',color:showError?'#991b1b':'#065f46',border:`1px solid ${showError?'#fecaca':'#a7f3d0'}`}}>{infoMessage}</div>}

        <div style={{display:'flex',gap:6,marginBottom:28,overflowX:'auto'}}>
          {CATEGORIES.map(cat=>{const a=activeCategory===cat.id;return(
            <button key={cat.id} className="rt-cat" onClick={()=>setActiveCategory(cat.id)} style={{padding:'8px 16px',fontSize:'0.84rem',fontWeight:a?700:500,fontFamily:'inherit',borderRadius:8,background:a?'#1c1c1c':'#edebe7',color:a?'#fff':'#5a5a52',display:'flex',alignItems:'center',gap:6}}>
              <span style={{fontSize:11}}>{cat.icon}</span>{cat.label}
            </button>
          );})}
        </div>
      </div>

      {sel && (
        <div style={{maxWidth:1240,margin:'0 auto 20px',padding:'0 32px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',background:'#1c1c1c',borderRadius:12,color:'#fff',flexWrap:'wrap',gap:12}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:36,height:36,borderRadius:8,background:sel.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'#fff',fontWeight:800}}>✓</div>
              <div><div style={{fontWeight:700,fontSize:'0.95rem'}}>{sel.name}</div><div style={{fontSize:'0.78rem',opacity:0.6}}>{sel.description}</div></div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="rt-b" disabled={isLoading} onClick={onPreview} style={{padding:'9px 22px',background:'#fff',color:'#1c1c1c',borderRadius:8,fontWeight:700,fontSize:'0.84rem'}}>{isLoading?'⏳ Loading...':'👁 Preview'}</button>
              <button className="rt-b" disabled={pdfGenerating} onClick={onDownload} style={{padding:'9px 22px',background:sel.accent,color:'#fff',borderRadius:8,fontWeight:700,fontSize:'0.84rem'}}>{pdfGenerating?'⏳ Generating...':'⬇ Download PDF'}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{maxWidth:1240,margin:'0 auto',padding:'0 32px 60px'}}>
        {filtered.length===0?(
          <div style={{textAlign:'center',padding:'60px 20px',color:'#a0a098'}}><div style={{fontSize:48,marginBottom:12}}>∅</div><div style={{fontSize:'1.1rem',fontWeight:600}}>No templates found</div></div>
        ):(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:20}}>
            {filtered.map((t,i)=>{const s=selectedTemplate===t.id;return(
              <div key={t.id} className={`rt-card ${animatedIds.has(t.id)?'rt-vi':'rt-en'}`} style={{background:'#fff',borderRadius:14,overflow:'hidden',border:s?`2.5px solid ${t.accent}`:'2.5px solid transparent',boxShadow:s?`0 0 0 3px ${t.accent}18,0 8px 24px rgba(0,0,0,0.08)`:'0 2px 8px rgba(0,0,0,0.04)',position:'relative',transitionDelay:`${i*40}ms`}} onClick={()=>setSelectedTemplate(t.id===selectedTemplate?'':t.id)}>
                <div style={{height:210,padding:10,background:'#fafaf8',position:'relative'}}>
                  <MiniResume template={t} />
                  <div className="rt-ov" style={{position:'absolute',inset:0,background:'rgba(28,28,28,0.55)',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(2px)'}}>
                    <div style={{padding:'10px 24px',background:'#fff',color:'#1c1c1c',borderRadius:8,fontWeight:700,fontSize:'0.84rem',boxShadow:'0 4px 16px rgba(0,0,0,0.15)'}}>{s?'✓ Selected':'Use Template'}</div>
                  </div>
                  {t.premium&&<div style={{position:'absolute',top:16,right:16,fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',padding:'3px 8px',borderRadius:4,background:'#f5c518',color:'#1c1c1c'}}>PRO</div>}
                  {s&&<div style={{position:'absolute',top:16,left:16,width:24,height:24,borderRadius:'50%',background:t.accent,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:13,fontWeight:800,boxShadow:'0 2px 8px rgba(0,0,0,0.2)'}}>✓</div>}
                </div>
                <div style={{padding:'12px 14px 14px'}}>
                  <div style={{fontWeight:700,fontSize:'0.88rem',marginBottom:2}}>{t.name}</div>
                  <div style={{fontSize:'0.76rem',color:'#9a9a92',fontWeight:500}}>{t.description}</div>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginTop:8}}>
                    <div style={{width:14,height:14,borderRadius:4,background:t.accent}} />
                    <div style={{width:14,height:14,borderRadius:4,background:t.secondary,opacity:0.6}} />
                    <span style={{fontSize:'0.7rem',color:'#b0b0a8',textTransform:'capitalize'}}>{t.category}</span>
                  </div>
                </div>
              </div>
            );})}
          </div>
        )}
      </div>

      {/* CV Preview Panel */}
      {previewMode && previewData && (
        <div style={{maxWidth:1240,margin:'0 auto',padding:'0 32px 60px'}}>
          <div style={{padding:'2rem',background:'#fff',borderRadius:16,border:'1px solid #e4e4e7',boxShadow:'0 8px 30px rgba(0,0,0,0.06)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <div>
                <h2 style={{margin:0,fontSize:'1.3rem',fontWeight:700}}>CV Preview — {sel?.name||selectedTemplate}</h2>
                <p style={{margin:'4px 0 0',fontSize:'0.85rem',color:'#9a9a92'}}>Review your resume before downloading</p>
              </div>
              <button className="rt-b" onClick={()=>{setPreviewMode(false);setPreviewData(null);}} style={{padding:'8px 20px',background:'#f4f4f5',color:'#3f3f46',borderRadius:8,fontWeight:600,fontSize:'0.84rem'}}>✕ Close</button>
            </div>
            <div id="cv-document" ref={pdfRenderRef} style={{background:'#fff',maxWidth:900,margin:'0 auto',boxShadow:'0 4px 20px rgba(0,0,0,0.08)',borderRadius:8,overflow:'hidden'}}>
              <PreviewContent data={previewData} templateId={selectedTemplate} />
            </div>
            <div style={{display:'flex',justifyContent:'center',gap:12,marginTop:20}}>
              <button className="rt-b" disabled={pdfGenerating} onClick={onDownload} style={{padding:'12px 28px',background:sel?.accent||'#1c1c1c',color:'#fff',borderRadius:10,fontWeight:700,fontSize:'0.9rem'}}>{pdfGenerating?'⏳ Generating...':'⬇ Download PDF'}</button>
              <button className="rt-b" onClick={()=>window.print()} style={{padding:'12px 28px',background:'#f4f4f5',color:'#3f3f46',borderRadius:10,fontWeight:700,fontSize:'0.9rem'}}>🖨 Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeTemplates;