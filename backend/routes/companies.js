const express = require('express');
const router = express.Router();
const {
  createCompany,
  getCompanyById,
  getCurrentCompany,
  updateCompany,
  getCompanyStats,
  getCompanyAgents,
  suspendCompany,
  activateCompany,
  changePlan,
  checkCompanyNameAvailability,
  getCompanySetupInfo
} = require('../controllers/companyController');

const { getAllCompanies } = require('../controllers/companiesController');
const { protect, superadminOnly, authorize } = require('../middlewares/authMiddleware');
const { tenantMiddleware, tenantAuthMiddleware } = require('../middlewares/tenantMiddleware');
const { checkPermission, ownerOnly } = require('../middlewares/permissionMiddleware');

// Public routes for company signup
router.post('/', createCompany);
router.get('/setup-info', getCompanySetupInfo);
router.get('/check-name/:name', checkCompanyNameAvailability);

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

// Routes for superadmin management of companies (require superadmin access)
router.use('/superadmin', [superadminOnly, authorize('superadmin')]);

// Admin routes for managing all companies
router.get('/superadmin', [superadminOnly, authorize('superadmin')], getAllCompanies); // Superadmin endpoint to get all companies
router.get('/superadmin/:id', [superadminOnly, authorize('superadmin')], getCompanyById);
router.put('/superadmin/:id/suspend', [superadminOnly, authorize('superadmin')], suspendCompany);
router.put('/superadmin/:id/activate', [superadminOnly, authorize('superadmin')], activateCompany);
router.put('/superadmin/:id/plan', [superadminOnly, authorize('superadmin')], changePlan);

module.exports = router;