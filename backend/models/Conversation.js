const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Support agent
    },
  },
  subject: {
    type: String,
    default: 'Support Chat'
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'in-progress'],
    default: 'open'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

// Add indexes for better performance
conversationSchema.index({ companyId: 1 });
conversationSchema.index({ status: 1, companyId: 1 });
conversationSchema.index({ 'participants.userId': 1, companyId: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);