import React, { useState } from 'react';
import './AICVFilter.css';
import CVPreview from './CVPreview';

function AICVFilter() {
  const [criteria, setCriteria] = useState({
    skills: '',
    degrees: 'Software Engineering, Computer Science, IT',
    keywords: '',
    minGpa: ''
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [viewingCvFor, setViewingCvFor] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [hasScanned, setHasScanned] = useState(false);

  // Sanitizer: Allows letters, numbers, spaces, commas, dots, dashes, plus, and hash. Strips all other special chars.
  const handleInputChange = (field, value) => {
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s,\.\-\+#]/g, '');
    setCriteria({...criteria, [field]: sanitizedValue});
    if (fieldErrors[field]) {
      setFieldErrors({...fieldErrors, [field]: null});
    }
  };

  const calculateScore = (student, parsedCriteria) => {
    let marks = {
      skills: 0,
      gpa: 0,
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
        if (ratio >= 0.8) marks.skills = 35;        // Exact / High match
        else if (ratio >= 0.4) marks.skills = 20;   // Related / Medium marks
        else if (ratio > 0) marks.skills = 8;       // Low match
        else marks.skills = 0;                      // No match
      } else {
        marks.skills = 35;
      }
    } else {
      marks.skills = 35; // Default full if no skills requested
    }

    // 1.5 GPA Ranking (0 - 10)
    const studentGpa = parseFloat(student.gpa);
    if (!isNaN(studentGpa)) {
      if (studentGpa >= 3.8) marks.gpa = 10;
      else if (studentGpa >= 3.5) marks.gpa = 8;
      else if (studentGpa >= 3.0) marks.gpa = 5;
      else if (studentGpa >= 2.5) marks.gpa = 3;
      else marks.gpa = 0;
    } else {
      marks.gpa = 0;
    }

    // 2. Education (0 - 15)
    const studentDegrees = (student.education || []).map(e => e.degree.toLowerCase().trim());
    if (parsedCriteria.degrees.length > 0) {
      let bestEduMark = 0;
      studentDegrees.forEach(deg => {
        parsedCriteria.degrees.forEach(reqDeg => {
          const rd = reqDeg.toLowerCase().trim();
          if (rd && (deg.includes(rd) || rd.includes(deg))) {
            bestEduMark = Math.max(bestEduMark, 10); // Highly relevant
          } else if (deg.includes('engineering') || deg.includes('science') || deg.includes('technology') || deg.includes('computing') || deg.includes('it')) {
            bestEduMark = Math.max(bestEduMark, 7); // Related field
          } else {
            bestEduMark = Math.max(bestEduMark, 4);  // Non-related
          }
        });
      });
      marks.education = bestEduMark;
    } else {
      // No specific degree requested
      if (studentDegrees.some(d => d.includes('software') || d.includes('computer') || d.includes('it') || d.includes('information'))) {
        marks.education = 10;
      } else if (studentDegrees.length > 0) {
        marks.education = 7;
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
    marks.total = marks.skills + marks.gpa + marks.education + marks.experience + marks.certs + marks.quality + marks.keywords;
    return marks;
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Field-level Validation
    let hasError = false;
    let newFieldErrors = {};

    if (!criteria.skills || !criteria.skills.trim()) {
      newFieldErrors.skills = 'Skills are required for ranking.';
      hasError = true;
    }

    if (!criteria.degrees || !criteria.degrees.trim()) {
      newFieldErrors.degrees = 'Target degree/field is required.';
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newFieldErrors);
      setError('Please resolve the missing required fields to analyze candidates.');
      return;
    }

    // Parse criteria into arrays
    const parsedCriteria = {
      skills: criteria.skills.split(',').map(s => s.trim()).filter(s => s),
      degrees: criteria.degrees.split(',').map(s => s.trim()).filter(s => s),
      keywords: criteria.keywords.split(',').map(s => s.trim()).filter(s => s)
    };

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/users/students');
      const data = await res.json();
      if (res.ok) {
        // Run AI Algorithm perfectly mapped to user prompt logic
        const minGpa = parseFloat(criteria.minGpa);
        const filteredData = data.filter(student => {
          if (!isNaN(minGpa)) {
            const studentGpa = parseFloat(student.gpa);
            if (isNaN(studentGpa) || studentGpa < minGpa) return false;
          }
          return true;
        });

        const scoredStudents = filteredData.map(student => {
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
      setHasScanned(true);
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
      <div className="welcome-banner admin-banner">
        <div className="welcome-text">
           <h1>🤖 AI CV Filter & ATS Ranking</h1>
           <p>Automatically rank student profiles against your specific job requirements using our 6-factor AI heuristic engine.</p>
        </div>
      </div>

      <div className="ai-stack-modern">
        {/* Top: Filter Form */}
        <div className="filter-bar-section">
           <div className="section-card">
             <h2 style={{margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 800}}>Job Criteria</h2>
             <form onSubmit={handleScan} className="modern-filter-form">
                <div className="filter-inputs-col">
                  <div className="form-group">
                    <label>1. Required Skills <span style={{color: '#ef4444'}}>*</span></label>
                    <p className="hint">Comma separated (e.g. Java, React)</p>
                    <input 
                      type="text" 
                      className={fieldErrors.skills ? 'input-error' : ''}
                      placeholder="e.g. Java, React, SQL, C#" 
                      value={criteria.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                    />
                    {fieldErrors.skills && <span className="error-text">{fieldErrors.skills}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>2. Required Degree / Field <span style={{color: '#ef4444'}}>*</span></label>
                    <p className="hint">Matches field of study (e.g. Software)</p>
                    <input 
                      type="text" 
                      className={fieldErrors.degrees ? 'input-error' : ''}
                      placeholder="e.g. Software Engineering" 
                      value={criteria.degrees}
                      onChange={(e) => handleInputChange('degrees', e.target.value)}
                    />
                    {fieldErrors.degrees && <span className="error-text">{fieldErrors.degrees}</span>}
                  </div>

                  <div className="form-group">
                    <label>3. Search Keywords (Optional)</label>
                    <p className="hint">Specific ATS buzzwords (e.g. Agile)</p>
                    <input 
                      type="text" 
                      placeholder="e.g. Agile, SpringBoot, AWS" 
                      value={criteria.keywords}
                      onChange={(e) => handleInputChange('keywords', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>4. Minimum GPA Requirement (Optional)</label>
                    <p className="hint">Only show candidates above this GPA</p>
                    <input 
                      type="number" 
                      placeholder="e.g. 3.5" 
                      step="0.01"
                      min="0"
                      max="4.0"
                      value={criteria.minGpa}
                      onChange={(e) => handleInputChange('minGpa', e.target.value)}
                    />
                  </div>
                </div>

                <div className="filter-actions-row">
                  <button type="submit" className="btn-scan-wide" disabled={loading} style={{width: '100%'}}>
                    {loading ? 'Running AI Scan...' : '🔍 Scan Database'}
                  </button>
                </div>
             </form>
           </div>
        </div>

        {/* Bottom: Ranked Results */}
        <div className="filter-results-section">
           <div className="section-card">
              <div className="card-header">
                <h2 style={{fontSize: '1.25rem', fontWeight: 800}}>Ranked Candidates</h2>
                {results.length > 0 && <span className="badge-admin" style={{fontSize: '0.85rem'}}>Found: {results.length}</span>}
              </div>
              
              {error && <div className="alert-item warning " style={{marginBottom: '1rem'}}><div className="alert-info"><h4>Error</h4><p>{error}</p></div></div>}
              
              {!loading && results.length === 0 && !error && (
                <div className="empty-state" style={{padding: '3rem', textAlign: 'center', color: '#64748b'}}>
                  {hasScanned 
                    ? "No candidates match your current criteria and GPA requirement. Try broadening your search." 
                    : "Configure criteria in the left panel and run a scan to rank tracking applicants."}
                </div>
              )}

              {loading && <div className="manage-loading" style={{padding: '3rem', textAlign: 'center'}}>Extracting and ranking ATS profiles...</div>}

              {!loading && results.length > 0 && (
                <div className="results-list-modern">
                  {results.map((student, index) => {
                    const initials = student.fullName ? student.fullName.charAt(0) : 'S';
                    const score = student.scoreBreakdown.total;
                  
                  let badgeClass = 'score-poor';
                  if (score >= 90) badgeClass = 'score-master';
                  else if (score >= 75) badgeClass = 'score-great';
                  else if (score >= 50) badgeClass = 'score-good';

                  return (
                    <div key={student._id} className="result-card-modern">
                      <div className="result-header-modern" onClick={() => toggleRow(student._id)}>
                        <div className="rank-pill">#{index + 1}</div>
                        <div className="cand-avatar bg-blue">{initials}</div>
                        
                        <div className="cand-info-modern">
                          <div className="cand-name-modern">{student.fullName || student.email}</div>
                          <div className="cand-uni-modern">{student.university || 'No University Listed'}</div>
                        </div>
                        
                        <div className="score-cluster">
                           <span className={`modern-badge ${badgeClass}`}>{score} / 100 ATS</span>
                           <span className="expand-chevron">{expandedRow === student._id ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      
                      {expandedRow === student._id && (
                        <div className="result-details-modern">
                          <div className="score-breakdown-modern">
                            <h4>AI Evaluation Breakdown</h4>
                            <div className="breakdown-grid-modern">
                              <div className="bk-item-modern">
                                <span>Skills Match</span>
                                <strong>{student.scoreBreakdown.skills} <small style={{fontSize:'0.8rem', color:'#64748b'}}>/35</small></strong>
                              </div>
                              <div className="bk-item-modern">
                                <span>GPA Ranking</span>
                                <strong>{student.scoreBreakdown.gpa} <small style={{fontSize:'0.8rem', color:'#64748b'}}>/10</small></strong>
                              </div>
                              <div className="bk-item-modern">
                                <span>Education</span>
                                <strong>{student.scoreBreakdown.education} <small style={{fontSize:'0.8rem', color:'#64748b'}}>/10</small></strong>
                              </div>
                              <div className="bk-item-modern">
                                <span>Experience</span>
                                <strong>{student.scoreBreakdown.experience} <small style={{fontSize:'0.8rem', color:'#64748b'}}>/20</small></strong>
                              </div>
                              <div className="bk-item-modern">
                                <span>Certificates</span>
                                <strong>{student.scoreBreakdown.certs} <small style={{fontSize:'0.8rem', color:'#64748b'}}>/10</small></strong>
                              </div>
                              <div className="bk-item-modern">
                                <span>CV Quality</span>
                                <strong>{student.scoreBreakdown.quality} <small style={{fontSize:'0.8rem', color:'#64748b'}}>/10</small></strong>
                              </div>
                              <div className="bk-item-modern">
                                <span>ATS Keywords</span>
                                <strong>{student.scoreBreakdown.keywords} <small style={{fontSize:'0.8rem', color:'#64748b'}}>/5</small></strong>
                              </div>
                            </div>
                          </div>
                          <div className="result-actions-modern">
                            <button className="btn-view-cv-modern" onClick={() => setViewingCvFor(student._id)}>
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
