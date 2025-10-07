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
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate sequential ticket ID
ticketSchema.pre('save', async function(next) {
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

module.exports = mongoose.model('Ticket', ticketSchema);