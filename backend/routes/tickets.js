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
  getCustomerSatisfaction,
  getDepartmentStats,
  getResponseTimeMetrics,
  getTicketAgeAnalysis,
  getTicketCategories,
  getUpcomingBreaches
} = require('../controllers/ticketController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .post(createTicket)
  .get(getTickets);

router.route('/stats')
  .get(getTicketStats);

router.route('/trends')
  .get(getTicketTrends);

router.route('/distribution')
  .get(getTicketDistribution);

router.route('/resolution-rates')
  .get(getResolutionRates);

router.route('/agents')
  .get(getAgentPerformance);

router.route('/activity')
  .get(getRecentActivity);

router.route('/company-stats')
  .get(getCompanyTicketStats);

router.route('/satisfaction')
  .get(getCustomerSatisfaction);

router.route('/departments')
  .get(getDepartmentStats);

router.route('/response-time')
  .get(getResponseTimeMetrics);

router.route('/age-analysis')
  .get(getTicketAgeAnalysis);

router.route('/categories')
  .get(getTicketCategories);

router.route('/breaches')
  .get(getUpcomingBreaches);

router.route('/:id')
  .get(getTicketById)
  .put(updateTicket)
  .delete(deleteTicket);

router.route('/:id/escalate')
  .post(escalateTicket);

module.exports = router;