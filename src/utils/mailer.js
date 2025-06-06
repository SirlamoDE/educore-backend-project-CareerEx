
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
// Adjust path to .env if mailer.js is not in src/utils directly relative to project root
dotenv.config({ path: require('path').join(__dirname, '../../../.env') }); 

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // Should be smtp.gmail.com
        port: parseInt(process.env.EMAIL_PORT), // Should be 587 or 465
        secure: parseInt(process.env.EMAIL_PORT) === 465, // true for 465 (SSL), false for 587 (TLS)
        auth: {
            user: process.env.EMAIL_USERNAME, // Your Gmail address
            pass: process.env.EMAIL_PASSWORD, // Your Gmail password or App Password
        },
       
    });

    const mailOptions = {
        from: `EduCore <${process.env.EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent via Gmail: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email via Gmail from mailer.js:', error);
        // Log the specific error from Nodemailer
        throw new Error(`Email could not be sent. Provider error: ${error.message}`);
    }
};

module.exports = sendMail;