const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  markVideoWatched,
  markComplete,
  getByStudent,
  getAllEnrollments,
  saveVideoNote
} = require('../Controllers/enrollmentController');
const { validateEnrollment } = require('../middleware/validateMiddleware');

router.post('/', validateEnrollment, createEnrollment);
router.patch('/:id/watch', markVideoWatched);
router.patch('/:id/complete', markComplete);
router.patch('/:id/note', saveVideoNote);
router.get('/student/:email', getByStudent);
router.get('/admin/all', getAllEnrollments);

module.exports = router;
