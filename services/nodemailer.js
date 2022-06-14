const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.MAIL_CLIENT_ID,
    process.env.MAIL_CLIENT_SECRET,
    process.env.MAIL_REDIRECT_URI,
);
oauth2Client.setCredentials({ refresh_token: process.env.MAIL_REFRESH_TOKEN });

const accessToken = new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
        if (err)
            reject(err);
        resolve(token);
    })
})
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'ShanectTeam@gmail.com',
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        refreshToken: process.env.MAIL_REFRESH_TOKEN,
        accessToken: accessToken,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

module.exports = { transporter };