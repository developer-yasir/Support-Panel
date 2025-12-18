const express = require('express');
const router = express.Router();
const {
  createPartnershipRequest,
  getPartnershipRequests,
  getPartnerships,
  approvePartnership,
  rejectPartnership,
  withdrawPartnership,
  cancelPartnership,
  getPartnerAgents,
  getPartnerCompanies
} = require('../controllers/partnershipController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { tenantMiddleware } = require('../middlewares/tenantMiddleware');

// All routes are protected - apply authentication first, then tenant context
router.use(protect);
router.use(tenantMiddleware);

// Create partnership request
router.route('/')
  .post(createPartnershipRequest)
  .get(getPartnerships); // Get existing partnerships

// Get partnership requests (incoming requests to approve/reject)
router.route('/requests')
  .get(getPartnershipRequests);

// Get partner agents (for ticket assignment)
router.route('/agents')
  .get(getPartnerAgents);

// Get partner companies
router.route('/companies')
  .get(getPartnerCompanies);

// Manage specific partnership
router.route('/:partnershipId')
  .put(approvePartnership) // Approve partnership
  .delete(cancelPartnership); // Cancel partnership

// Additional routes for partnership management
router.route('/:partnershipId/reject')
  .put(rejectPartnership);

router.route('/:partnershipId/withdraw')
  .put(withdrawPartnership);

module.exports = router;