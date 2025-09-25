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
  getResolutionRates
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

router.route('/:id')
  .get(getTicketById)
  .put(updateTicket)
  .delete(deleteTicket);

router.route('/:id/escalate')
  .post(escalateTicket);

module.exports = router;