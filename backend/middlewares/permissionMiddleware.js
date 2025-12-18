const User = require('../models/User');

// Define permissions based on roles
const permissions = {
  superadmin: [
    'read:dashboard',
    'read:tickets',
    'write:tickets',
    'delete:tickets',
    'read:agents',
    'write:agents',
    'delete:agents',
    'read:settings',
    'write:settings',
    'read:reports',
    'write:reports',
    'read:billing',
    'write:billing',
    'read:company',
    'write:company',
    'read:users',
    'write:users',
    'delete:users',
    'read:contacts',
    'write:contacts',
    'read:chats',
    'write:chats'
  ],
  support_agent: [
    'read:dashboard',
    'read:tickets',
    'write:tickets',
    'read:reports',
    'read:settings',
    'write:settings',
    'read:chats',
    'write:chats',
    'read:contacts'
  ],
  company_manager: [
    'read:dashboard',
    'read:tickets',
    'write:tickets',
    'read:agents',
    'write:agents',
    'read:settings',
    'write:settings',
    'read:reports',
    'read:users',
    'write:users',
    'delete:users',
    'read:contacts',
    'write:contacts',
    'read:chats',
    'write:chats'
  ]
};

// Check if user has a specific permission
const hasPermission = (role, permission) => {
  const rolePermissions = permissions[role] || [];
  return rolePermissions.includes(permission) || rolePermissions.includes('*');
};

// Middleware to check specific permissions
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ 
        message: `Access denied: You don't have permission to perform this action (${permission})` 
      });
    }

    next();
  };
};

// Middleware to check if user can access a specific resource
exports.canAccessResource = (resourceType) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // For resources that belong to the same company, allow access
    // This is already handled by the tenant middleware, but adding for completeness
    if (req.user.companyId.toString() === req.companyId.toString()) {
      next();
    } else {
      return res.status(403).json({ 
        message: `Access denied: You don't have permission to access this ${resourceType}` 
      });
    }
  };
};

// Middleware to check if user can modify a specific resource
exports.canModifyResource = (resourceType) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role === 'superadmin') {
      next();
      return;
    }

    // Special handling for tickets - support agents can modify tickets assigned to them
    if (resourceType === 'ticket' && req.user.role === 'support_agent') {
      // In a real implementation, we'd check if the ticket belongs to the same company
      // and potentially if it's assigned to the current user
      next();
      return;
    }

    // Other roles may have limited modification rights
    return res.status(403).json({ 
      message: `Access denied: You don't have permission to modify this ${resourceType}` 
    });
  };
};

// Helper function to get user permissions
exports.getUserPermissions = (role) => {
  return permissions[role] || [];
};

// Middleware to restrict access to company owner only
exports.ownerOnly = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Check if the user is the company owner
  try {
    // Populate the company with its owner
    const company = await req.user.populate('companyId');
    const companyId = req.user.companyId._id;
    
    // In a real implementation, we'd check if the current user is the owner of the company
    // For now, we'll assume that superadmin users are considered owners for their company
    if (req.user.role === 'superadmin') {
      next();
    } else {
      return res.status(403).json({ 
        message: 'Access denied: Only company owner can perform this action' 
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};