const User = require('../models/User');
const multer = require('multer');

// Configure multer for photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}-${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error fetching profile', error: error.message });
  }
};

exports.createProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, linkedIn, github, portfolio, summary, address } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Create new user with role student
    const newUser = new User({
      role: 'student',
      email,
      password: 'defaultpassword', // This should be changed later
      fullName: `${firstName} ${lastName}`,
      phoneNumber: phone,
      location: `${address.city}, ${address.state}, ${address.country}`,
      linkedin: linkedIn,
      github,
      portfolio,
      dateOfBirth: new Date(dateOfBirth),
      summary,
      // Add other fields if needed
    });

    await newUser.save();

    res.status(201).json({
      message: 'Profile created successfully',
      _id: newUser._id,
      user: newUser
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: 'Server error creating profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { 
      email,
      fullName, university, 
      phoneNumber, location, linkedin, summary,
      technicalSkills, softSkills, 
      education, workExperience, projects,
      certifications, achievements, references 
    } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'student') {
      if (email !== undefined) user.email = email;
      if (university !== undefined) user.university = university;
      if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
      if (location !== undefined) user.location = location;
      if (linkedin !== undefined) user.linkedin = linkedin;
      if (summary !== undefined) user.summary = summary;
      
      if (technicalSkills !== undefined) {
          user.technicalSkills = Array.isArray(technicalSkills) ? technicalSkills : typeof technicalSkills === 'string' ? technicalSkills.split(',').map(s => s.trim()).filter(Boolean) : [];
      }
      if (softSkills !== undefined) {
          user.softSkills = Array.isArray(softSkills) ? softSkills : typeof softSkills === 'string' ? softSkills.split(',').map(s => s.trim()).filter(Boolean) : [];
      }
      
      if (education !== undefined) user.education = education;
      if (workExperience !== undefined) user.workExperience = workExperience;
      if (projects !== undefined) user.projects = projects;
      
      if (certifications !== undefined) {
          user.certifications = Array.isArray(certifications) ? certifications : typeof certifications === 'string' ? certifications.split(',').map(s => s.trim()).filter(Boolean) : [];
      }
      if (achievements !== undefined) {
          user.achievements = Array.isArray(achievements) ? achievements : typeof achievements === 'string' ? achievements.split(',').map(s => s.trim()).filter(Boolean) : [];
      }
      if (references !== undefined) user.references = references;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        university: user.university
      },
      profile: user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error fetching students', error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error deleting student', error: error.message });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await User.find({ role: 'company' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Server error fetching companies', error: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await User.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ message: 'Server error deleting company', error: error.message });
  }
};

exports.verifyCompany = async (req, res) => {
  try {
    const company = await User.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    if (company.role !== 'company') {
      return res.status(400).json({ message: 'User is not a company' });
    }
    
    company.isVerified = true;
    await company.save();
    
    res.status(200).json({ message: 'Company verified successfully', company });
  } catch (error) {
    console.error('Error verifying company:', error);
    res.status(500).json({ message: 'Server error verifying company', error: error.message });
  }
};

exports.uploadPhoto = [
  upload.single('profileImage'),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (req.file) {
        user.profileImage = req.file.path; // Or URL if using cloud storage
        await user.save();
        res.status(200).json({ message: 'Photo uploaded successfully', path: req.file.path });
      } else {
        res.status(400).json({ message: 'No file uploaded' });
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      res.status(500).json({ message: 'Server error uploading photo', error: error.message });
    }
  }
];
