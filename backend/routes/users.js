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
const { protect, adminOnly, authorize } = require('../middlewares/authMiddleware');
const { tenantMiddleware } = require('../middlewares/tenantMiddleware');
const { checkPermission, canAccessResource, ownerOnly } = require('../middlewares/permissionMiddleware');

// All routes are protected - apply authentication first, then tenant context
router.use(protect);
router.use(tenantMiddleware); // Apply tenant context after authentication

// User management - only for admins or company owners
router.route('/')
  .get([checkPermission('read:users'), authorize('admin')], getUsers)  // Only admins can get all users
  .post([checkPermission('write:users'), authorize('admin')], createUser);  // Only admins can create users

router.route('/:id')
  .get(canAccessResource('user'), getUserById)
  .put([ownerOnly, checkPermission('write:users'), authorize('admin')], updateUserStatus)  // Only admins can update user status
  .delete([checkPermission('delete:users'), authorize('admin')], deleteUser);  // Only admins can delete users

// Additional route for toggling user status
router.route('/:id/toggle-status')
  .put([checkPermission('write:users'), authorize('admin')], updateUserStatus);  // Only admins can update user status

// Route specifically for getting agents (support agents only)
// tenantMiddleware is already applied at the router level
router.route('/agents')
  .get(async (req, res) => {
    try {
      // Verify company context exists
      if (!req.companyId) {
        return res.status(400).json({ message: 'Company context required to get agents' });
      }

      // Allow authenticated users to get a list of agents from their company only
      const agents = await User.find({
        role: { $in: ['support_agent', 'admin'] },  // Include both agents and admin
        isActive: true,
        companyId: req.companyId  // Critical: Only agents from the same company
      }).select('name email role _id');
      res.json(agents);
    } catch (err) {
      console.error('Error fetching agents:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

module.exports = router;