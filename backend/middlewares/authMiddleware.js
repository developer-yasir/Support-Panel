const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Get user from token (including company info)
    req.user = await User.findById(decoded.id).select('-password').populate('companyId');
    
    // Also set companyId directly for convenience
    if (req.user && req.user.companyId) {
      req.companyId = req.user.companyId._id;
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Not authorized to access this route'
      });
    }
    next();
  };
};

// Convenience middleware for superadmin-only access
exports.superadminOnly = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({
      message: 'Admin access required'
    });
  }
  next();
};