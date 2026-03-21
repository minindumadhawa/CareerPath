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
  
  // Student specific fields
  fullName: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  phone: String,
  location: String,
  linkedin: String,
  professionalSummary: String,
  university: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  educationLevel: String,
  graduationYear: String,
  technicalSkills: { type: [String], default: [] },
  softSkills: { type: [String], default: [] },
  experience: [{
    jobTitle: String,
    company: String,
    duration: String,
    responsibilities: String
  }],
  projects: [{
    name: String,
    description: String,
    technologies: String
  }],
  certifications: { type: [String], default: [] },
  achievements: { type: [String], default: [] },
  references: String,

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
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
