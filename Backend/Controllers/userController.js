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
    const { fullName, university, skills } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'student') {
      if (fullName) user.fullName = fullName;
      if (university) user.university = university;
      if (skills) {
          // ensure skills is an array
          user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
      }
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        university: user.university,
        skills: user.skills
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};
