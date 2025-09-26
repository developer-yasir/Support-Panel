// controllers/contactsController.js
const User = require('../models/User');

const getAllContacts = async (req, res) => {
  try {
    // In a real implementation, this would fetch contacts from the database
    // For now, returning mock data like in the frontend
    const contacts = await User.find({}).select('name email createdAt role');
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
    const { name, email, phone, company } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Contact with this email already exists' });
    }
    
    const user = new User({
      name,
      email,
      phone,
      company,
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