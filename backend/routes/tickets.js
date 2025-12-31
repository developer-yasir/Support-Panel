const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  escalateTicket,
  getTicketStats,
  getTicketTrends,
  getTicketDistribution,
  getResolutionRates,
  getAgentPerformance,
  getRecentActivity,
  getCompanyTicketStats,
  getDepartmentStats,
  getResponseTimeMetrics,
  getTicketAgeAnalysis,
  getTicketCategories,
  getUpcomingBreaches,
  forwardTicket
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { tenantMiddleware } = require('../middlewares/tenantMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

// All routes are protected - apply authentication first, then tenant context
router.use(protect);
router.use(tenantMiddleware); // Apply tenant context after authentication

// Public ticket access (for customers)
router.route('/')
  .post(checkPermission('write:tickets'), createTicket)
  .get(checkPermission('read:tickets'), getTickets);

// Statistics - accessible to agents and above
router.route('/stats')
  .get(checkPermission('read:reports'), getTicketStats);

router.route('/trends')
  .get(checkPermission('read:reports'), getTicketTrends);

router.route('/distribution')
  .get(checkPermission('read:reports'), getTicketDistribution);

router.route('/resolution-rates')
  .get(checkPermission('read:reports'), getResolutionRates);

// Agent performance - only accessible to admins and agents
router.route('/agents')
  .get([checkPermission('read:reports'), checkPermission('read:agents')], getAgentPerformance);

router.route('/activity')
  .get(checkPermission('read:reports'), getRecentActivity);

router.route('/company-stats')
  .get(checkPermission('read:reports'), getCompanyTicketStats);

router.route('/departments')
  .get(checkPermission('read:reports'), getDepartmentStats);

router.route('/response-time')
  .get(checkPermission('read:reports'), getResponseTimeMetrics);

router.route('/age-analysis')
  .get(checkPermission('read:reports'), getTicketAgeAnalysis);

router.route('/categories')
  .get(checkPermission('read:reports'), getTicketCategories);

router.route('/breaches')
  .get(checkPermission('read:reports'), getUpcomingBreaches);

router.route('/:id')
  .get(checkPermission('read:tickets'), getTicketById)
  .put(checkPermission('write:tickets'), updateTicket)
  .delete([checkPermission('delete:tickets'), authorize('superadmin')], deleteTicket);  // Only superadmins can delete

router.route('/:id/escalate')
  .post(checkPermission('write:tickets'), escalateTicket);

router.route('/:id/forward')
  .post(checkPermission('write:tickets'), forwardTicket);

module.exports = router;