const express = require('express');
const router = express.Router();
const {
  addComment,
  getCommentsByTicket,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');
const { tenantMiddleware } = require('../middlewares/tenantMiddleware');

// All routes are protected - apply authentication first, then tenant context
router.use(protect);
router.use(tenantMiddleware); // Apply tenant context after authentication

router.route('/')
  .post(addComment);

router.route('/ticket/:ticketId')
  .get(getCommentsByTicket);

router.route('/:id')
  .put(updateComment)
  .delete(deleteComment);

module.exports = router;