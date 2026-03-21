const User = require('../models/User');

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

exports.updateProfile = async (req, res) => {
  try {
    const { 
      fullName, phone, location, linkedin, professionalSummary,
      university, educationLevel, graduationYear,
      technicalSkills, softSkills, experience, projects,
      certifications, achievements, references 
    } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'student') {
      if (fullName) user.fullName = fullName;
      if (phone !== undefined) user.phone = phone;
      if (location !== undefined) user.location = location;
      if (linkedin !== undefined) user.linkedin = linkedin;
      if (professionalSummary !== undefined) user.professionalSummary = professionalSummary;
      
      if (university) user.university = university;
      if (educationLevel !== undefined) user.educationLevel = educationLevel;
      if (graduationYear !== undefined) user.graduationYear = graduationYear;
      
      if (technicalSkills) user.technicalSkills = Array.isArray(technicalSkills) ? technicalSkills : technicalSkills.split(',').map(s => s.trim());
      if (softSkills) user.softSkills = Array.isArray(softSkills) ? softSkills : softSkills.split(',').map(s => s.trim());
      
      if (experience) user.experience = experience;
      if (projects) user.projects = projects;
      
      if (certifications) user.certifications = Array.isArray(certifications) ? certifications : certifications.split(',').map(s => s.trim());
      if (achievements) user.achievements = Array.isArray(achievements) ? achievements : achievements.split(',').map(s => s.trim());
      if (references !== undefined) user.references = references;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};
