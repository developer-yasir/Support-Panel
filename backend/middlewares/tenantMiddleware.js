const Company = require('../models/Company');
const User = require('../models/User');

/**
 * Tenant identification middleware
 * Extracts and validates the company/tenant from the request
 */
const tenantMiddleware = async (req, res, next) => {
  try {
    let company = null;

    // Check if company context is already set by auth middleware (this should be preserved)
    if (req.user && req.user.companyId) {
      // Company context already established by auth middleware, use it
      company = await Company.findById(req.user.companyId);
    }

    // If no company context from auth, try other methods
    if (!company) {
      // Method 3: Try to get company from Authorization header (for API calls)
      if (!company && req.headers.authorization) {
        const decoded = req.user; // Assuming user info is already decoded by auth middleware

        if (decoded && decoded.companyId) {
          company = await Company.findById(decoded.companyId);
        } else if (decoded && decoded.id) {
          // Look up user and get their company
          const user = await User.findById(decoded.id).populate('companyId');
          if (user && user.companyId) {
            company = user.companyId;
          }
        }
      }

      // Method 4: Try to get from company header
      if (!company && req.headers['x-company-id']) {
        company = await Company.findById(req.headers['x-company-id']);
      }

      // Method 5: Try to get from cookie (for frontend requests)
      if (!company && req.cookies && req.cookies.companyId) {
        company = await Company.findById(req.cookies.companyId);
      }
    }

    // Validate company exists and is active
    if (company) {
      if (!company.active || company.suspended) {
        return res.status(403).json({
          message: 'Company account is inactive or suspended'
        });
      }

      req.companyId = company._id;
      req.company = company;
      req.tenant = company; // alias
    } else {
      // For now, allow requests without company for signup/login
      // In production, you might want to be more restrictive
      req.companyId = null;
      req.company = null;
      req.tenant = null;
    }

    // Check if user belongs to the company they're trying to access
    if (req.user && req.companyId) {
      // This is a protection check to ensure user doesn't access data from different company
      // than what they belong to
      const userCompanyId = req.user.companyId._id || req.user.companyId;
      if (userCompanyId.toString() !== req.companyId.toString()) {
        return res.status(403).json({
          message: 'Access denied: You do not belong to this company'
        });
      }
    }

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({
      message: 'Internal server error during tenant identification'
    });
  }
};

/**
 * Tenant authorization middleware
 * Checks if the user belongs to the current tenant
 */
const tenantAuthMiddleware = async (req, res, next) => {
  if (!req.companyId) {
    return res.status(400).json({
      message: 'No company context found in request'
    });
  }

  if (!req.user || !req.user.companyId) {
    return res.status(401).json({
      message: 'User not authenticated or not associated with a company'
    });
  }

  // Verify user belongs to the same company as the request context
  if (req.user.companyId.toString() !== req.companyId.toString()) {
    return res.status(403).json({
      message: 'Access denied: User does not belong to this company'
    });
  }

  next();
};

/**
 * Middleware to check if company has required features
 */
const checkCompanyFeatures = (requiredFeatures = []) => {
  return async (req, res, next) => {
    if (!req.company) {
      return res.status(400).json({
        message: 'Company context required for this operation'
      });
    }

    // Check if company has all required features
    for (const feature of requiredFeatures) {
      if (!req.company.features[feature]) {
        return res.status(402).json({
          message: `Feature not available: ${feature}`,
          feature: feature
        });
      }
    }

    next();
  };
};

/**
 * Middleware to check company limits (e.g., ticket volume, agent seats)
 */
const checkCompanyLimits = (resourceType = 'tickets') => {
  return async (req, res, next) => {
    if (!req.company) {
      return res.status(400).json({
        message: 'Company context required for this operation'
      });
    }

    // This would check actual usage against limits
    // In a real implementation, you'd track usage in the database
    if (resourceType === 'tickets') {
      // Example: check if company has reached ticket limit
      const currentTickets = 0; // Would come from actual database query
      if (currentTickets >= req.company.features.ticketVolume) {
        return res.status(402).json({
          message: `Ticket limit reached: ${req.company.features.ticketVolume} tickets per month`
        });
      }
    }

    next();
  };
};

module.exports = {
  tenantMiddleware,
  tenantAuthMiddleware,
  checkCompanyFeatures,
  checkCompanyLimits
};