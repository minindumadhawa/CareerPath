const express = require('express');
const router = express.Router();
const applicationController = require('../Controllers/applicationController');

// Submit an application
router.post('/apply', applicationController.applyForInternship);

// Get all applications for a specific student
router.get('/student/:studentId', applicationController.getApplicationsForStudent);

// Get all applications for a specific company
router.get('/company/:companyId', applicationController.getApplicationsForCompany);

// Get all applications globally
router.get('/', applicationController.getAllApplications);

module.exports = router;
