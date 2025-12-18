const User = require('../models/User');

// Get users with optional role filtering
exports.getUsers = async (req, res) => {
  try {
    // Verify company context exists
    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required to get users' });
    }

    if (req.user.role !== 'superadmin') {
      filter.companyId = req.companyId; // Non-admins can only see users from their company
    }

    const { role } = req.query;
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter, 'name email role isActive companyId');

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

    // Admin can access any user; others can only access users from their company
    const query = { _id: req.params.id };
    if (req.user.role !== 'superadmin') {
      query.companyId = req.companyId;
    }

    const user = await User.findOne(query, 'name email role isActive company');

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

    // Check if user is a company manager trying to create a user with a role they can't assign
    if (req.user.role === 'company_manager' && role === 'company_manager') {
      return res.status(403).json({ message: 'Company managers cannot create other company managers' });
    }

    // Determine which company to associate the user with
    let targetCompanyId = req.companyId;
    if (req.user.role === 'superadmin' && req.body.companyId) {
      // Admins can create users for a specific company
      targetCompanyId = req.body.companyId;
    }

    // Check if user already exists in this company
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      companyId: targetCompanyId
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
      companyId: targetCompanyId  // Associate with appropriate company
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
      companyId: user.companyId,
      createdAt: user.createdAt
    };

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    // Verify company context exists
    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required to update user' });
    }

    const { isActive, role } = req.body;

    // If updating role, check if company manager is trying to assign company manager role
    if (req.user.role === 'company_manager' && role === 'company_manager') {
      return res.status(403).json({ message: 'Company managers cannot assign company manager role to other users' });
    }

    // Build update object
    const updateData = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (role !== undefined) updateData.role = role;

    // Superadmin can update any user; others can only update users from their company
    const query = { _id: req.params.id };
    if (req.user.role !== 'superadmin') {
      query.companyId = req.companyId;
    }

    const user = await User.findOneAndUpdate(
      query,
      updateData,
      { new: true, select: 'name email role isActive company companyId' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user status (activate/deactivate) - only for toggling isActive, not for role changes
exports.updateUserStatus = async (req, res) => {
  try {
    // Verify company context exists
    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required to update user status' });
    }

    const { isActive } = req.body;

    // Only update isActive field, not role
    const updateData = { isActive };

    // Superadmin can update any user status; others can only update users from their company
    const query = { _id: req.params.id };
    if (req.user.role !== 'superadmin') {
      query.companyId = req.companyId;
    }

    const user = await User.findOneAndUpdate(
      query,
      updateData,
      { new: true, select: 'name email role isActive company companyId' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ isActive: user.isActive, role: user.role });
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

    // Superadmin can delete any user; others can only delete users from their company
    const query = { _id: req.params.id };
    if (req.user.role !== 'superadmin') {
      query.companyId = req.companyId;
    }

    const user = await User.findOneAndDelete(query);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};