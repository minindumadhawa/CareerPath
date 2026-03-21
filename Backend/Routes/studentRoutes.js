const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController');

router.post('/register', studentController.register);
router.post('/login', studentController.login);
router.get('/profile/:studentId', studentController.getProfile);
router.put('/profile/:studentId', studentController.updateProfile);
router.get('/all', studentController.getAllStudents);

module.exports = router;
