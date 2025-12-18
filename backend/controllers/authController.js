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

    // For individual registration, assign to a default company if no company context exists
    // In a real application, you might want to create a default "personal" company for each user
    // or have users join existing companies in a separate flow
    
    // For now, let's create a simple personal account scenario by assigning to a default company
    // This assumes there's a default company for individual users (e.g., for testing purposes)
    // In production, you'd likely have users join existing companies or create their own
    
    // For this multi-tenant system, individual registration is primarily for company creation
    // So we'll require the user to be part of a company. Let's assume they'll join a company later.
    // For now, we'll create a placeholder company for all individual users
    
    // Find or create a default company for individual users
    const Company = require('../models/Company');
    let defaultCompany = await Company.findOne({ name: 'Default Individual Users' });
    
    if (!defaultCompany) {
      // Create a default company for individual users
      defaultCompany = new Company({
        name: 'Default Individual Users',
        billingEmail: 'billing@default.com',
        contactEmail: 'contact@default.com',
        plan: 'free',
        features: {
          agentSeats: 1,
          ticketVolume: 100,
          customFields: false,
          reporting: false,
          apiAccess: false,
          customBranding: false,
          sso: false
        }
      });
      await defaultCompany.save();
    }

    // Create user with company assignment
    // For individual registration, assign default role
    // Company owners will be handled separately in company creation
    const defaultRole = role || 'support_agent';
    
    const user = new User({
      name,
      email,
      password,
      role: defaultRole,
      companyId: defaultCompany._id // Assign to the default company
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

    // Populate company information
    const populatedUser = await User.findById(user._id)
      .populate('companyId', 'name plan features')
      .select('-password');

    // Generate token (default to no remember me for registration)
    const token = generateToken(user._id, false);

    res.json({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role,
      isEmailVerified: populatedUser.isEmailVerified,
      companyId: populatedUser.companyId._id,
      company: populatedUser.companyId,
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

    // Populate company information
    const populatedUser = await User.findById(user._id)
      .populate('companyId', 'name plan features')
      .select('-password');

    res.json({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role,
      isEmailVerified: populatedUser.isEmailVerified,
      twoFactorEnabled: populatedUser.twoFactorEnabled,
      companyId: populatedUser.companyId._id,
      company: populatedUser.companyId,
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
    const user = await User.findById(req.user.id)
      .populate('companyId', 'name plan features') // Populate company information
      .select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, department, profileVisibility, showEmail, showPhone, timezone, notificationEmails, theme, avatar } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only allowed fields (not sensitive fields like role, password, etc.)
    if (name) user.name = name;
    if (email && email !== user.email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email: email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email;
      user.isEmailVerified = false; // Reset email verification status if email changes
    }
    if (phone !== undefined) user.phone = phone;
    if (department !== undefined) user.department = department;
    if (profileVisibility !== undefined) user.profileVisibility = profileVisibility;
    if (showEmail !== undefined) user.showEmail = showEmail;
    if (showPhone !== undefined) user.showPhone = showPhone;
    if (timezone !== undefined) user.timezone = timezone;
    if (notificationEmails !== undefined) user.notificationEmails = notificationEmails;
    if (theme !== undefined) user.theme = theme;
    if (avatar !== undefined) user.avatar = avatar; // This will handle base64 or URL for avatar

    await user.save();

    // Return updated user profile without password
    const updatedUser = await User.findById(user._id)
      .populate('companyId', 'name plan features')
      .select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};