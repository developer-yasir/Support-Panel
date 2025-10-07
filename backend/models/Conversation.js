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
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Customer is also a user in the system
    }
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
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('Conversation', conversationSchema);