const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACESSS_KEY,
    region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });
console.log(process.env.EMAIL_TO)

exports.register = (req, res) => {
    // console.log('REGISTER CONTROLLER', req.body);
    const { username, email, password } = req.body;
    const params = {
        //Source: process.env.EMAIL_FROM,
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email],
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<html><body><h1 style="color:red;">Hello ${username}</h1><p>Test email</p></body></html>`,
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
};
