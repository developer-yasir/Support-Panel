const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  clientCompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClientCompany',
    default: null
  }
}, {
  timestamps: true
});

// Add indexes for better performance
contactSchema.index({ companyId: 1 });
contactSchema.index({ email: 1, companyId: 1 });
contactSchema.index({ name: 1, companyId: 1 });

module.exports = mongoose.model('Contact', contactSchema);