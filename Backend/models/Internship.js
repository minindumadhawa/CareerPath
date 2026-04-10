const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  stipend: { type: String, required: true },
  requirements: { type: String, required: true },
  skills: { type: [String], default: [] },
  applicationDeadline: { type: Date },
  startDate: { type: Date },
  totalPositions: { type: Number },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Active', 'Draft', 'Closed'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);
