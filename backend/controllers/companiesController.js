// controllers/companiesController.js
const Company = require('../models/Company');

const getAllCompanies = async (req, res) => {
  try {
    // This endpoint should only be accessible to system admins
    // Verify user is an admin with system-level access
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin access required' });
    }
    
    // For admin users, return all companies in the system
    const allCompanies = await Company.find({})
      .select('name subdomain billingEmail contactEmail plan features createdAt active suspended')
      .sort({ createdAt: -1 });
    
    // Format companies for frontend consumption
    const formattedCompanies = allCompanies.map(company => ({
      id: company._id.toString(),
      name: company.name,
      domain: `${company.subdomain}.${process.env.MAIN_DOMAIN || 'yourapp.com'}`,
      contacts: 0, // This would be populated via a different query in a real system
      tickets: 0, // This would be populated via a different query in a real system
      plan: company.plan,
      status: company.active ? (company.suspended ? 'suspended' : 'active') : 'inactive',
      avatar: company.name.substring(0, 2).toUpperCase()
    }));
    
    res.status(200).json(formattedCompanies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCompanyById = async (req, res) => {
  try {
    // Implementation for getting a specific company by ID
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCompany = async (req, res) => {
  try {
    // Implementation for creating a new company
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany
};