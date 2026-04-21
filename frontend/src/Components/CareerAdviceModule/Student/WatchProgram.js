import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useStudent } from '../../../context/CareerAdviceModule/StudentContext';
import { generateCertificate } from '../../../utils/CareerAdviceModule/generateCertificate';

const getYoutubeEmbed = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const catColors = {
  Leadership: '#1a56db', 'Soft Skills': '#8b5cf6', Communication: '#06b6d4',
  'Team Management': '#f59e0b', 'Problem Solving': '#10b981',
  Programming: '#7c3aed', Database: '#0891b2', 'Web Development': '#1a56db',
  'Mobile Development': '#059669', 'Cloud & DevOps': '#ea580c',
  'Data Science': '#db2777', Cybersecurity: '#dc2626', 'UI/UX Design': '#d97706'
};

const WatchProgram = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const programType = searchParams.get('type') || 'Leadership';
  const navigate = useNavigate();
  const { student } = useStudent();

  const [program, setProgram] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(0);
  const [watchTimer, setWatchTimer] = useState(20);
  const [canMarkWatched, setCanMarkWatched] = useState(false);

  // Note System
  const [currentNote, setCurrentNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const apiBase = programType === 'TechnicalResource' ? '/api/technical' : '/api/leadership';

  // Fetch program details
  useEffect(() => {
    axios.get(`${apiBase}/${id}`)
      .then(res => setProgram(res.data.data))
      .catch(() => { toast.error('Failed to load program'); navigate(-1); })
      .finally(() => setLoading(false));
  }, [id, apiBase, navigate]);

  // Fetch enrollment for student
  useEffect(() => {
    if (student?.email) {
      axios.get(`/api/enrollments/student/${student.email}`)
        .then(res => {
          const found = res.data.data.find(e => e.programId?._id === id || e.programId === id);
          setEnrollment(found || null);
        })
        .catch(() => setEnrollment(null));
    }
  }, [student, id]);

  // 20-second watch timer
  useEffect(() => {
    setCanMarkWatched(false);
    setWatchTimer(20);
    const interval = setInterval(() => {
      setWatchTimer(prev => {
        if (prev <= 1) { clearInterval(interval); setCanMarkWatched(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeVideo]);

  // Load note for active video
  useEffect(() => {
    if (enrollment?.notes) {
      const noteObj = enrollment.notes.find(n => n.videoIndex === activeVideo);
      setCurrentNote(noteObj ? noteObj.text : '');
    } else {
      setCurrentNote('');
    }
  }, [activeVideo, enrollment]);

  const markVideoWatched = async (videoIndex) => {
    if (!enrollment || enrollment.watchedVideos?.includes(videoIndex)) return;
    try {
      const res = await axios.patch(`/api/enrollments/${enrollment._id}/watch`, { videoIndex });
      setEnrollment(res.data.data);
    } catch { /* silent */ }
  };

  const markComplete = async () => {
    if (!enrollment) return;
    try {
      const res = await axios.patch(`/api/enrollments/${enrollment._id}/complete`);
      setEnrollment(res.data.data);
      toast.success('🎓 Program completed! Certificate is ready.');
    } catch { toast.error('Failed to update'); }
  };

  const downloadCertificate = () => {
    generateCertificate({
      studentName: student?.name && student.name !== 'Student' ? student.name : (student?.email?.split('@')[0] || 'Student'),
      programTitle: program.title,
      category: program.category,
      instructor: program.instructor,
      completedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    });
  };

  const saveNote = useCallback(async () => {
    if (!enrollment) return;
    setSavingNote(true);
    setNoteSaved(false);
    try {
      const res = await axios.patch(`/api/enrollments/${enrollment._id}/note`, {
        videoIndex: activeVideo,
        text: currentNote
      });
      setEnrollment(res.data.data);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    } catch {
      toast.error('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  }, [enrollment, activeVideo, currentNote]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!program) return null;

  const watchedCount = enrollment?.watchedVideos?.length || 0;
  const totalVideos = program.videos?.length || 0;
  const progressPct = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
  const accentColor = catColors[program.category] || '#1a56db';
  const currentVideo = program.videos?.[activeVideo];
  const isWatched = enrollment?.watchedVideos?.includes(activeVideo);

  return (
    <div className="page-container fade-in" style={{ padding: 0, height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Top Bar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button
          onClick={() => navigate(-1)}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.transform = 'translateX(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.35)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#4f46e5';
            e.currentTarget.style.borderColor = '#e0e7ff';
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(99,102,241,0.1)';
          }}
          style={{
            background: 'white',
            border: '1.5px solid #e0e7ff',
            padding: '8px 18px',
            borderRadius: 50,
            cursor: 'pointer',
            color: '#4f46e5',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            boxShadow: '0 2px 6px rgba(99,102,241,0.1)',
            transition: 'all 0.25s ease',
          }}
        >
          ← Back
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {program.title}
          </h2>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--gray)' }}>
            👨‍🏫 {program.instructor} · ⏱ {program.duration}
          </p>
        </div>

        {/* Progress bar in top bar */}
        {enrollment && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 130, background: '#e2e8f0', borderRadius: 50, height: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: progressPct === 100 ? 'var(--success)' : accentColor, borderRadius: 50, transition: 'width 0.4s ease' }} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: progressPct === 100 ? 'var(--success)' : accentColor }}>
              {progressPct}%
            </span>
            {progressPct === 100 && !enrollment.isCompleted && (
              <button className="btn btn-success btn-sm" onClick={markComplete}>🎓 Complete</button>
            )}
            {enrollment.isCompleted && (
              <>
                <span className="badge badge-success">✅ Completed</span>
                <button className="btn btn-sm" style={{ background: 'linear-gradient(135deg, #d4af37, #f0d060)', color: '#1a1a00', fontWeight: 700, border: 'none' }} onClick={downloadCertificate}>
                  🏅 Certificate
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', flex: 1, overflow: 'hidden' }}>

        {/* Left - Video + Notes */}
        <div style={{ overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Video Player */}
          {currentVideo && (
            <>
              {getYoutubeEmbed(currentVideo.url) ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 14, overflow: 'hidden', background: '#000', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
                  <iframe
                    src={getYoutubeEmbed(currentVideo.url)}
                    title={currentVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />
                </div>
              ) : (
                <div style={{ background: '#1e293b', borderRadius: 14, padding: '60px 20px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎬</div>
                  <a href={currentVideo.url} target="_blank" rel="noreferrer" className="btn btn-accent btn-lg" style={{ display: 'inline-flex', textDecoration: 'none' }}>▶ Open Video</a>
                </div>
              )}

              {/* Video Title & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'white', padding: '16px 20px', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, marginBottom: 4 }}>{currentVideo.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray)', margin: 0 }}>
                    Video {activeVideo + 1} of {program.videos.length}
                    {currentVideo.url && (
                      <> · <a href={currentVideo.url} target="_blank" rel="noreferrer" style={{ color: accentColor, textDecoration: 'none' }}>🔗 Open in new tab →</a></>
                    )}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {enrollment && !isWatched && canMarkWatched && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => markVideoWatched(activeVideo)}
                      style={{ animation: 'fadeIn 0.4s ease' }}
                    >
                      ✅ Mark as Watched
                    </button>
                  )}
                  {enrollment && !isWatched && !canMarkWatched && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--gray)', background: 'var(--light-gray)', padding: '6px 12px', borderRadius: 50 }}>
                      ⏳ {watchTimer}s
                    </span>
                  )}
                  {isWatched && (
                    <span style={{ background: '#d1fae5', color: '#059669', padding: '6px 14px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 700 }}>
                      ✅ Watched
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={activeVideo === 0}
                  onClick={() => setActiveVideo(v => v - 1)}
                >
                  ← Previous
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, background: accentColor, borderColor: accentColor }}
                  disabled={activeVideo === totalVideos - 1}
                  onClick={() => setActiveVideo(v => v + 1)}
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {/* Notes Section */}
          {enrollment ? (
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>📝 My Notes — Video {activeVideo + 1}</h4>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {savingNote ? (
                    <span style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>Saving...</span>
                  ) : noteSaved ? (
                    <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>✅ Saved</span>
                  ) : null}
                  <button
                    onClick={saveNote}
                    style={{ background: accentColor, color: 'white', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Save
                  </button>
                </div>
              </div>
              <textarea
                className="form-control"
                rows="6"
                placeholder="Write your personal notes, key takeaways or important points for this video..."
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                onBlur={saveNote}
                style={{ resize: 'vertical', fontSize: '0.88rem', lineHeight: 1.7, background: '#fafafa' }}
              />
            </div>
          ) : (
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <p style={{ margin: 0, color: '#92400e', fontSize: '0.88rem' }}>
                ⚠️ You are not enrolled. Go back and enroll to track progress and save notes.
              </p>
            </div>
          )}

          {/* Description */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10 }}>📋 About this Program</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--dark-3)', lineHeight: 1.8, margin: 0 }}>{program.description}</p>
            {program.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
                {program.tags.map(t => (
                  <span key={t} style={{ background: 'var(--primary-light)', color: accentColor, padding: '3px 10px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Playlist Sidebar */}
        <div style={{ borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--light-gray)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', background: 'white', flexShrink: 0 }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>📋 Course Playlist</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--gray)' }}>
              {watchedCount}/{totalVideos} videos watched
            </p>
            {/* Mini progress */}
            <div style={{ marginTop: 8, background: '#e2e8f0', borderRadius: 50, height: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: progressPct === 100 ? 'var(--success)' : accentColor, borderRadius: 50, transition: 'width 0.4s ease' }} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {program.videos?.map((v, i) => {
              const watched = enrollment?.watchedVideos?.includes(i);
              const active = activeVideo === i;
              return (
                <div
                  key={i}
                  onClick={() => setActiveVideo(i)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 16px',
                    cursor: 'pointer',
                    background: active ? 'white' : 'transparent',
                    borderLeft: active ? `3px solid ${accentColor}` : '3px solid transparent',
                    borderBottom: '1px solid var(--border)',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f1f5f9'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: watched ? 'var(--success)' : active ? accentColor : '#e2e8f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', color: (watched || active) ? 'white' : 'var(--gray)', fontWeight: 700
                  }}>
                    {watched ? '✓' : active ? '▶' : i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '0.82rem', fontWeight: active ? 700 : 400,
                      color: active ? 'var(--dark)' : 'var(--dark-3)',
                      margin: 0, lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {v.title}
                    </p>
                    {watched && <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600 }}>Watched</span>}
                    {enrollment?.notes?.find(n => n.videoIndex === i && n.text?.trim()) && (
                      <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600 }}>📝 Has notes</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchProgram;
