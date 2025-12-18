const Partnership = require('../models/Partnership');
const Company = require('../models/Company');
const User = require('../models/User');

// Create a partnership request
exports.createPartnershipRequest = async (req, res) => {
  try {
    const { requestedCompanyId, accessLevel, partnershipName, partnershipDescription } = req.body;

    // Verify the requesting user belongs to the requesting company
    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required' });
    }

    // Ensure the requesting user's company is not the same as requested company
    if (req.companyId.toString() === requestedCompanyId) {
      return res.status(400).json({ message: 'Cannot create partnership with your own company' });
    }

    // Check if a partnership already exists between these companies
    const existingPartnership = await Partnership.findOne({
      $or: [
        { requestingCompanyId: req.companyId, requestedCompanyId },
        { requestingCompanyId: requestedCompanyId, requestedCompanyId: req.companyId }
      ]
    });

    if (existingPartnership) {
      return res.status(400).json({
        message: 'A partnership request already exists between these companies'
      });
    }

    // Create the partnership request
    const partnership = new Partnership({
      requestingCompanyId: req.companyId,
      requestedCompanyId,
      accessLevel,
      partnershipName,
      partnershipDescription,
      status: 'pending'
    });

    await partnership.save();

    // Populate references
    await partnership.populate('requestingCompanyId', 'name');
    await partnership.populate('requestedCompanyId', 'name');

    res.status(201).json(partnership);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get partnership requests for the current company (to approve/reject)
exports.getPartnershipRequests = async (req, res) => {
  try {
    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required' });
    }

    const partnerships = await Partnership.find({
      requestedCompanyId: req.companyId,
      status: 'pending'
    })
      .populate('requestingCompanyId', 'name email')
      .populate('requestedCompanyId', 'name email')
      .sort({ createdAt: -1 });

    res.json(partnerships);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get partnerships for the current company
exports.getPartnerships = async (req, res) => {
  try {
    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required' });
    }

    const partnerships = await Partnership.find({
      $or: [
        { requestingCompanyId: req.companyId, status: 'approved' },
        { requestedCompanyId: req.companyId, status: 'approved' }
      ]
    })
      .populate('requestingCompanyId', 'name')
      .populate('requestedCompanyId', 'name')
      .sort({ createdAt: -1 });

    res.json(partnerships);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve a partnership request
exports.approvePartnership = async (req, res) => {
  try {
    const { partnershipId } = req.params;

    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required' });
    }

    // Find the partnership request
    let partnership = await Partnership.findOne({
      _id: partnershipId,
      requestedCompanyId: req.companyId,
      status: 'pending'
    });

    if (!partnership) {
      return res.status(404).json({ message: 'Partnership request not found or already processed' });
    }

    // Update the partnership to approved
    partnership.status = 'approved';
    partnership.approvedAt = new Date();

    // Set default permissions based on access level
    switch(partnership.accessLevel) {
      case 'contacts':
        partnership.permissions = {
          canSeeAgents: true,
          canContactAgents: true,
          canAssignTickets: false,
          canViewTickets: false
        };
        break;
      case 'agents':
        partnership.permissions = {
          canSeeAgents: true,
          canContactAgents: true,
          canAssignTickets: true,
          canViewTickets: false
        };
        break;
      case 'tickets':
        partnership.permissions = {
          canSeeAgents: true,
          canContactAgents: true,
          canAssignTickets: true,
          canViewTickets: true
        };
        break;
      default:
        partnership.permissions = {
          canSeeAgents: true,
          canContactAgents: true,
          canAssignTickets: false,
          canViewTickets: false
        };
    }

    await partnership.save();

    // Populate references
    await partnership.populate('requestingCompanyId', 'name');
    await partnership.populate('requestedCompanyId', 'name');

    res.json(partnership);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject a partnership request
exports.rejectPartnership = async (req, res) => {
  try {
    const { partnershipId } = req.params;

    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required' });
    }

    // Find the partnership request
    const partnership = await Partnership.findOne({
      _id: partnershipId,
      requestedCompanyId: req.companyId,
      status: 'pending'
    });

    if (!partnership) {
      return res.status(404).json({ message: 'Partnership request not found or already processed' });
    }

    // Update the partnership to rejected
    partnership.status = 'rejected';
    await partnership.save();

    res.json({ message: 'Partnership request rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Withdraw a partnership request
exports.withdrawPartnership = async (req, res) => {
  try {
    const { partnershipId } = req.params;

    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required' });
    }

    // Find the partnership (either as requesting or requested company)
    const partnership = await Partnership.findOne({
      _id: partnershipId,
      $or: [
        { requestingCompanyId: req.companyId },
        { requestedCompanyId: req.companyId }
      ],
      status: 'pending'
    });

    if (!partnership) {
      return res.status(404).json({ message: 'Partnership request not found or already processed' });
    }

    // Only the requesting company can withdraw
    if (partnership.requestingCompanyId.toString() !== req.companyId.toString()) {
      return res.status(403).json({ message: 'Only the requesting company can withdraw' });
    }

    await Partnership.findByIdAndDelete(partnershipId);

    res.json({ message: 'Partnership request withdrawn' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel an approved partnership
exports.cancelPartnership = async (req, res) => {
  try {
    const { partnershipId } = req.params;

    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required' });
    }

    // Find the partnership
    const partnership = await Partnership.findOne({
      _id: partnershipId,
      $or: [
        { requestingCompanyId: req.companyId },
        { requestedCompanyId: req.companyId }
      ],
      status: 'approved'
    });

    if (!partnership) {
      return res.status(404).json({ message: 'Partnership not found or not approved' });
    }

    // Allow either company to cancel the partnership
    await Partnership.findByIdAndDelete(partnershipId);

    res.json({ message: 'Partnership cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get partner companies' agents (for assignment in tickets)
exports.getPartnerAgents = async (req, res) => {
  try {
    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required' });
    }

    // Find approved partnerships where this company can see partner agents
    const partnerships = await Partnership.find({
      $and: [
        {
          $or: [
            { requestingCompanyId: req.companyId },
            { requestedCompanyId: req.companyId }
          ]
        },
        { status: 'approved' },
        { 'permissions.canSeeAgents': true }
      ]
    });

    // Extract partner company IDs (the company that's not the current one)
    const partnerCompanyIds = [];
    partnerships.forEach(partnership => {
      if (partnership.requestingCompanyId.toString() === req.companyId.toString()) {
        partnerCompanyIds.push(partnership.requestedCompanyId);
      } else {
        partnerCompanyIds.push(partnership.requestingCompanyId);
      }
    });

    // Get all agents from partner companies
    const partnerAgents = await User.find({
      companyId: { $in: partnerCompanyIds },
      role: { $in: ['support_agent', 'superadmin'] },
      isActive: true
    }).populate('companyId', 'name');

    res.json(partnerAgents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get partner companies for dropdowns, etc.
exports.getPartnerCompanies = async (req, res) => {
  try {
    if (!req.companyId) {
      return res.status(400).json({ message: 'Company context required' });
    }

    // Find approved partnerships
    const partnerships = await Partnership.find({
      $and: [
        {
          $or: [
            { requestingCompanyId: req.companyId },
            { requestedCompanyId: req.companyId }
          ]
        },
        { status: 'approved' }
      ]
    });

    // Extract partner company IDs (the company that's not the current one)
    const partnerCompanyIds = [];
    partnerships.forEach(partnership => {
      if (partnership.requestingCompanyId.toString() === req.companyId.toString()) {
        partnerCompanyIds.push(partnership.requestedCompanyId);
      } else {
        partnerCompanyIds.push(partnership.requestingCompanyId);
      }
    });

    // Get partner companies
    const partnerCompanies = await Company.find({
      _id: { $in: partnerCompanyIds }
    });

    res.json(partnerCompanies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};