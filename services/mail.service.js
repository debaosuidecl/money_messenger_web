const mailer = require("../mailer/nodemailer.mailer");
// const mailer = {};

async function sendMailNow(mail) {
  return new Promise(async (res, rej) => {
    mailer.sendMail(mail, (err, data) => {
      if (err) {
        rej(err);
      } else {
        res("sent");
      }

      // mailer.close();
    });
  });
}

module.exports = {
  sendMailNow,
};
