const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    industry: {
        type: String,
        required: true,
        trim: true
    },
    companySize: {
        type: String,
        required: true,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    website: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    description: {
        type: String,
        trim: true
    },
    foundedYear: {
        type: Number
    },
    logo: {
        type: String
    },
    contactPerson: {
        name: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    socialLinks: {
        linkedin: String,
        twitter: String,
        facebook: String,
        instagram: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    subscriptionPlan: {
        type: String,
        enum: ['basic', 'premium', 'enterprise'],
        default: 'basic'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

companySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Company', companySchema);
