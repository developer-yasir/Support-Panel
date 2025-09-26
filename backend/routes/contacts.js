// routes/contacts.js
const express = require('express');
const router = express.Router();
const { getAllContacts, getContactById, createContact } = require('../controllers/contactsController');
const { protect } = require('../middlewares/authMiddleware');

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
router.get('/', protect, getAllContacts);

// @desc    Get contact by ID
// @route   GET /api/contacts/:id
// @access  Private
router.get('/:id', protect, getContactById);

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Private
router.post('/', protect, createContact);

module.exports = router;