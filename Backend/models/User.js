const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['student', 'company']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String
  },
  
  // Student specific fields
  fullName: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  university: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  phoneNumber: { type: String },
  location: { type: String },
  linkedin: { type: String },
  github: { type: String },
  portfolio: { type: String },
  dateOfBirth: { type: Date },
  summary: { type: String },
  
  technicalSkills: { type: [String], default: [] },
  softSkills: { type: [String], default: [] },
  
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  
  workExperience: [{
    jobTitle: String,
    company: String,
    duration: String,
    responsibilities: String
  }],
  
  projects: [{
    projectName: String,
    description: String,
    technologies: String
  }],
  
  certifications: { type: [String], default: [] },
  achievements: { type: [String], default: [] },
  references: { type: String, default: 'Available upon request' },

  // Company specific fields
  companyName: {
    type: String,
    required: function() { return this.role === 'company'; }
  },
  industry: {
    type: String,
    required: function() { return this.role === 'company'; }
  },
  website: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
