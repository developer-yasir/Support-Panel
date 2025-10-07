// controllers/companiesController.js
const User = require('../models/User');

const getAllCompanies = async (req, res) => {
  try {
    // Get companies from the database
    const dbCompanies = await User.aggregate([
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
    
    // Format database companies
    const formattedDbCompanies = dbCompanies.map((company, index) => ({
      id: `db-${index + 1}`, // Use different ID format to distinguish
      name: company._id,
      domain: company._id ? `${company._id.replace(/\s+/g, '').toLowerCase()}.com` : 'example.com',
      contacts: company.count,
      tickets: Math.floor(Math.random() * 100), // Random ticket count for demo
      plan: ['Standard', 'Premium', 'Enterprise'][Math.floor(Math.random() * 3)],
      status: ['active', 'trial', 'inactive'][Math.floor(Math.random() * 3)],
      avatar: company._id ? company._id.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2) : 'CO'
    }));
    
    // Define hardcoded companies to always show
    const hardcodedCompanies = [
      {
        id: 'comp-1',
        name: 'Sharaf DG',
        domain: 'sharafdg.com',
        contacts: Math.floor(Math.random() * 10) + 5, // Random contacts between 5-14
        tickets: Math.floor(Math.random() * 50) + 20, // Random tickets between 20-69
        plan: ['Standard', 'Premium', 'Enterprise'][Math.floor(Math.random() * 3)],
        status: ['active', 'trial', 'inactive'][Math.floor(Math.random() * 3)],
        avatar: 'SD'
      },
      {
        id: 'comp-2',
        name: 'RAK Ceramics',
        domain: 'rakceramics.com',
        contacts: Math.floor(Math.random() * 10) + 5,
        tickets: Math.floor(Math.random() * 50) + 20,
        plan: ['Standard', 'Premium', 'Enterprise'][Math.floor(Math.random() * 3)],
        status: ['active', 'trial', 'inactive'][Math.floor(Math.random() * 3)],
        avatar: 'RC'
      },
      {
        id: 'comp-3',
        name: 'ASC',
        domain: 'asc.com',
        contacts: Math.floor(Math.random() * 10) + 5,
        tickets: Math.floor(Math.random() * 50) + 20,
        plan: ['Standard', 'Premium', 'Enterprise'][Math.floor(Math.random() * 3)],
        status: ['active', 'trial', 'inactive'][Math.floor(Math.random() * 3)],
        avatar: 'AS'
      },
      {
        id: 'comp-4',
        name: 'Ecovyst',
        domain: 'ecovyst.com',
        contacts: Math.floor(Math.random() * 10) + 5,
        tickets: Math.floor(Math.random() * 50) + 20,
        plan: ['Standard', 'Premium', 'Enterprise'][Math.floor(Math.random() * 3)],
        status: ['active', 'trial', 'inactive'][Math.floor(Math.random() * 3)],
        avatar: 'EC'
      },
      {
        id: 'comp-5',
        name: 'LLR',
        domain: 'llr.com',
        contacts: Math.floor(Math.random() * 10) + 5,
        tickets: Math.floor(Math.random() * 50) + 20,
        plan: ['Standard', 'Premium', 'Enterprise'][Math.floor(Math.random() * 3)],
        status: ['active', 'trial', 'inactive'][Math.floor(Math.random() * 3)],
        avatar: 'LL'
      },
      {
        id: 'comp-6',
        name: 'Rubaiyat',
        domain: 'rubaiyat.com',
        contacts: Math.floor(Math.random() * 10) + 5,
        tickets: Math.floor(Math.random() * 50) + 20,
        plan: ['Standard', 'Premium', 'Enterprise'][Math.floor(Math.random() * 3)],
        status: ['active', 'trial', 'inactive'][Math.floor(Math.random() * 3)],
        avatar: 'RU'
      },
      {
        id: 'comp-7',
        name: 'Abu Dhabi Ports',
        domain: 'abudhabiports.com',
        contacts: Math.floor(Math.random() * 10) + 5,
        tickets: Math.floor(Math.random() * 50) + 20,
        plan: ['Standard', 'Premium', 'Enterprise'][Math.floor(Math.random() * 3)],
        status: ['active', 'trial', 'inactive'][Math.floor(Math.random() * 3)],
        avatar: 'AP'
      },
      {
        id: 'comp-8',
        name: 'Innovent',
        domain: 'innovent.com',
        contacts: Math.floor(Math.random() * 10) + 5,
        tickets: Math.floor(Math.random() * 50) + 20,
        plan: ['Standard', 'Premium', 'Enterprise'][Math.floor(Math.random() * 3)],
        status: ['active', 'trial', 'inactive'][Math.floor(Math.random() * 3)],
        avatar: 'IN'
      }
    ];
    
    // Merge hardcoded companies with database companies
    // If a company exists in both, prefer the database version (to avoid duplicates)
    const allCompanies = [...hardcodedCompanies];
    
    // Add db companies that aren't in hardcoded list
    const hardCodedNames = hardcodedCompanies.map(comp => comp.name);
    const uniqueDbCompanies = formattedDbCompanies.filter(dbComp => !hardCodedNames.includes(dbComp.name));
    
    const finalCompanies = [...allCompanies, ...uniqueDbCompanies];
    
    res.status(200).json(finalCompanies);
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