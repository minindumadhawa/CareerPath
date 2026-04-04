const Internship = require('../models/Internship');

// Create internship
exports.createInternship = async (req, res) => {
    try {
        const internship = new Internship(req.body);
        await internship.save();
        res.status(201).json({ success: true, data: internship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get internships by company
exports.getCompanyInternships = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const internships = await Internship.find({ companyId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: internships });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
