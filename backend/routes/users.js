const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserStatus,
  deleteUser,
  updateUser
} = require('../controllers/userController');
const User = require('../models/User'); // Moved import to top
const { protect, superadminOnly, authorize } = require('../middlewares/authMiddleware');
const { tenantMiddleware } = require('../middlewares/tenantMiddleware');
const { checkPermission, canAccessResource, ownerOnly } = require('../middlewares/permissionMiddleware');

// All routes are protected - apply authentication first, then tenant context
router.use(protect);
router.use(tenantMiddleware); // Apply tenant context after authentication

// User management - for admins and company managers
router.route('/')
  .get([checkPermission('read:users')], getUsers)  // Permission middleware handles role checking
  .post([checkPermission('write:users')], createUser);  // Permission middleware handles role checking

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
        role: { $in: ['support_agent', 'superadmin'] },  // Include both agents and superadmin
        isActive: true,
        companyId: req.companyId  // Critical: Only agents from the same company
      }).select('name email role _id');
      res.json(agents);
    } catch (err) {
      console.error('Error fetching agents:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

router.route('/:id')
  .get(canAccessResource('user'), getUserById)
  .put([checkPermission('write:users')], updateUser)  // Permission middleware handles role checking
  .delete([checkPermission('delete:users')], deleteUser);  // Permission middleware handles role checking

module.exports = router;