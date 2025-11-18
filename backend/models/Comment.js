const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better performance
commentSchema.index({ companyId: 1 });
commentSchema.index({ ticket: 1, companyId: 1 });
commentSchema.index({ createdBy: 1, companyId: 1 });

module.exports = mongoose.model('Comment', commentSchema);