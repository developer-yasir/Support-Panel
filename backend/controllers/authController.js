const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../config/email');

// Generate JWT token
const generateToken = (userId, rememberMe = false) => {
  const expiresIn = rememberMe ? config.jwtRememberMeExpiration : config.jwtExpiration;
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: expiresIn
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

    // Generate token (default to no remember me for registration)
    const token = generateToken(user._id, false);

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
    const { email, password, rememberMe = false, twoFactorToken } = req.body;

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

    // Check if 2FA is enabled for this user
    if (user.twoFactorEnabled) {
      // If 2FA is enabled, we need the token
      if (!twoFactorToken) {
        return res.status(401).json({ 
          message: '2FA token required',
          requires2FA: true,
          email: user.email
        });
      }

      // Verify the 2FA token
      const isTokenValid = user.verifyTwoFactorToken(twoFactorToken);
      if (!isTokenValid) {
        return res.status(401).json({ message: 'Invalid 2FA token' });
      }
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token with remember me option
    const token = generateToken(user._id, rememberMe);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
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

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ 
        message: 'If an account with this email exists, a password reset link has been sent.' 
      });
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    
    // Save the user with the new reset token
    await user.save({ validateBeforeSave: false });

    try {
      // Send email with reset link
      await sendPasswordResetEmail(user.email, user.name, resetToken);
      console.log(`Password reset link sent to: ${user.email}`);
    } catch (emailError) {
      // If email fails, clear the reset token and return error
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      console.error('Failed to send password reset email:', emailError);
      return res.status(500).json({ 
        message: 'Failed to send password reset email. Please try again later.' 
      });
    }

    res.status(200).json({ 
      message: 'If an account with this email exists, a password reset link has been sent.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by the reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update the password using the pre-save middleware to hash it
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.json({ 
      message: 'Password reset successful',
      success: true
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};