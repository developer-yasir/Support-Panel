// routes/contacts.js
const express = require('express');
const router = express.Router();
const { getAllContacts, getContactById, createContact } = require('../controllers/contactsController');
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
router.get('/', [protect, checkPermission('read:contacts')], getAllContacts);

// @desc    Get contact by ID
// @route   GET /api/contacts/:id
// @access  Private
router.get('/:id', [protect, checkPermission('read:contacts')], getContactById);

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Private
router.post('/', [protect, checkPermission('write:contacts')], createContact);

module.exports = router;