const express = require('express');
const router = express.Router();
const { register, login, guestLogin, logout, verifyEmail } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/guest-login', guestLogin);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);

module.exports = router;