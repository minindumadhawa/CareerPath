import React, { useState } from 'react';
import './AICVFilter.css';
import CVPreview from './CVPreview';

function AICVFilter() {
  const [criteria, setCriteria] = useState({
    skills: '',
    degrees: 'Software Engineering, Computer Science, IT',
    keywords: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [viewingCvFor, setViewingCvFor] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const calculateScore = (student, parsedCriteria) => {
    let marks = {
      skills: 0,
      education: 0,
      experience: 0,
      certs: 0,
      quality: 0,
      keywords: 0,
      total: 0
    };

    // 1. Skills Matching (0 - 40)
    if (parsedCriteria.skills.length > 0) {
      const studentSkills = [...(student.technicalSkills || []), ...(student.softSkills || [])]
        .map(s => s.toLowerCase().trim());
      let matchCount = 0;
      parsedCriteria.skills.forEach(reqSkill => {
        const rs = reqSkill.toLowerCase().trim();
        if (rs && studentSkills.some(s => s.includes(rs) || rs.includes(s))) {
          matchCount++;
        }
      });
      // Ratio
      const validReqCount = parsedCriteria.skills.filter(s => s.trim()).length;
      if (validReqCount > 0) {
        const ratio = matchCount / validReqCount;
        if (ratio >= 0.8) marks.skills = 40;        // Exact / High match
        else if (ratio >= 0.4) marks.skills = 25;   // Related / Medium marks
        else if (ratio > 0) marks.skills = 10;      // Low match
        else marks.skills = 0;                      // No match
      } else {
        marks.skills = 40;
      }
    } else {
      marks.skills = 40; // Default full if no skills requested
    }

    // 2. Education (0 - 15)
    const studentDegrees = (student.education || []).map(e => e.degree.toLowerCase().trim());
    if (parsedCriteria.degrees.length > 0) {
      let bestEduMark = 0;
      studentDegrees.forEach(deg => {
        parsedCriteria.degrees.forEach(reqDeg => {
          const rd = reqDeg.toLowerCase().trim();
          if (rd && (deg.includes(rd) || rd.includes(deg))) {
            bestEduMark = Math.max(bestEduMark, 15); // Highly relevant
          } else if (deg.includes('engineering') || deg.includes('science') || deg.includes('technology') || deg.includes('computing') || deg.includes('it')) {
            bestEduMark = Math.max(bestEduMark, 10); // Related field
          } else {
            bestEduMark = Math.max(bestEduMark, 5);  // Non-related
          }
        });
      });
      marks.education = bestEduMark;
    } else {
      // No specific degree requested
      if (studentDegrees.some(d => d.includes('software') || d.includes('computer') || d.includes('it') || d.includes('information'))) {
        marks.education = 15;
      } else if (studentDegrees.length > 0) {
        marks.education = 10;
      } else {
         marks.education = 0;
      }
    }

    // 3. Experience / Projects (0 - 20)
    const workExp = student.workExperience || [];
    const projects = student.projects || [];
    if (workExp.length > 0) {
      marks.experience = 20; // Internship or real projects
    } else if (projects.length >= 2) {
      marks.experience = 15; // University projects
    } else if (projects.length === 1) {
      marks.experience = 10; // Basic uni project
    } else {
      marks.experience = 5;  // Barely any experience
    }

    // 4. Certifications & Courses (0 - 10)
    const certs = student.certifications || [];
    if (certs.length >= 2) {
      marks.certs = 10; // Multiple industry certs
    } else if (certs.length === 1) {
      marks.certs = 8; // Online courses/1 cert
    } else {
      marks.certs = 3; // None
    }

    // 5. CV Quality & Structure (0 - 10)
    let qualityPts = 0;
    if (student.summary && student.summary.length > 20) qualityPts += 3;
    if (student.education && student.education.length > 0) qualityPts += 3;
    if (student.technicalSkills && student.technicalSkills.length > 0) qualityPts += 2;
    if (projects.length > 0 || workExp.length > 0) qualityPts += 2;
    // Map to 10 (well-structured), 8 (average), 5 (poor)
    if (qualityPts === 10) marks.quality = 10;
    else if (qualityPts >= 7) marks.quality = 8;
    else marks.quality = 5;

    // 6. Keywords & ATS (0 - 5)
    if (parsedCriteria.keywords.length > 0) {
      const fullText = JSON.stringify(student).toLowerCase();
      let keywordHits = 0;
      parsedCriteria.keywords.forEach(kw => {
        if (kw.trim() && fullText.includes(kw.toLowerCase().trim())) {
          keywordHits++;
        }
      });
      const validKwCount = parsedCriteria.keywords.filter(k => k.trim()).length;
      if (validKwCount > 0) {
        const kwRatio = keywordHits / validKwCount;
        if (kwRatio >= 0.8) marks.keywords = 5;      // Strong match
        else if (kwRatio >= 0.4) marks.keywords = 3; // Medium match
        else if (kwRatio > 0) marks.keywords = 1;    // Low match
        else marks.keywords = 0;
      } else {
        marks.keywords = 5;
      }
    } else {
      marks.keywords = 5; // Default full if none requested
    }

    // Total
    marks.total = marks.skills + marks.education + marks.experience + marks.certs + marks.quality + marks.keywords;
    return marks;
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Parse criteria into arrays
    const parsedCriteria = {
      skills: criteria.skills.split(',').map(s => s.trim()).filter(s => s),
      degrees: criteria.degrees.split(',').map(s => s.trim()).filter(s => s),
      keywords: criteria.keywords.split(',').map(s => s.trim()).filter(s => s)
    };

    try {
      const res = await fetch('http://localhost:5000/api/users/students');
      const data = await res.json();
      if (res.ok) {
        // Run AI Algorithm perfectly mapped to user prompt logic
        const scoredStudents = data.map(student => {
          const scoreBreakdown = calculateScore(student, parsedCriteria);
          return {
            ...student,
            scoreBreakdown
          };
        });

        // Sort by total score descending
        scoredStudents.sort((a, b) => b.scoreBreakdown.total - a.scoreBreakdown.total);
        setResults(scoredStudents);
      } else {
        setError(data.message || 'Error fetching students');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  if (viewingCvFor) {
    return (
      <div className="manage-students-container">
        <div className="section-card">
          <div className="card-header">
            <h2>Applicant CV View</h2>
            <button className="btn-back" onClick={() => setViewingCvFor(null)}>← Back to Filter Results</button>
          </div>
          <CVPreview studentId={viewingCvFor} />
        </div>
      </div>
    );
  }

  return (
    <div className="ai-filter-container">
      <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="welcome-text">
           <h1>🤖 AI CV Filter & ATS Ranking</h1>
           <p>Automatically rank student profiles against your specific job requirements using our 6-factor AI heuristic engine.</p>
        </div>
      </div>

      <div className="dashboard-grid ai-grid">
        {/* Left Column: Filter Form */}
        <div className="filter-form-section">
           <div className="section-card">
             <h2>Job Criteria Configuration</h2>
             <form onSubmit={handleScan} className="filter-form">
                <div className="form-group">
                  <label>1. Required Skills (Comma separated)</label>
                  <p className="hint">Scores highly if candidates have exact or related technical/soft skills.</p>
                  <input 
                    type="text" 
                    placeholder="e.g. Java, React, SQL, Problem Solving" 
                    value={criteria.skills}
                    onChange={(e) => setCriteria({...criteria, skills: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>2. Required Degree / Field (Comma separated)</label>
                  <p className="hint">Scores highly for exact degree matches (e.g. Software Engineering).</p>
                  <input 
                    type="text" 
                    placeholder="e.g. Software Engineering, Computer Science, IT" 
                    value={criteria.degrees}
                    onChange={(e) => setCriteria({...criteria, degrees: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>3. Search Keywords & ATS Match (Comma separated)</label>
                  <p className="hint">Scans the entire candidate profile for these specific buzzwords.</p>
                  <input 
                    type="text" 
                    placeholder="e.g. Agile, SpringBoot, AWS, Communication" 
                    value={criteria.keywords}
                    onChange={(e) => setCriteria({...criteria, keywords: e.target.value})}
                  />
                </div>

                <button type="submit" className="btn-scan" disabled={loading}>
                  {loading ? 'Scanning Base...' : '🔍 Run AI CV Scan'}
                </button>
             </form>
           </div>
        </div>

        {/* Right Column: Ranked Results */}
        <div className="filter-results-section">
           <div className="section-card">
              <div className="card-header">
                <h2>Ranked Candidates</h2>
                {results.length > 0 && <span className="badge-count">Found: {results.length}</span>}
              </div>
              
              {error && <div className="error-alert">{error}</div>}
              
              {!loading && results.length === 0 && !error && (
                <div className="empty-state">
                  Configure criteria and run a scan to rank tracking applicants.
                </div>
              )}

              {loading && <div className="manage-loading">Running AI Algorithms...</div>}

              {!loading && results.length > 0 && (
                <div className="results-list">
                  {results.map((student, index) => {
                    const initials = student.fullName ? student.fullName.charAt(0) : 'S';
                    const score = student.scoreBreakdown.total;
                    let badgeColor = 'score-low';
                    if (score >= 80) badgeColor = 'score-high';
                    else if (score >= 50) badgeColor = 'score-med';

                    return (
                      <div key={student._id} className="result-card">
                        <div className="result-header" onClick={() => toggleRow(student._id)}>
                          <div className="rank-number">#{index + 1}</div>
                          <div className="cand-avatar bg-indigo">{initials}</div>
                          <div className="cand-info">
                            <div className="cand-name">{student.fullName || student.email}</div>
                            <div className="cand-uni">{student.university || 'No University Listed'}</div>
                          </div>
                          <div className="cand-score">
                             <span className={`score-badge ${badgeColor}`}>{score} / 100</span>
                             <span className="expand-icon">{expandedRow === student._id ? '▲' : '▼'}</span>
                          </div>
                        </div>
                        
                        {expandedRow === student._id && (
                          <div className="result-details">
                            <div className="score-breakdown">
                              <h4>AI Evaluation Breakdown</h4>
                              <div className="breakdown-grid">
                                <div className="bk-item">
                                  <span>Skills Match (40)</span>
                                  <strong>{student.scoreBreakdown.skills} pts</strong>
                                </div>
                                <div className="bk-item">
                                  <span>Education (15)</span>
                                  <strong>{student.scoreBreakdown.education} pts</strong>
                                </div>
                                <div className="bk-item">
                                  <span>Experience/Projects (20)</span>
                                  <strong>{student.scoreBreakdown.experience} pts</strong>
                                </div>
                                <div className="bk-item">
                                  <span>Certifications (10)</span>
                                  <strong>{student.scoreBreakdown.certs} pts</strong>
                                </div>
                                <div className="bk-item">
                                  <span>CV Structure (10)</span>
                                  <strong>{student.scoreBreakdown.quality} pts</strong>
                                </div>
                                <div className="bk-item">
                                  <span>Keywords & ATS (5)</span>
                                  <strong>{student.scoreBreakdown.keywords} pts</strong>
                                </div>
                              </div>
                            </div>
                            <div className="result-actions">
                              <button className="btn-table btn-view-cv" onClick={() => setViewingCvFor(student._id)}>
                                View Full ATS CV
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

export default AICVFilter;
