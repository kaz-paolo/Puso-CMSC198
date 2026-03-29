import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// send otp
export const sendOTP = async (to, otp) => {
  const mailOptions = {
    // Name <email>
    from: `"PULSO" <${process.env.SMTP_USER}>`,
    to, // recipient email
    subject: "Your PULSO Verification Code",
    // plain text version
    text: `Welcome to PULSO! Your verification code is: ${otp}\n\nThis code will expire in 15 minutes.`,
    // HTML rich-text version (allow links/layout etc)
    html: `<h3>Welcome to PULSO!</h3><p>Your verification code is: <strong>${otp}</strong></p><p>This code will expire in 15 minutes.</p>`,
  };

  // TODO, add a dashboard for admin to keeptrack of emails sent?
  // for receipts and history, kahit save lng sa database ata
  await transporter.sendMail(mailOptions);
};

//
