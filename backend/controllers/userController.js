const User = require('../models/User');

// Get users with optional role filtering
exports.getUsers = async (req, res) => {
  try {
    // Verify company context exists
    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required to get users' });
    }
    
    const { role } = req.query;
    let filter = { companyId: req.companyId }; // Add company filter
    
    if (role) {
      filter.role = role;
    }
    
    const users = await User.find(filter, 'name email role isActive');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    // Verify company context exists
    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required to get user' });
    }
    
    const user = await User.findOne({
      _id: req.params.id,
      companyId: req.companyId
    }, 'name email role isActive company');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    // Verify company context exists
    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required to create user' });
    }
    
    const { name, email, password, role = 'support_agent', company, isActive = true } = req.body;

    // Check if user already exists in this company
    const existingUser = await User.findOne({ 
      email: email.toLowerCase(),
      companyId: req.companyId 
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email in your company' });
    }

    // Create new user with company association
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role,
      company,
      isActive,
      companyId: req.companyId  // Associate with current company
    });

    await user.save();

    // Return user info but without sensitive data
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user status (activate/deactivate)
exports.updateUserStatus = async (req, res) => {
  try {
    // Verify company context exists
    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required to update user status' });
    }
    
    const { isActive } = req.body;
    
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },  // Add company filter
      { isActive },
      { new: true, select: 'name email role isActive company' }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    // Verify company context exists
    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required to delete user' });
    }
    
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      companyId: req.companyId  // Add company filter
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};