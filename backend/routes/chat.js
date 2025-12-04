const express = require('express');
const router = express.Router();
const { getConversations, getMessages, createMessage, createConversation } = require('../controllers/chat');
const { protect } = require('../middlewares/authMiddleware');
const { tenantMiddleware } = require('../middlewares/tenantMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

// Apply authentication first, then tenant context
router.use(protect);
router.use(tenantMiddleware);

// Get all conversations for the authenticated user
router.get('/conversations', [checkPermission('read:chats')], getConversations);

// Get messages for a specific conversation
router.get('/conversations/:conversationId/messages', [checkPermission('read:chats')], getMessages);

// Create a new message
router.post('/messages', [checkPermission('write:chats')], createMessage);

// Create a new conversation (for customers to start a chat)
router.post('/conversations', [checkPermission('write:chats')], createConversation);

module.exports = router;