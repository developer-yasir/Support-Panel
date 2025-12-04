const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  hours: {
    type: Number,
    required: true,
    min: 0
  },
  minutes: {
    type: Number,
    required: true,
    min: 0,
    max: 59
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['work', 'break', 'meeting', 'research'],
    default: 'work'
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
timeEntrySchema.index({ ticketId: 1, companyId: 1 });
timeEntrySchema.index({ userId: 1, companyId: 1 });
timeEntrySchema.index({ date: 1, companyId: 1 });

module.exports = mongoose.model('TimeEntry', timeEntrySchema);