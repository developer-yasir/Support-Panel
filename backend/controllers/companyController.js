const Company = require('../models/Company');
const User = require('../models/User');
const { generate } = require('generate-password');

// Create a new company (for signup process)
exports.createCompany = async (req, res) => {
  try {
    const { 
      name, 
      subdomain, 
      billingEmail, 
      contactEmail,
      ownerName,
      ownerEmail,
      ownerPassword
    } = req.body;

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

    // Create the company
    const company = new Company({
      name,
      subdomain: subdomain.toLowerCase(),
      billingEmail: billingEmail.toLowerCase(),
      contactEmail: contactEmail.toLowerCase()
    });

    await company.save();

    // Create the owner/admin user for this company
    const ownerUser = new User({
      name: ownerName,
      email: ownerEmail.toLowerCase(),
      password: ownerPassword,
      role: 'admin',
      isActive: true,
      companyId: company._id
    });

    await ownerUser.save();

    // Update company with owner information
    company.ownerId = ownerUser._id;
    await company.save();

    // Return success response without sensitive data
    res.status(201).json({
      message: 'Company created successfully',
      company: {
        id: company._id,
        name: company.name,
        subdomain: company.subdomain,
        billingEmail: company.billingEmail
      },
      owner: {
        id: ownerUser._id,
        name: ownerUser.name,
        email: ownerUser.email
      }
    });
  } catch (error) {
    console.error('Error creating company:', error);
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