const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Company Info
    companyName: {
        type: String,
        required: true
    },
    companyPhoneNo: {
        type: String,
        required: true
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    // Address Info
    billingAddress: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    // GST Info
    isGstRegistered: {
        type: Boolean,
        required: true,
        default: false
    },
    gstin: {
        type: String,
        required: function() {
            return this.isGstRegistered;
        }
    },
    panNumber: {
        type: String,
        required: true
    },
    enableEInvoice: {
        type: Boolean,
        default: false
    },
    // Login Info
    password: {
        type: String,
        required: true
    },
    // Business Info
    businessType: {
        type: String,
        required: true
    },
    industryType: {
        type: String,
        required: true
    },
    businessRegistrationType: {
        type: String,
        required: true
    },
    // Terms and Signature
    termsAccepted: {
        type: Boolean,
        required: true,
        default: false
    },
    signature: {
        type: String
    },
    logo: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Remove any existing email index to avoid conflicts
userSchema.index({ email: 1 }, { unique: false, sparse: true });

module.exports = mongoose.model('User', userSchema);