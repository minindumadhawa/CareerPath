const express = require('express');
const router = express.Router();
const companyController = require('../Controllers/companyController');

router.post('/register', companyController.register);
router.post('/login', companyController.login);
router.get('/profile/:companyId', companyController.getProfile);
router.put('/profile/:companyId', companyController.updateProfile);
router.get('/all', companyController.getAllCompanies);
router.get('/industry/:industry', companyController.getCompaniesByIndustry);

module.exports = router;
