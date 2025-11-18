const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserStatus,
  deleteUser
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .get(adminOnly, getUsers)  // Only admins can get users
  .post(adminOnly, createUser);  // Only admins can create users

router.route('/:id')
  .get(getUserById)
  .put(adminOnly, updateUserStatus)  // Only admins can update user status
  .delete(adminOnly, deleteUser);  // Only admins can delete users

// Additional route for toggling user status
router.route('/:id/toggle-status')
  .put(adminOnly, updateUserStatus);  // Only admins can update user status

module.exports = router;