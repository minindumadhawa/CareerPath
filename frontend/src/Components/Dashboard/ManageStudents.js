import React, { useState, useEffect } from 'react';
import './ManageStudents.css';
import CVPreview from './CVPreview';

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewingCvFor, setViewingCvFor] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/users/students');
      const data = await res.json();
      if (res.ok) {
        setStudents(data);
      } else {
        setError(data.message || 'Error fetching students');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student account? This action cannot be undone.')) {
      try {
        const res = await fetch(`http://localhost:5001/api/users/students/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchStudents(); // refresh list
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to delete student');
        }
      } catch (err) {
        alert('Network error while deleting');
      }
    }
  };

  if (loading) return <div className="manage-loading">Loading students...</div>;
  if (error) return <div className="error-alert">{error}</div>;

  if (viewingCvFor) {
    return (
      <div className="manage-students-container cv-view-active">
        <div className="section-card cv-preview-card">
          <div className="card-header no-print">
            <button className="btn-back" onClick={() => setViewingCvFor(null)}>← Back to Student List</button>
            <h2>Student Resume</h2>
          </div>
          <CVPreview studentId={viewingCvFor} readOnly={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="manage-students-container">
      <div className="section-card">
        <div className="card-header">
          <h2>Manage Students</h2>
          <span className="badge-count">Total: {students.length}</span>
        </div>
        
        <div className="table-responsive">
          <table className="data-table admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>University</th>
                <th>Location</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">No students registered yet.</td>
                </tr>
              ) : (
                students.map((student, index) => {
                  const initial = student.fullName ? student.fullName.charAt(0).toUpperCase() : student.email.charAt(0).toUpperCase();
                  const avatarColors = ['bg-blue', 'bg-teal', 'bg-purple', 'bg-green'];
                  const colorClass = avatarColors[index % avatarColors.length];
                  
                  return (
                    <tr key={student._id}>
                      <td>
                        <div className="entity-cell">
                          <div className={`cand-avatar ${colorClass}`}>
                            {initial}
                          </div>
                          <div>
                            <div className="entity-name">{student.email}</div>
                            <div className="entity-sub">{student.fullName || 'No Name Provided'}</div>
                          </div>
                        </div>
                      </td>
                      <td>{student.university || '-'}</td>
                      <td>{student.location || '-'}</td>
                      <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn-table btn-view-cv" onClick={() => setViewingCvFor(student._id)}>
                          View CV
                        </button>
                        <button className="btn-table btn-delete" onClick={() => handleDelete(student._id)} style={{ marginLeft: '8px' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageStudents;
