const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
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
    dateOfBirth: {
        type: Date,
        required: true
    },
    education: {
        degree: {
            type: String,
            required: true
        },
        institution: {
            type: String,
            required: true
        },
        graduationYear: {
            type: Number,
            required: true
        },
        fieldOfStudy: {
            type: String,
            required: true
        }
    },
    skills: [{
        type: String,
        trim: true
    }],
    experience: [{
        company: String,
        position: String,
        duration: String,
        description: String
    }],
    resume: {
        type: String
    },
    profilePicture: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
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

studentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Student', studentSchema);
