const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUserById);

module.exports = router;