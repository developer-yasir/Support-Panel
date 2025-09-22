const express = require('express');
const router = express.Router();
const {
  addComment,
  getCommentsByTicket,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .post(addComment);

router.route('/ticket/:ticketId')
  .get(getCommentsByTicket);

router.route('/:id')
  .put(updateComment)
  .delete(deleteComment);

module.exports = router;