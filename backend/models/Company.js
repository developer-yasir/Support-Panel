const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subdomain: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  domain: {
    type: String,
    trim: true,
    lowercase: true
  },
  logo: {
    type: String, // URL to logo image
    default: null
  },
  brandingColor: {
    type: String, // Hex color for primary branding
    default: '#1976d2' // Default blue
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  billingEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  plan: {
    type: String,
    enum: ['free', 'starter', 'professional', 'enterprise'],
    default: 'free'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'annually'],
    default: 'monthly'
  },
  active: {
    type: Boolean,
    default: true
  },
  trialExpiry: {
    type: Date,
    default: null
  },
  features: {
    agentSeats: {
      type: Number,
      default: 1 // For free plan
    },
    ticketVolume: {
      type: Number,
      default: 100 // Monthly ticket limit
    },
    customFields: {
      type: Boolean,
      default: false
    },
    reporting: {
      type: Boolean,
      default: false
    },
    apiAccess: {
      type: Boolean,
      default: false
    },
    customBranding: {
      type: Boolean,
      default: false
    },
    sso: {
      type: Boolean,
      default: false
    }
  },
  subscriptionId: {
    type: String, // Stripe/Paddle subscription ID
    default: null
  },
  stripeCustomerId: {
    type: String, // Stripe customer ID
    default: null
  },
  suspended: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster lookups
companySchema.index({ subdomain: 1 });
companySchema.index({ domain: 1 });
companySchema.index({ billingEmail: 1 });
companySchema.index({ active: 1 });

// Virtual for total agents
companySchema.virtual('agentCount').get(function() {
  // This would be populated when the company document is populated with agents
  return this.agents ? this.agents.length : 0;
});

// Virtual for usage metrics
companySchema.virtual('usage').get(function() {
  // This would contain usage metrics
  return {
    ticketsThisMonth: this.ticketsThisMonth || 0,
    agentsUsed: this.agentsUsed || 0,
    storageUsed: this.storageUsed || 0
  };
});

module.exports = mongoose.model('Company', companySchema);