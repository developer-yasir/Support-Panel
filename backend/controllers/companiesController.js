// controllers/companiesController.js
const User = require('../models/User');

const getAllCompanies = async (req, res) => {
  try {
    // In a real implementation, this would fetch companies from the database
    // For now, we'll aggregate users by company
    const companies = await User.aggregate([
      {
        $group: {
          _id: "$company",
          count: { $sum: 1 },
          contacts: { $push: { name: "$name", email: "$email" } }
        }
      },
      {
        $match: {
          _id: { $ne: null }
        }
      }
    ]);
    
    // Format the response to match the frontend expectations
    const formattedCompanies = companies.map((company, index) => ({
      id: index + 1,
      name: company._id,
      domain: company._id ? `${company._id.replace(/\s+/g, '').toLowerCase()}.com` : 'example.com',
      contacts: company.count,
      tickets: Math.floor(Math.random() * 100), // Random ticket count for demo
      plan: ['Standard', 'Premium', 'Enterprise'][Math.floor(Math.random() * 3)],
      status: ['active', 'trial', 'inactive'][Math.floor(Math.random() * 3)],
      avatar: company._id ? company._id.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2) : 'CO'
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