const express = require('express');
const router = express.Router();
const { generateTwoFactorSetup, verifyTwoFactorSetup, enableTwoFactor, disableTwoFactor, verifyTwoFactorToken } = require('../controllers/twoFactorController');
const { protect } = require('../middlewares/authMiddleware');

// Routes that require authentication
router.post('/setup', protect, generateTwoFactorSetup);
router.post('/verify-setup', protect, verifyTwoFactorSetup);
router.post('/enable', protect, enableTwoFactor);
router.post('/disable', protect, disableTwoFactor);

// Public route for verifying 2FA token during login
router.post('/verify-token', verifyTwoFactorToken);

module.exports = router;