const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();
const transport = {
  host: "mail.privateemail.com",
  port: 587,
  pool: true,
  // maxConnections: 20,

  secure: false,
  auth: {
    user: process.env.mail_user,
    pass: process.env.mail_pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
};
const transporter = nodemailer.createTransport(transport);

// transporter.close();
module.exports = transporter;
