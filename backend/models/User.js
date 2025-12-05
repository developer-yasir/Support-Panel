const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'company_manager', 'support_agent', 'customer'],
    default: 'support_agent'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  emailVerificationExpires: {
    type: Date
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true // All users must belong to a company
  },
  avatar: {
    type: String,
    default: null
  },
  profileVisibility: {
    type: String,
    enum: ['public', 'company', 'private'],
    default: 'public'
  },
  showEmail: {
    type: Boolean,
    default: true
  },
  showPhone: {
    type: Boolean,
    default: false
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  notificationEmails: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  }
}, {
  timestamps: true
});

// Add index for better performance with companyId queries
userSchema.index({ companyId: 1 });
userSchema.index({ email: 1, companyId: 1 });
userSchema.index({ role: 1, companyId: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
userSchema.methods.createEmailVerificationToken = function() {
  const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
  this.emailVerificationToken = token;
  this.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return token;
};

// Generate 2FA secret
userSchema.methods.generateTwoFactorSecret = function() {
  const speakeasy = require('speakeasy');
  const secret = speakeasy.generateSecret({
    name: `Support Panel (${this.email})`,
    issuer: 'Support Panel'
  });
  this.twoFactorSecret = secret.base32;
  return secret;
};

// Verify 2FA token
userSchema.methods.verifyTwoFactorToken = function(token) {
  if (!this.twoFactorSecret) {
    return false;
  }
  
  const speakeasy = require('speakeasy');
  return speakeasy.totp.verify({
    secret: this.twoFactorSecret,
    encoding: 'base32',
    token: token,
    window: 2 // Allow up to 2 intervals before or after
  });
};

// Get 2FA QR code URL
userSchema.methods.getTwoFactorQrCodeUrl = function() {
  if (!this.twoFactorSecret) {
    return null;
  }
  
  const speakeasy = require('speakeasy');
  return speakeasy.otpauthURL({
    secret: this.twoFactorSecret,
    label: this.email,
    issuer: 'Support Panel'
  });
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  // Generate a random token
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Set the reset token and expiration (1 hour)
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
  
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);