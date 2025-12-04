// routes/contacts.js
const express = require('express');
const router = express.Router();
const { getAllContacts, getContactById, createContact } = require('../controllers/contactsController');
const { protect } = require('../middlewares/authMiddleware');
const { tenantMiddleware } = require('../middlewares/tenantMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

// Apply authentication first, then tenant context
router.use(protect);
router.use(tenantMiddleware);

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
router.get('/', [checkPermission('read:contacts')], getAllContacts);

// @desc    Get contact by ID
// @route   GET /api/contacts/:id
// @access  Private
router.get('/:id', [checkPermission('read:contacts')], getContactById);

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Private
router.post('/', [checkPermission('write:contacts')], createContact);

module.exports = router;