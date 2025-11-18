const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserStatus,
  deleteUser
} = require('../controllers/userController');
const User = require('../models/User'); // Moved import to top
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

// Route specifically for getting agents (support agents only)
router.route('/agents')
  .get(protect, async (req, res) => {
    try {
      // Allow authenticated users to get a list of agents
      // This endpoint will return only active agents
      const agents = await User.find({ 
        role: 'support_agent',
        isActive: true 
      }).select('name email _id');
      res.json(agents);
    } catch (err) {
      console.error('Error fetching agents:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

module.exports = router;