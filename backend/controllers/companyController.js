const Company = require('../models/Company');
const User = require('../models/User');
const { generate } = require('generate-password');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Create a new company (for signup process or existing user creating company)
exports.createCompany = async (req, res) => {
  try {
    const { 
      name, 
      subdomain, 
      billingEmail, 
      contactEmail,
      ownerName: providedOwnerName,
      ownerEmail: providedOwnerEmail,
      ownerPassword: providedOwnerPassword
    } = req.body;

    // Check if this is from an authenticated user (creating company from within the app)
    // req.user would be available if the route is protected
    let ownerName, ownerEmail;
    
    if (req.user) {
      // Use the authenticated user as the owner
      ownerName = req.user.name;
      ownerEmail = req.user.email;
    } else {
      // Use the provided owner information (for signup process)
      ownerName = providedOwnerName;
      ownerEmail = providedOwnerEmail;
    }

    // Validate required fields
    if (!name || !subdomain || !billingEmail || !contactEmail || !ownerName || !ownerEmail) {
      return res.status(400).json({ 
        message: 'All fields are required: name, subdomain, billingEmail, contactEmail, ownerName, ownerEmail' 
      });
    }
    
    // For signup process (unauthenticated), ownerPassword is required
    if (!req.user && !providedOwnerPassword) {
      return res.status(400).json({ 
        message: 'Owner password is required for new signups' 
      });
    }

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingEmail) || !emailRegex.test(contactEmail) || !emailRegex.test(ownerEmail)) {
      return res.status(400).json({ 
        message: 'Please provide valid email addresses' 
      });
    }

    // Check if subdomain is already taken
    const existingCompany = await Company.findOne({ subdomain: subdomain.toLowerCase() });
    if (existingCompany) {
      return res.status(400).json({ 
        message: 'Subdomain is already taken. Please choose another one.' 
      });
    }

    // Check if billing email is already associated with another company
    const existingBillingEmail = await Company.findOne({ billingEmail: billingEmail.toLowerCase() });
    if (existingBillingEmail) {
      return res.status(400).json({ 
        message: 'A company is already registered with this billing email.' 
      });
    }

    // Check if this is a new signup (unauthenticated) vs existing user creating company
    if (!req.user) {
      // Check if owner email is already taken (for signup process)
      const existingUser = await User.findOne({ email: ownerEmail.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'A user is already registered with this email address.' 
        });
      }
    }

    // Create the company
    const company = new Company({
      name,
      subdomain: subdomain.toLowerCase(),
      billingEmail: billingEmail.toLowerCase(),
      contactEmail: contactEmail.toLowerCase(),
      // Set up free plan by default
      plan: 'free',
      features: getPlanFeatures('free')
    });

    await company.save();

    let ownerUser;
    
    if (req.user) {
      // For existing authenticated users, update their company assignment
      // The authenticated user becomes the admin of the new company
      await User.findByIdAndUpdate(
        req.user.id,
        { 
          role: 'admin',
          companyId: company._id
        }
      );
      
      // Update the req.user object to reflect the new company assignment
      req.user.role = 'admin';
      req.user.companyId = company._id;
      ownerUser = req.user; // Use the existing user
    } else {
      // For new signups, create a new owner user
      ownerUser = new User({
        name: ownerName,
        email: ownerEmail.toLowerCase(),
        password: providedOwnerPassword, // Use the password that was provided
        role: 'admin',
        isActive: true,
        isEmailVerified: true, // Auto-verify for signup
        companyId: company._id
      });

      await ownerUser.save();
    }

    // Update company with owner information
    company.ownerId = ownerUser._id;
    await company.save();

    if (req.user) {
      // For authenticated users, update the current user's session data
      // Don't generate a new token, just return company info
      res.status(201).json({
        message: 'Company created successfully',
        company: {
          id: company._id,
          name: company.name,
          subdomain: company.subdomain,
          billingEmail: company.billingEmail,
          plan: company.plan,
          features: company.features
        },
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: 'admin' // Updated to admin since they're now an admin of this new company
        }
      });
    } else {
      // Generate JWT token for the new user (for signup process)
      const token = jwt.sign(
        { id: ownerUser._id, companyId: company._id },
        config.jwtSecret,
        { expiresIn: '30d' }
      );

      // Return success response with token (for signup process)
      res.status(201).json({
        message: 'Company created successfully',
        token,
        company: {
          id: company._id,
          name: company.name,
          subdomain: company.subdomain,
          billingEmail: company.billingEmail,
          plan: company.plan,
          features: company.features
        },
        user: {
          id: ownerUser._id,
          name: ownerUser.name,
          email: ownerUser.email,
          role: ownerUser.role
        }
      });
    }
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check if subdomain is available
exports.checkSubdomainAvailability = async (req, res) => {
  try {
    const { subdomain } = req.params;
    
    if (!subdomain) {
      return res.status(400).json({ message: 'Subdomain parameter is required' });
    }

    const existingCompany = await Company.findOne({ 
      subdomain: subdomain.toLowerCase() 
    });
    
    res.json({
      available: !existingCompany,
      subdomain: subdomain.toLowerCase()
    });
  } catch (error) {
    console.error('Error checking subdomain availability:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get company setup information (for signup form)
exports.getCompanySetupInfo = async (req, res) => {
  try {
    const plans = {
      free: {
        name: 'Free',
        price: 0,
        features: {
          agentSeats: 1,
          ticketVolume: 100,
          customFields: false,
          reporting: false,
          apiAccess: false,
          customBranding: false,
          sso: false
        }
      },
      starter: {
        name: 'Starter',
        price: 29,
        features: {
          agentSeats: 3,
          ticketVolume: 500,
          customFields: true,
          reporting: true,
          apiAccess: false,
          customBranding: false,
          sso: false
        }
      },
      professional: {
        name: 'Professional',
        price: 79,
        features: {
          agentSeats: 10,
          ticketVolume: 2000,
          customFields: true,
          reporting: true,
          apiAccess: true,
          customBranding: true,
          sso: false
        }
      },
      enterprise: {
        name: 'Enterprise',
        price: 199,
        features: {
          agentSeats: 50,
          ticketVolume: 10000,
          customFields: true,
          reporting: true,
          apiAccess: true,
          customBranding: true,
          sso: true
        }
      }
    };

    res.json({
      plans,
      defaultPlan: 'free',
      termsOfService: 'Standard terms and conditions apply',
      privacyPolicy: 'User data is protected according to our privacy policy'
    });
  } catch (error) {
    console.error('Error getting setup info:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get company by ID (for internal use)
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get company by subdomain (for subdomain routing)
exports.getCompanyBySubdomain = async (req, res) => {
  try {
    const { subdomain } = req.params;
    
    const company = await Company.findOne({ 
      subdomain: subdomain.toLowerCase(),
      active: true,
      suspended: false
    });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current company (from request context)
exports.getCurrentCompany = async (req, res) => {
  try {
    if (!req.company) {
      return res.status(400).json({ message: 'No company context found in request' });
    }

    res.json(req.company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update company information
exports.updateCompany = async (req, res) => {
  try {
    if (!req.company) {
      return res.status(400).json({ message: 'No company context found in request' });
    }

    const allowedUpdates = [
      'name', 'logo', 'brandingColor', 'timezone', 'currency',
      'billingEmail', 'contactEmail', 'phone', 'address',
      'domain'
    ];

    const updates = {};
    for (const key in req.body) {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    const company = await Company.findByIdAndUpdate(
      req.company._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get company stats
exports.getCompanyStats = async (req, res) => {
  try {
    if (!req.company) {
      return res.status(400).json({ message: 'No company context found in request' });
    }

    // In a real implementation, you would calculate actual stats
    // This is a simplified example
    const Ticket = require('../models/Ticket');
    const User = require('../models/User');
    const Contact = require('../models/Contact');

    const totalTickets = await Ticket.countDocuments({ companyId: req.company._id });
    const totalAgents = await User.countDocuments({ 
      companyId: req.company._id, 
      role: 'support_agent' 
    });
    const totalContacts = await Contact.countDocuments({ companyId: req.company._id });

    res.json({
      totalTickets,
      totalAgents,
      totalContacts,
      plan: req.company.plan,
      features: req.company.features
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get company users/agents
exports.getCompanyAgents = async (req, res) => {
  try {
    if (!req.company) {
      return res.status(400).json({ message: 'No company context found in request' });
    }

    const { page = 1, limit = 10, search = '' } = req.query;

    const query = { 
      companyId: req.company._id,
      role: { $in: ['admin', 'support_agent'] }
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const agents = await User.find(query)
      .select('name email role isActive createdAt lastLogin')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      agents,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Suspend company (admin only)
exports.suspendCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { suspended: true },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ message: 'Company suspended successfully', company });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Activate company (admin only)
exports.activateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { suspended: false },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ message: 'Company activated successfully', company });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change company plan
exports.changePlan = async (req, res) => {
  try {
    const { plan } = req.body;

    // Verify plan is valid
    const validPlans = ['free', 'starter', 'professional', 'enterprise'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    if (!req.company) {
      return res.status(400).json({ message: 'No company context found in request' });
    }

    // Update company plan with appropriate features
    const planFeatures = getPlanFeatures(plan);
    const updatedCompany = await Company.findByIdAndUpdate(
      req.company._id,
      { 
        plan,
        'features.agentSeats': planFeatures.agentSeats,
        'features.ticketVolume': planFeatures.ticketVolume,
        'features.customFields': planFeatures.customFields,
        'features.reporting': planFeatures.reporting,
        'features.apiAccess': planFeatures.apiAccess,
        'features.customBranding': planFeatures.customBranding,
        'features.sso': planFeatures.sso
      },
      { new: true }
    );

    res.json({ message: 'Plan updated successfully', company: updatedCompany });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to get features for each plan
function getPlanFeatures(plan) {
  switch (plan) {
    case 'free':
      return {
        agentSeats: 1,
        ticketVolume: 100,
        customFields: false,
        reporting: false,
        apiAccess: false,
        customBranding: false,
        sso: false
      };
    case 'starter':
      return {
        agentSeats: 3,
        ticketVolume: 500,
        customFields: true,
        reporting: true,
        apiAccess: false,
        customBranding: false,
        sso: false
      };
    case 'professional':
      return {
        agentSeats: 10,
        ticketVolume: 2000,
        customFields: true,
        reporting: true,
        apiAccess: true,
        customBranding: true,
        sso: false
      };
    case 'enterprise':
      return {
        agentSeats: 50, // or unlimited
        ticketVolume: 10000, // or unlimited
        customFields: true,
        reporting: true,
        apiAccess: true,
        customBranding: true,
        sso: true
      };
    default:
      return getPlanFeatures('free'); // Default to free
  }
}