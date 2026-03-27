const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

// Get all students
router.get('/students', userController.getAllStudents);

// Delete student
router.delete('/students/:id', userController.deleteStudent);

// Get all companies
router.get('/companies', userController.getAllCompanies);

// Delete company
router.delete('/companies/:id', userController.deleteCompany);

// Verify company
router.put('/companies/:id/verify', userController.verifyCompany);

// Get user profile
router.get('/profile/:id', userController.getProfile);

// Create user profile
router.post('/profile', userController.createProfile);

// Upload profile photo
router.post('/profile/:id/upload-photo', userController.uploadPhoto);

// Update user profile
router.put('/profile/:id', userController.updateProfile);

module.exports = router;
