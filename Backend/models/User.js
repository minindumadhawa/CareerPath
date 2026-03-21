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
  university: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  skills: {
    type: [String],
    default: []
  },

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
