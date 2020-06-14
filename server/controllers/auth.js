const User = require('../models/user');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

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

        // Email that is sent to the user registering
        const params = {
            Source: process.env.EMAIL_FROM,
            Destination: {
                ToAddresses: [email],
            },
            ReplyToAddresses: [process.env.EMAIL_TO],
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: `
                    <html>
                        <h1>Verify your email address</h1>
                        <p>Please use the following link to complete your registration:</p>
                        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    </html>
                    `,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Complete your registration',
                },
            },
        };

        const sendEmailOnRegister = ses.sendEmail(params).promise();

        sendEmailOnRegister
            .then((data) => {
                console.log('email submitted to SES', data);
                res.send('Email Sent');
            })
            .catch((error) => {
                console.log('ses email on register', error);
                res.send('email failed');
            });
    });
};
