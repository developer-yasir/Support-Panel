const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
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
    },
    status: {
        type: String,
        enum: ['active', 'archived', 'on_hold'],
        default: 'active'
    },
    agents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for faster queries
projectSchema.index({ companyId: 1 });
projectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', projectSchema);
