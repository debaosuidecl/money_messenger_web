const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();
const transport = {
  host: "mail.privateemail.com",
  port: 587,
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

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages", success);
  }
});
