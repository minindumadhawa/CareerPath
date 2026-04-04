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

// Update internship
exports.updateInternship = async (req, res) => {
    try {
        const { id } = req.params;
        const internship = await Internship.findByIdAndUpdate(id, req.body, { new: true });
        if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });
        res.status(200).json({ success: true, data: internship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete internship
exports.deleteInternship = async (req, res) => {
    try {
        const { id } = req.params;
        const internship = await Internship.findByIdAndDelete(id);
        if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });
        res.status(200).json({ success: true, message: 'Internship deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all public active internships
exports.getAllActiveInternships = async (req, res) => {
    try {
        const internships = await Internship.find({ status: 'Active' })
            .populate('companyId', 'companyName industry')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: internships });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
