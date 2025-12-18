const mongoose = require('mongoose');

const partnershipSchema = new mongoose.Schema({
  requestingCompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  requestedCompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  accessLevel: {
    type: String,
    enum: ['contacts', 'agents', 'tickets'],
    default: 'contacts' // Default: can see contacts only
  },
  permissions: {
    canSeeAgents: { type: Boolean, default: false },
    canAssignTickets: { type: Boolean, default: false },
    canViewTickets: { type: Boolean, default: false },
    canContactAgents: { type: Boolean, default: false }
  },
  partnershipName: {
    type: String,
    trim: true
  },
  partnershipDescription: {
    type: String,
    trim: true
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique partnership requests between companies
partnershipSchema.index({ requestingCompanyId: 1, requestedCompanyId: 1 }, { unique: true });
partnershipSchema.index({ status: 1 });
partnershipSchema.index({ requestingCompanyId: 1, status: 1 });
partnershipSchema.index({ requestedCompanyId: 1, status: 1 });

module.exports = mongoose.model('Partnership', partnershipSchema);