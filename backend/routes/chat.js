const express = require('express');
const router = express.Router();
const { getConversations, getMessages, createMessage, createConversation } = require('../controllers/chat');
const { protect } = require('../middlewares/authMiddleware');

// Get all conversations for the authenticated user
router.get('/conversations', protect, getConversations);

// Get messages for a specific conversation
router.get('/conversations/:conversationId/messages', protect, getMessages);

// Create a new message
router.post('/messages', protect, createMessage);

// Create a new conversation (for customers to start a chat)
router.post('/conversations', protect, createConversation);

module.exports = router;