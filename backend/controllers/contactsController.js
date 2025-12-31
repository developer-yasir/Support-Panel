// controllers/contactsController.js
const User = require('../models/User');

const getAllContacts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { companyId: req.companyId }; // Tenant isolation

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Limit results for autocomplete performance
    const contacts = await User.find(query)
      .select('name email role avatar')
      .limit(20);

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getContactById = async (req, res) => {
  try {
    const contact = await User.findById(req.params.id).select('name email createdAt role');
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createContact = async (req, res) => {
  try {
    const { name, email, phone, companyId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Contact with this email already exists' });
    }

    // If companyId is provided, get the company name
    let companyName = '';
    const Company = require('../models/Company');
    if (companyId) {
      const companyDoc = await Company.findById(companyId);
      if (companyDoc) {
        companyName = companyDoc.name;
      }
    }

    const user = new User({
      name,
      email,
      phone,
      company: companyName,
      companyId: companyId, // Explicitly linking to the Tenant/Company
      password: 'default_password' // In real app, you might want to send email verification
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact
};