const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            require: true,
            max: 24,
            unique: true,
            index: true, // Allow query based on username
        },
        email: {
            type: String,
            trim: true,
            require: true,
            unique: true,
            lowercase: true,
        },
        hashed_password: {
            type: String,
            trim: true,
            require: true,
        },
        salt: String,
        role: {
            type: String,
            default: 'subscriber',
        },
        resetPasswordLink: {
            data: String,
            default: '',
        },
    },
    { timestamps: true }
);

// Virtual fields
// Methods > authenticate, encryptPassword, makeSalt
// Export user model
