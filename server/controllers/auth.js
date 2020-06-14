const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { registerEmailParams } = require('../helpers/email');

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
                    message: `Email has been sent to ${email}, Follow the instructions to complete your registration.`
                })
            })
            .catch((error) => {
                console.log('ses email on register', error);
                // res.data.error
                res.json({
                    message: `We could not verify your email. Please try again.`
                })
            });
    });
};
