const express = require('express');
const router = express.Router();
const internshipController = require('../Controllers/internshipController');

router.post('/', internshipController.createInternship);
router.get('/active', internshipController.getAllActiveInternships);
router.get('/company/:companyId', internshipController.getCompanyInternships);
router.put('/:id', internshipController.updateInternship);
router.delete('/:id', internshipController.deleteInternship);

module.exports = router;
