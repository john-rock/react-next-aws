const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { registerEmailParams } = require('../helpers/email');
const shortid = require('shortid');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACESSS_KEY,
    region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });
console.log(process.env.EMAIL_TO);

exports.register = (req, res) => {
    // console.log('REGISTER CONTROLLER', req.body);
    const { username, email, password } = req.body;

    // Check if user exists in db
    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is already registered',
            });
        }
        // Generate token that contains username, email and password
        const token = jwt.sign(
            { username, email, password },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn: '10m',
            }
        );

        // Send email to new user upon registration
        const params = registerEmailParams(email, token);

        const sendEmailOnRegister = ses.sendEmail(params).promise();

        sendEmailOnRegister
            .then((data) => {
                console.log('email submitted to SES', data);
                // res.data.message
                res.json({
                    message: `Email has been sent to ${email}, Follow the instructions to complete your registration.`,
                });
            })
            .catch((error) => {
                console.log('ses email on register', error);
                // res.data.error
                res.json({
                    message: `We could not verify your email. Please try again.`,
                });
            });
    });
};

exports.registerActivate = (req, res) => {
    const { token } = req.body;
    // console.log(token);
    // 3 Arguments
    // 1st - Actual token you want to verify
    // 2nd - Secret key
    // 3rd - Outcome
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
        err,
        decoded
    ) {
        if (err) {
            // console.log(err)
            return res.status(401).json({
                error: 'Expired link. Please try again.',
            });
        }

        // Get all info from token
        const { username, email, password } = jwt.decode(token);

        // Generate unqiue ID
        const userId = shortid.generate();

        // Query db to make sure user doesn't already exist
        User.findOne({ email }).exec((err, user) => {
            if (user) {
                return res.status(401).json({
                    error: 'Email is already registered.',
                });
            }
        });

        // Register user in db
        const newUser = new User({ userId, username, email, password });
        newUser.save((err, result) => {
            if (err) {
                return res.status(401).json({
                    error: 'Error saving user in database. Please try later.',
                });
            }
            return res.json({
                message: 'Registration successful! Please login.',
            });
        });
    });
};
