const User = require('../models/User');
const Internship = require('../models/Internship');

exports.getDashboardStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    const companyCount = await User.countDocuments({ role: 'company' });
    const internshipCount = await Internship.countDocuments({ status: 'Open' }); // Assuming 'Open' status exists
    
    // Get pending verifications
    const pendingVerifications = await User.countDocuments({ role: 'company', isVerified: false });

    // Get recent registrations
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      students: studentCount,
      companies: companyCount,
      internships: internshipCount,
      pendingVerifications,
      recentUsers
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching stats', error: error.message });
  }
};
