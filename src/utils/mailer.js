
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"EduCore" <${process.env.EMAIL_USER}>`,
    to:req.body.firstName,
    subject,
    html
  });
};

module.exports = sendMail;
