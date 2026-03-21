const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// Signup route for both students and companies
router.post('/signup', authController.signup);

module.exports = router;
