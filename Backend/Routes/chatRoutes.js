const express = require('express');
const router = express.Router();
const { generateChatResponse } = require('../Controllers/chatController');

router.post('/ask', generateChatResponse);

module.exports = router;
