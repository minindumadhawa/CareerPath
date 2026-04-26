import React, { useState } from 'react';
import './ApplicationModal.css';
import { toast } from 'react-toastify';

const ApplicationModal = ({ internship, onClose, user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    university: '',
    cgpa: '',
    coverLetter: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.university.trim()) newErrors.university = 'University is required';
    
    if (!formData.cgpa) {
      newErrors.cgpa = 'CGPA is required';
    } else {
      const cgpaVal = parseFloat(formData.cgpa);
      if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 4.0) {
        newErrors.cgpa = 'CGPA must be a valid number between 0 and 4.0';
      }
    }
    
    if (!formData.coverLetter.trim()) newErrors.coverLetter = 'Cover letter is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!user?.id) {
      toast.error('You must be logged in as a student to apply.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5001/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: user.id,
          internshipId: internship._id,
          ...formData
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Application submitted successfully!');
        onClose();
      } else {
        toast.error(data.message || 'Failed to submit application.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while submitting your application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="application-modal-overlay">
      <div className="application-modal-content">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
        
        <div className="modal-header">
          <h2>Apply for Internship</h2>
          <p>You are applying for <strong style={{color:'#3b82f6'}}>{internship.title}</strong> at <strong>{internship.companyId?.companyName || 'Company'}</strong>.</p>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="university">University/College *</label>
              <input type="text" id="university" name="university" value={formData.university} onChange={handleChange} placeholder="State University" />
              {errors.university && <span className="error-text">{errors.university}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cgpa">CGPA (0 - 4.0) *</label>
              <input type="number" step="0.01" id="cgpa" name="cgpa" value={formData.cgpa} onChange={handleChange} placeholder="3.5" />
              {errors.cgpa && <span className="error-text">{errors.cgpa}</span>}
            </div>



            <div className="form-group full-width">
              <label htmlFor="coverLetter">Cover Letter *</label>
              <textarea id="coverLetter" name="coverLetter" value={formData.coverLetter} onChange={handleChange} placeholder="Why are you a great fit for this role?"></textarea>
              {errors.coverLetter && <span className="error-text">{errors.coverLetter}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
