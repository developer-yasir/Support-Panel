const express = require('express');
const router = express.Router();
const { getConversations, getMessages, createMessage, createConversation } = require('../controllers/chat');
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

// Get all conversations for the authenticated user
router.get('/conversations', [protect, checkPermission('read:chats')], getConversations);

// Get messages for a specific conversation
router.get('/conversations/:conversationId/messages', [protect, checkPermission('read:chats')], getMessages);

// Create a new message
router.post('/messages', [protect, checkPermission('write:chats')], createMessage);

// Create a new conversation (for customers to start a chat)
router.post('/conversations', [protect, checkPermission('write:chats')], createConversation);

module.exports = router;