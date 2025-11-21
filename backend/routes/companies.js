const express = require('express');
const router = express.Router();
const { 
  createCompany, 
  getCompanyById, 
  getCompanyBySubdomain, 
  getCurrentCompany, 
  updateCompany, 
  getCompanyStats, 
  getCompanyAgents, 
  suspendCompany, 
  activateCompany, 
  changePlan,
  checkSubdomainAvailability,
  getCompanySetupInfo
} = require('../controllers/companyController');

const { getAllCompanies } = require('../controllers/companiesController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { tenantMiddleware, tenantAuthMiddleware } = require('../middlewares/tenantMiddleware');

// Public routes for company signup
router.post('/', createCompany);
router.get('/setup-info', getCompanySetupInfo);
router.get('/check-subdomain/:subdomain', checkSubdomainAvailability);

// Get company by subdomain (for subdomain routing - public)
router.get('/subdomain/:subdomain', getCompanyBySubdomain);

// Get all companies (public route)
router.get('/', getAllCompanies);

// All other routes require authentication
router.use(protect);

// Routes that require tenant context
router.use(tenantMiddleware);

// Get current company (for authenticated users)
router.get('/current', getCurrentCompany);

// Update company (requires tenant auth)
router.put('/current', tenantAuthMiddleware, updateCompany);

// Get company stats (requires tenant auth)
router.get('/current/stats', tenantAuthMiddleware, getCompanyStats);

// Get company agents (requires tenant auth)
router.get('/current/agents', tenantAuthMiddleware, getCompanyAgents);

// Routes for admin management of companies (require admin access)
router.use('/admin', adminOnly);

// Admin routes for managing all companies
router.get('/admin/:id', getCompanyById);
router.put('/admin/:id/suspend', suspendCompany);
router.put('/admin/:id/activate', activateCompany);
router.put('/admin/:id/plan', changePlan);

module.exports = router;