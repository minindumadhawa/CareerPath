const Application = require('../models/Application');
const Internship = require('../models/Internship');
const User = require('../models/User');

exports.applyForInternship = async (req, res) => {
  try {
    const { studentId, internshipId, name, email, phone, university, cgpa, resume, coverLetter } = req.body;

    // Validate Required Fields
    if (!studentId || !internshipId || !name || !email || !phone || !university || !cgpa || !resume || !coverLetter) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Validate CGPA
    const parsedCgpa = parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 4.0) {
      return res.status(400).json({ success: false, message: 'CGPA must be a valid number between 0 and 4.0.' });
    }

    // Check if Internship exists
    const internshipExists = await Internship.findById(internshipId);
    if (!internshipExists) {
      return res.status(404).json({ success: false, message: 'Internship not found.' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ studentId, internshipId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this internship.' });
    }

    // Create New Application
    const newApplication = new Application({
      studentId,
      internshipId,
      name,
      email,
      phone,
      university,
      cgpa: parsedCgpa,
      resume,
      coverLetter
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      data: newApplication,
      message: 'Application submitted successfully!'
    });

  } catch (error) {
    if (error.code === 11000) {
       return res.status(400).json({ success: false, message: 'You have already applied for this internship.' });
    }
    console.error('Error applying for internship:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

exports.getApplicationsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const applications = await Application.find({ studentId }).populate('internshipId');
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getApplicationsForCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Find all internships belonging to this company
    const internships = await Internship.find({ companyId });
    const internshipIds = internships.map(i => i._id);

    // Find all applications for these internships
    const applications = await Application.find({ internshipId: { $in: internshipIds } })
      .populate('internshipId', 'title location stipend')
      .populate('studentId', 'fullName profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching company applications:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
