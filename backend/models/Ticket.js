const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Question', 'Incident', 'Problem', 'Feature Request'],
    default: 'Question'
  },
  source: {
    type: String,
    enum: ['Email', 'Portal', 'Phone', 'Chat', 'Feedback Widget'],
    default: 'Portal'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  escalationLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 3
  },
  dueDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  lastRespondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastRespondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Add indexes for better performance with companyId queries
ticketSchema.index({ companyId: 1 });
ticketSchema.index({ status: 1, companyId: 1 });
ticketSchema.index({ priority: 1, companyId: 1 });
ticketSchema.index({ assignedTo: 1, companyId: 1 });
ticketSchema.index({ createdBy: 1, companyId: 1 });

// Pre-validate middleware to generate sequential ticket ID
ticketSchema.pre('validate', async function (next) {
  if (this.isNew && !this.ticketId) {
    try {
      // Try to increment the counter
      const result = await this.constructor.db.collection('counters').findOneAndUpdate(
        { _id: 'ticketId' },
        { $inc: { seq: 1 } },
        { upsert: true, returnDocument: 'after' }
      );

      // If the operation succeeded, use the new sequence number
      if (result && result.value) {
        this.ticketId = `TK-${result.value.seq.toString().padStart(4, '0')}`;
      } else {
        // Fallback: try to find the counter document
        const counter = await this.constructor.db.collection('counters').findOne({ _id: 'ticketId' });
        if (counter) {
          this.ticketId = `TK-${counter.seq.toString().padStart(4, '0')}`;
        } else {
          // Ultimate fallback - though this shouldn't happen if the upsert worked
          this.ticketId = `TK-0001`;
        }
      }
    } catch (error) {
      console.error('Error generating ticket ID:', error);
      // Fallback to a default ID
      this.ticketId = `TK-0001`;
    }
  }
  next();
});

// Add a post-save validation to ensure ticketId exists
ticketSchema.post('save', function (doc) {
  if (!doc.ticketId) {
    console.error('ERROR: Ticket saved without ticketId. This should not happen!');
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);