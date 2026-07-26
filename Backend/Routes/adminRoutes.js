const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');

// Get dashboard stats
router.get('/stats', adminController.getDashboardStats);

module.exports = router;
