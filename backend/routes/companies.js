// routes/companies.js
const express = require('express');
const router = express.Router();
const { getAllCompanies, getCompanyById, createCompany } = require('../controllers/companiesController');
const { protect } = require('../middlewares/authMiddleware');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
router.get('/', protect, getAllCompanies);

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
router.get('/:id', protect, getCompanyById);

// @desc    Create a new company
// @route   POST /api/companies
// @access  Private
router.post('/', protect, createCompany);

module.exports = router;