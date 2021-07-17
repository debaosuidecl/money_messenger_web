const User = require("../models/User");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { sendMailNow } = require("./mail.service");
const { saltifytext } = require("../utils/saltifytext");
dotenv.config();

const JWT_SECRET = process.env.JWTSCERET;
async function findoneuser(query) {
  try {
    const user = await User.findOne(query);
    return user;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function createuser(details) {
  try {
    const user = new User(details);

    const result = await user.save();

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function deleteuser(details) {
  try {
    const user = await User.findOneAndDelete(details);

    if (!user) {
      return false;
    }
    return user;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function countuserdocuments(query) {
  try {
    const user = await User.countDocuments(query);
    return user;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function createonetimelink(user) {
  const secret = JWT_SECRET + user.password;
  if (!user) {
    return false;
  }
  const payload = {
    email: user.email,
    id: user._id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  const maindomain =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `http://${user.server}.powersms.land`;
  const link = `${maindomain}/reset-password?u=${user._id}&t=${token}`;

  return link;
}

async function sendonetimelinktoemail(user, link) {
  let html = fs.readFileSync(
    path.resolve(__dirname, "..", "templates/resendemail.html"),
    "utf-8"
  );

  html = html
    .replace("{link}", link)
    .replace("https://viewstripo.email/", link);

  let mail = {
    from: "Power SMS LAND <no-reply@powersms.land>",
    to: "debaosuidecl@gmail.com", // user.email
    subject: `RESET PASSWORD`,
    html,
  };

  try {
    const mailsent = await sendMailNow(mail);
    return mailsent;
  } catch (error) {
    console.log(error);
    return false;
  }

  //   mailer.
}

// async function saltifytext(text){

// }
async function updateuserpassword(user, newpassword) {
  const userid = user._id;

  const saltpassword = await saltifytext(newpassword);

  const update = await User.findOneAndUpdate(
    {
      _id: userid,
    },
    {
      password: saltpassword,
    },
    {
      new: true,
    }
  );

  return update;
}

async function sendnewpasswordtoemail(user, password) {
  let html = `<p> You have just changed your password to ${password}. Please store this somewhere safe and DO NOT reveal it to anyone.</p>`;
  let mail = {
    from: "Power SMS LAND <no-reply@powersms.land>",
    to: user.email, // user.email
    subject: `RESET PASSWORD`,
    html,
  };

  try {
    const mailsent = await sendMailNow(mail);
    return mailsent;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateuser(query, update, type = "set") {
  try {
    const result = await User.findOneAndUpdate(
      query,
      {
        [`$${type}`]: update,
      },
      {
        new: true,
      }
    );

    return result;
  } catch (error) {
    console.error(error);

    return false;
  }
}
module.exports = {
  findoneuser,
  createonetimelink,
  sendonetimelinktoemail,
  updateuserpassword,
  sendnewpasswordtoemail,
  updateuser,
  countuserdocuments,
  createuser,
  deleteuser,
};
