const mongoose = require('mongoose');

const clientCompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    domain: {
        type: String,
        trim: true
    },
    industry: {
        type: String,
        trim: true
    },
    contactEmail: {
        type: String,
        trim: true,
        lowercase: true
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
    logo: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    notes: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes for better performance
clientCompanySchema.index({ companyId: 1 });
clientCompanySchema.index({ name: 1, companyId: 1 });
clientCompanySchema.index({ status: 1 });

module.exports = mongoose.model('ClientCompany', clientCompanySchema);
