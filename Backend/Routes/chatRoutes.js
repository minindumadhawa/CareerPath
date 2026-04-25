const express = require('express');
const router = express.Router();
const { generateChatResponse, getChatHistory } = require('../Controllers/chatController');
const { analyzeResume } = require('../Controllers/resumeController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/ask', generateChatResponse);
router.get('/history/:userId', getChatHistory);
router.post('/analyze-resume', upload.single('resume'), analyzeResume);

module.exports = router;
