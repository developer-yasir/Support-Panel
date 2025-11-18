const User = require('../models/User');
const QRCode = require('qrcode');

// Generate 2FA setup
exports.generateTwoFactorSetup = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new 2FA secret for the user
    const secret = user.generateTwoFactorSecret();
    await user.save();

    // Generate QR code
    const qrCodeUrl = secret.otpauth_url;
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);

    res.json({
      secret: secret.base32,
      qrCode: qrCodeDataUrl,
      qrCodeUrl: qrCodeUrl
    });
  } catch (error) {
    console.error('Generate 2FA setup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify 2FA setup
exports.verifyTwoFactorSetup = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the token
    const isValid = user.verifyTwoFactorToken(token);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid 2FA token' });
    }

    // Enable 2FA for the user
    user.twoFactorEnabled = true;
    await user.save();

    res.json({ success: true, message: '2FA setup completed successfully' });
  } catch (error) {
    console.error('Verify 2FA setup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Enable 2FA
exports.enableTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.twoFactorEnabled = true;
    await user.save();

    res.json({ success: true, message: '2FA enabled successfully' });
  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Disable 2FA
exports.disableTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    res.json({ success: true, message: '2FA disabled successfully' });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify 2FA token during login
exports.verifyTwoFactorToken = async (req, res) => {
  try {
    const { email, token } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if 2FA is enabled for this user
    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is not enabled for this account' });
    }

    // Verify the token
    const isValid = user.verifyTwoFactorToken(token);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid 2FA token' });
    }

    // Token is valid, return success
    res.json({ 
      success: true, 
      message: '2FA token verified successfully',
      userId: user._id
    });
  } catch (error) {
    console.error('Verify 2FA token error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};