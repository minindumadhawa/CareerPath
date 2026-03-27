import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { environment } from '../../environments/environment';

const StudentProfileResume = () => {
  const navigate = useNavigate();
  const apiUrl = environment.apiUrl;

  const [profile, setProfile] = useState({
    firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
    linkedIn: '', github: '', portfolio: '', summary: '',
    address: { street: '', city: '', state: '', country: '', zipCode: '' }
  });

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Photo must be less than 5MB');
        return;
      }
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const field = name.split('.')[1];
      setProfile(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!profile.firstName || !profile.lastName || !profile.email || !profile.phone || !profile.dateOfBirth || !profile.address.city || !profile.address.country) {
      setErrorMessage('Please fill in all required fields correctly.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create profile');

      const profileId = data._id;
      localStorage.setItem('profileId', profileId);

      if (selectedPhoto) {
        const formData = new FormData();
        formData.append('profileImage', selectedPhoto);

        try {
          const photoRes = await fetch(`${apiUrl}/profile/${profileId}/upload-photo`, {
            method: 'POST',
            body: formData
          });
          if (!photoRes.ok) setSuccessMessage('Profile created! (Photo upload failed)');
          else setSuccessMessage('Profile created with photo!');
        } catch {
          setSuccessMessage('Profile created! (Photo upload failed)');
        }
      } else {
        setSuccessMessage('Profile created successfully!');
      }

      setIsSubmitting(false);
      setTimeout(() => navigate('/student-dashboard'), 1500);

    } catch (err) {
      setErrorMessage(err.message || 'Error creating profile. Check if backend is running.');
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setProfile({
      firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
      linkedIn: '', github: '', portfolio: '', summary: '',
      address: { street: '', city: '', state: '', country: '', zipCode: '' }
    });
    setSelectedPhoto(null);
    setPhotoPreview(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const fillDummyData = () => {
    setProfile({
      firstName: 'Maneeshi', lastName: 'Gunawardhana',
      email: 'maneeshi.gunawardhana@gmail.com', phone: '0771234567', dateOfBirth: '2001-05-15',
      linkedIn: 'https://linkedin.com/in/maneeshigunawardhana',
      github: 'https://github.com/maneeshigunawardhana',
      portfolio: 'https://maneeshigunawardhana.dev',
      summary: 'A passionate IT undergraduate at SLIIT with strong skills in full-stack web development using MEAN stack. Seeking an internship opportunity to apply academic knowledge in a professional setting.',
      address: { street: '123 Galle Road', city: 'Colombo', state: 'Western Province', country: 'Sri Lanka', zipCode: '00100' }
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Add Personal Information</h1>
        <p>Fill in your personal details to create your profile</p>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="card">
        <div className="card-header"><h2>Personal Details</h2></div>
        <form onSubmit={handleSubmit}>
          <div className="photo-section">
            <div className="photo-box" onClick={() => document.getElementById('photoInput').click()}>
              {photoPreview ? <img src={photoPreview} alt={`Profile photo of ${profile.firstName} ${profile.lastName}`} /> :
                <div className="photo-empty">
                  <span className="material-icons">add_a_photo</span>
                  <span>Upload Photo</span>
                </div>}
            </div>
            <input type="file" id="photoInput" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} placeholder="Enter first name" required minLength={2} maxLength={50} />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Enter last name" required minLength={2} maxLength={50} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="Enter email" required />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" name="phone" value={profile.phone} onChange={handleChange} placeholder="e.g. 0771234567" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth *</label>
              <input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>LinkedIn Profile</label>
              <input type="url" name="linkedIn" value={profile.linkedIn} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GitHub Profile</label>
              <input type="url" name="github" value={profile.github} onChange={handleChange} placeholder="https://github.com/..." />
            </div>
            <div className="form-group">
              <label>Portfolio Website</label>
              <input type="url" name="portfolio" value={profile.portfolio} onChange={handleChange} placeholder="https://yourportfolio.com" />
            </div>
          </div>

          <div className="form-group">
            <label>Professional Summary</label>
            <textarea name="summary" value={profile.summary} onChange={handleChange} placeholder="Brief summary of your professional background..." rows={4} />
          </div>

          <h3>Address</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Street Address</label>
              <input type="text" name="address.street" value={profile.address.street} onChange={handleChange} placeholder="Street address" />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input type="text" name="address.city" value={profile.address.city} onChange={handleChange} placeholder="City" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>State/Province</label>
              <input type="text" name="address.state" value={profile.address.state} onChange={handleChange} placeholder="State or Province" />
            </div>
            <div className="form-group">
              <label>Country *</label>
              <input type="text" name="address.country" value={profile.address.country} onChange={handleChange} placeholder="Country" required />
            </div>
          </div>

          <div className="form-group">
            <label>ZIP/Postal Code</label>
            <input type="text" name="address.zipCode" value={profile.address.zipCode} onChange={handleChange} placeholder="ZIP or Postal Code" />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Profile'}</button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
            <button type="button" className="btn btn-success" onClick={fillDummyData}>Fill Dummy Data</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfileResume;
