const User = require('../models/User');

exports.signup = async (req, res) => {
  try {
    const { role, email, password, fullName, university, companyName, industry } = req.body;

    // Validate role
    if (!['student', 'company'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // In a production app, we would hash the password here using bcrypt before saving.
    // For this prototype, we'll store it in plain text to get things working simply.

    // Prepare user document
    const userData = { role, email, password };
    
    if (role === 'student') {
      if (!fullName || !university) {
         return res.status(400).json({ message: 'Full name and university are required for students.' });
      }
      userData.fullName = fullName;
      userData.university = university;
    } else if (role === 'company') {
      if (!companyName || !industry) {
         return res.status(400).json({ message: 'Company name and industry are required for companies.' });
      }
      userData.companyName = companyName;
      userData.industry = industry;
    }

    // Attempt to save to database
    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({ 
        message: 'Signup successful!',
        user: { id: newUser._id, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded Admin check
    if (email === 'admin@gmail.com' && password === '000000') {
      return res.status(200).json({
        message: 'Admin login successful',
        user: {
          id: 'admin_id_001',
          email: 'admin@gmail.com',
          role: 'admin',
          name: 'System Administrator'
        }
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check password (In production, use bcrypt.compare)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Success response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.role === 'student' ? user.fullName : user.companyName
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};
