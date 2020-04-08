import { EmailCredentials } from './keys';

const nodemailer = require('nodemailer');

export const composeMail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: EmailCredentials.EMAIL_USER,
        pass: EmailCredentials.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});