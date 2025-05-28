const crypto = require('crypto');
const sendMail = require('../../utils/mailer');
const User = require('../models/user-model');


const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return { error: 'No account with that email exists.' };

  // Generate token
  const token = crypto.randomBytes(32).toString('hex');

  user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  // Send email using mailer
  await sendMail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `<p>Hello ${user.firstName},</p>
           <p>You requested to reset your password. Click the link below to proceed:</p>
           <a href="${resetUrl}">${resetUrl}</a>
           <p>This link will expire in 1 hour.</p>`
  });

  return { message: 'Password reset link sent to your email.' };
};
