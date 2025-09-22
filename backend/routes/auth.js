const express = require('express');
const router = express.Router();
const { register, login, guestLogin, logout } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/guest-login', guestLogin);
router.post('/logout', logout);

module.exports = router;