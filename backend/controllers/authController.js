const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { sendVerificationEmail } = require('../config/email');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiration
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (without saving to DB yet)
    const user = new User({
      name,
      email,
      password,
      role: role || 'support_agent'
    });

    // Generate email verification token
    const verificationToken = user.createEmailVerificationToken();
    
    // Save user to database
    await user.save();

    // Send verification email
    try {
      console.log('Attempting to send verification email to:', email);
      await sendVerificationEmail(user.email, user.name, verificationToken);
      console.log('Verification email sent successfully to:', email);
      res.status(201).json({
        message: 'Registration successful. Please check your email for verification code.',
        userId: user._id,
        email: user.email
      });
    } catch (emailError) {
      // If email fails, we still want to register the user but inform them
      console.error('Failed to send verification email:', emailError);
      res.status(201).json({
        message: 'Registration successful. However, we couldn\'t send the verification email. Please contact support.',
        userId: user._id,
        email: user.email
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Check if verification token is valid
    if (user.emailVerificationToken !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if verification token has expired
    if (user.emailVerificationExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({ 
        message: 'Please verify your email before logging in',
        email: user.email,
        isEmailVerified: user.isEmailVerified
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Guest login
exports.guestLogin = async (req, res) => {
  try {
    // Check if guest user exists, if not create one
    let user = await User.findOne({ email: 'guest@example.com' });
    
    if (!user) {
      // Create guest user
      user = new User({
        name: 'Guest User',
        email: 'guest@example.com',
        password: 'guest123',
        role: 'support_agent',
        isEmailVerified: true // Guest users don't need email verification
      });
      
      await user.save();
    }
    
    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout user
exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};