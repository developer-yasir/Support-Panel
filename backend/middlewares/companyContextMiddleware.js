const Company = require('../models/Company');
const User = require('../models/User');

/**
 * Company context middleware
 * Sets the company context either from subdomain, user's company, or other sources
 */
const companyContextMiddleware = async (req, res, next) => {
  try {
    let company = null;

    // Method 1: Try to get company from Express subdomain (when using vhost or express subdomain feature)
    if (req.subdomain && req.subdomain !== 'www' && req.subdomain !== 'api') {
      company = await Company.findOne({
        subdomain: req.subdomain.toLowerCase(),
        active: true,
        suspended: false
      });
    }

    // Method 2: Try to get company from host header (fallback if subdomain property isn't set)
    if (!company && req.headers.host) {
      const host = req.headers.host;
      const subdomain = extractSubdomain(host);
      
      if (subdomain && subdomain !== 'www' && subdomain !== req.subdomain) {
        company = await Company.findOne({
          subdomain: subdomain,
          active: true,
          suspended: false
        });
      }
    }

    // Method 3: After auth middleware has set req.user, try to get company from user
    // This will work if authentication middleware runs before this
    if (!company && req.user && req.user.companyId) {
      company = await Company.findById(req.user.companyId);
    }

    // Method 4: Try to get from company header
    if (!company && req.headers['x-company-id']) {
      company = await Company.findById(req.headers['x-company-id']);
    }

    // Method 5: Try to get from cookie (for frontend requests)
    if (!company && req.cookies && req.cookies.companyId) {
      company = await Company.findById(req.cookies.companyId);
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
      req.subdomain = req.subdomain || company.subdomain; // Ensure subdomain is set
    } else {
      // If no company is found through other means, check if the auth middleware 
      // has already set the company context (from user.companyId)
      if (req.user && req.user.companyId) {
        // Use the user's company as the context
        req.companyId = req.user.companyId;
        req.company = req.user.companyId; // This will be an ObjectId if not populated
        req.tenant = req.user.companyId;
      } else {
        // No company context found
        req.companyId = null;
        req.company = null;
        req.tenant = null;
      }
    }

    next();
  } catch (error) {
    console.error('Company context middleware error:', error);
    res.status(500).json({
      message: 'Internal server error during company context identification'
    });
  }
};

/**
 * Extract subdomain from host header
 * @param {string} host - Host header value
 * @returns {string|null} - Subdomain if found, null otherwise
 */
function extractSubdomain(host) {
  try {
    // Remove port if present (e.g., localhost:3000)
    const cleanHost = host.split(':')[0];
    
    // Split host into parts
    const parts = cleanHost.split('.');
    
    // For example.com: parts = ['example', 'com'] - no subdomain
    // For app.example.com: parts = ['app', 'example', 'com'] - subdomain is 'app'
    // For mycompany.yourapp.com: parts = ['mycompany', 'yourapp', 'com'] - subdomain is 'mycompany'
    
    if (parts.length >= 3) {
      return parts[0]; // First part is usually the subdomain
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting subdomain:', error);
    return null;
  }
}

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
  companyContextMiddleware,
  tenantAuthMiddleware,
  checkCompanyFeatures,
  checkCompanyLimits,
  extractSubdomain
};