const express = require('express');
const router = express.Router();
const { register, login, guestLogin, logout, verifyEmail, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/guest-login', guestLogin);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);

// Protected routes
router.get('/profile', protect, getProfile);

module.exports = router;