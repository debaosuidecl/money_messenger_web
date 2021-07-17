const { findusers } = require("../services/admin.services");
const { sendMailNow } = require("../services/mail.service");
const {
  findoneuser,
  createuser,
  deleteuser,
  updateuser,
} = require("../services/user.service");
const {
  countcampaigns,
  aggregatecampaign,
} = require("../services/campaign.service");
const escapeRegex = require("../utils/escapeRegex");
const { securestring } = require("../utils/generate_secure_random_string");
const { errorreturn } = require("../utils/returnerrorschema");
const { saltifytext } = require("../utils/saltifytext");
let LIMIT = 30;

async function findusershandler(req, res) {
  const { page = 0, limit = 30, searchvalue } = req.query;
  console.log(req.query);

  let yourquery = {
    //   user: req.user.id,
    _id: { $ne: req.user.id },
    servername: req.servername,
  };

  if (searchvalue) {
    const regex = new RegExp(escapeRegex(req.query.searchvalue), "gi");

    yourquery = {
      servername: req.servername,
      _id: { $ne: req.user.id },

      fullName: regex,
    };
  }

  try {
    const users = await findusers(yourquery, LIMIT, page);
    // console.log(users);

    res.json(users);
  } catch (error) {
    errorreturn(res, 500, "Server Error");
  }
}
async function fuzzysearchusershandler(req, res) {
  if (req.query.value) {
    const regex = new RegExp(escapeRegex(req.query.value), "gi");
    const users = await findusers(
      {
        servername: req.servername,
        fullName: regex,
        _id: { $ne: req.user.id },
      },
      LIMIT,
      req.query.page
    );

    res.send(users);
  } else {
    const users = await findusers(
      { servername: req.servername, _id: { $ne: req.user.id } },
      LIMIT,
      req.query.page
    );

    res.send(users);
  }
}

async function createuserhandler(req, res) {
  const { fullName, email } = req.body;

  const password = securestring(10);

  try {
    // we want to see if the user exist

    // get User's gravatar

    // encrypt the password using bcrypt

    // return a jsonwebtoken so that the user can be logged in immediately

    let user = await findoneuser({ email });
    if (user) {
      return errorreturn(res, 401, "User with the same email already exists"); //bad request
    }
    // const avatar = gravatar.url(email, {
    //   s: '200', // default size
    //   r: 'pg', // rating - cant have any naked people :)
    //   d: 'mm' // gives a default image
    // });

    const saltpassword = await saltifytext(password); // create the salt

    const newuser = await createuser({
      fullName,
      email,
      username: email,
      password: saltpassword,
      premium: false,
      servername: req.servername,
    });

    if (!newuser) {
      return errorreturn(res, 401, "Could not create user");
    }

    res.json(newuser);
    // send user email

    let servername = `https://${req.servername}.powersms.land/login`;

    let html = `<p>Hi ${fullName}, You have successfully created an account with us. Your password is ${password}. Please update your password as soon as you sign in for security</p>. Login <a href="${servername}">${servername}</a>`;
    let mail = {
      from: "Power SMS Land <no-reply@powersms.land>",
      to: email, // user.email
      subject: `Welcome to ${req.servername}.powersms.land`,
      html,
    };
    await sendMailNow(mail);
    console.log("sent email");
    // user.password = await bcrypt.hash(password, salt); // to encrypt the user password
    // console.log(user);
    // await user.save();

    // const payload = {
    //   user: {
    //     id: user.id,
    //   },
    // };

    // jwt.sign(
    //   payload,
    //   config.get("jwtSecret"),
    //   { expiresIn: "10h" },
    //   (error, token) => {
    //     if (error) throw error;

    //     res.json({ token, fullName: user.fullName });
    //   }
    // );
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
  // res.json({
  //   fullName,
  //   email,
  //   generatedpassword,
  // });
}

async function deleteuserhandler(req, res) {
  const { userid } = req.params;

  const user = await deleteuser({ _id: userid, servername: req.servername });

  if (!user) {
    return errorreturn(res, 401, "User not found");
  }

  return res.json(user);
}

async function edituserhandler(req, res) {
  const { userid } = req.params;
  const { fullName } = req.body;

  const user = await updateuser(
    { _id: userid, servername: req.servername },
    {
      fullName,
    },
    "set"
  );

  if (!user) {
    return errorreturn(res, 401, "User not found");
  }

  return res.json(user);
}

async function fetchuserdetails(req, res) {
  const { userid } = req.params;

  // get user name and email by finding user date of creation

  const user = await findoneuser({ _id: userid, servername: req.servername });

  if (!user) {
    return errorreturn(res, 401, "Could not find user");
  }

  // number of campaigns in the past week

  try {
    const [_campaigncount, _messagecount] = await Promise.all([
      countcampaigns({
        user: userid,
        servername: req.servername,
      }),

      aggregatecampaign(
        {
          user: userid,
          servername: req.servername,
        },
        "totalsent"
      ),
    ]);

    res.send({ user, _campaigncount, _messagecount });
  } catch (error) {
    console.log(error);

    return errorreturn(res, 401, "Could not fetch user details at this time");
  }

  // number of messages in the past week
}

module.exports = {
  fuzzysearchusershandler,
  findusershandler,
  deleteuserhandler,
  createuserhandler,
  edituserhandler,
  fetchuserdetails,
};
