const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

// Get user profile
router.get('/profile/:id', userController.getProfile);

// Update user profile
router.put('/profile/:id', userController.updateProfile);

module.exports = router;
