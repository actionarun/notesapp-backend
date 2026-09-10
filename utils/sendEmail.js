const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, // SSL - more reliable than port 587 from cloud hosts like Render
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Notes App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;