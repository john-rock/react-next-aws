const mongoose = require('mongoose');
const crypto = require('crypto');

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
// Get password from front end
userSchema
    .virtual('password')
    .set(function (password) {
        // Create temp variable _password
        this._password = password;
        // Generate sale
        this.salt = this.makeSalt();
        // Encrypt password
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

// Methods > authenticate, encryptPassword, makeSalt
userSchema.methods = {
    authenticate: function (plaintText) {
        return this.encryptPassword(plaintText) === this.hashed_password;
    },

    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    },
};

// Export user model
module.exports = mongoose.model('User', userSchema);