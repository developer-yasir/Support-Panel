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
const { protect, adminOnly, authorize } = require('../middlewares/authMiddleware');
const { tenantMiddleware, tenantAuthMiddleware } = require('../middlewares/tenantMiddleware');
const { checkPermission, ownerOnly } = require('../middlewares/permissionMiddleware');

// Public routes for company signup
router.post('/', createCompany);
router.get('/setup-info', getCompanySetupInfo);
router.get('/check-subdomain/:subdomain', checkSubdomainAvailability);

// Get company by subdomain (for subdomain routing - public)
router.get('/subdomain/:subdomain', getCompanyBySubdomain);

// All other routes require authentication
router.use(protect);

// Routes that require tenant context
router.use(tenantMiddleware);

// Route for regular users to get their own company info
router.get('/my-company', getCurrentCompany);

// Get current company (for authenticated users)
router.get('/current', getCurrentCompany);

// Update company (requires admin or owner role)
router.put('/current', [ownerOnly, checkPermission('write:company')], updateCompany);

// Get company stats (accessible to all authenticated users in the company)
router.get('/current/stats', checkPermission('read:company'), getCompanyStats);

// Get company agents (accessible to users with user read permissions)
router.get('/current/agents', checkPermission('read:users'), getCompanyAgents);

// Routes for admin management of companies (require admin access)
router.use('/admin', [adminOnly, authorize('admin')]);

// Admin routes for managing all companies
router.get('/admin', [adminOnly, authorize('admin')], getAllCompanies); // Admin endpoint to get all companies
router.get('/admin/:id', [adminOnly, authorize('admin')], getCompanyById);
router.put('/admin/:id/suspend', [adminOnly, authorize('admin')], suspendCompany);
router.put('/admin/:id/activate', [adminOnly, authorize('admin')], activateCompany);
router.put('/admin/:id/plan', [adminOnly, authorize('admin')], changePlan);

module.exports = router;