const {
  findoneuser,
  createonetimelink,
  sendonetimelinktoemail,
  sendnewpasswordtoemail,
  updateuserpassword,
  updateuser,
} = require("../services/user.service");
// const { check } = require("express-validator");
let uuidv4 = require("uuid");

const jwt = require("jsonwebtoken");
const DIR = "adminlogo/";

const dotenv = require("dotenv");

dotenv.config();

const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { errorreturn } = require("../utils/returnerrorschema");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    console.log(file);
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4.v4() + "-" + fileName);
  },
});

var maxSize = 1 * 20 * 1000 * 1000;

let upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (
      file.mimetype.toLowerCase() == "image/png" ||
      file.mimetype.toLowerCase() == "image/jpg" ||
      file.mimetype.toLowerCase() == "image/jpeg"
    ) {
      // console.log("Hit here2222");
      cb(null, true);
    } else {
      console.log("there is an error");
      // @ts-ignore
      req.mymultererror = "Only Image Files are allowed";
      cb(null, false);
      // cb(new Error("Only CSV Files are allowed"));
    }
  },
}).single("logo");
let uploadfavico = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (
      file.mimetype.toLowerCase() == "image/png" ||
      file.mimetype.toLowerCase() == "image/jpg" ||
      file.mimetype.toLowerCase() == "image/jpeg" ||
      file.mimetype.toLowerCase() == "image/vnd.microsoft.icon"
    ) {
      // console.log("Hit here2222");
      cb(null, true);
    } else {
      console.log("there is an error");
      // @ts-ignore
      req.mymultererror = "Only Images Files are allowed";
      cb(null, false);
      // cb(new Error("Only CSV Files are allowed"));
    }
  },
}).single("favicon");

const JWT_SECRET = process.env.JWTSCERET;

async function forgotPasswordHandler(req, res) {
  const { email } = req.body;

  // make sure user exists in the database

  try {
    const user = await findoneuser({ email });

    if (!user) {
      return res.status(401).send({
        errors: [
          {
            msg: "User Not Found",
          },
        ],
      });
    }

    // create one time link valid for 15 minutes
    const link = await createonetimelink(user);
    if (!link) {
      return res.status(400).send({
        errors: [
          {
            msg: "Could not generate link",
          },
        ],
      });
    }

    // send email
    const emailresponse = await sendonetimelinktoemail(user, link);

    if (!emailresponse) {
      return res.status(400).send({
        errors: [
          {
            msg: "Could not send email at this time please try again later",
          },
        ],
      });
    }
    return res.send({
      msg: "email sent",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      errors: [
        {
          msg: "Error creating link",
        },
      ],
    });
  }
}

async function tokenverifyhandler(req, res) {
  const { userid, token } = req.params;

  const user = await findoneuser({ _id: userid });

  if (user._id != userid) {
    console.log("invalid req", user._id, userid);
    return res.status(400).send({
      errors: [
        {
          msg: "Invalid request",
        },
      ],
    });
  }

  const secret = JWT_SECRET + user.password;

  try {
    const payload = jwt.verify(token, secret);
    return res.send({
      msg: "okay",
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      errors: [
        {
          msg: "Invalid request",
        },
      ],
    });
  }
}

async function verifyPasswordsMatch(req, res, next) {
  const { confirmPassword, password } = req.body;
  console.log(req.body, 1222);

  if (password !== confirmPassword) {
    return res.status(401).send({
      errors: [
        {
          msg: "Passwords do not match",
        },
      ],
    });
  }
  next();
}

async function resetpasswordhandler(req, res) {
  try {
    const { userid, token } = req.params;
    const { password } = req.body;
    const user = await findoneuser({ _id: userid });

    if (user._id != userid) {
      console.log("invalid req", user._id, userid);
      return res.status(400).send({
        errors: [
          {
            msg: "Invalid request",
          },
        ],
      });
    }
    const secret = JWT_SECRET + user.password;

    // verify the token is active
    try {
      const payload = jwt.verify(token, secret);

      //@ts-ignore
      if (user._id != payload.id) {
        //@ts-ignore
        console.log("invalid req", user._id, payload.id);
        return res.status(400).send({
          errors: [
            {
              msg: "Invalid request",
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        errors: [
          {
            msg: "link expired",
          },
        ],
      });
    }

    // checks complete time to change password

    const updateval = await updateuserpassword(user, password);

    if (!updateval) {
      return res.status(500).send({
        errors: [
          {
            msg: "Could not update password",
          },
        ],
      });
    }

    sendnewpasswordtoemail(user, password);

    res.json({
      msg: "password updated",
    });
  } catch (error) {
    return res.status(500).send({
      errors: [
        {
          msg: "Server error",
        },
      ],
    });
  }
}

async function updateuserlogohandler(req, res) {
  console.log(req.body);
  if (req.mymultererror) {
    return res.status(500).json({
      errors: [{ msg: req.mymultererror }],
    });
  }
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log("a multer error occured");
      return res.status(500).json({
        errors: [{ msg: err }],
      });
    } else if (err) {
      // return res.status(500).json(err);

      return res.status(500).json({
        errors: [{ msg: err }],
      });
    }
  });

  let cloudinaryurl = "";
  let cloudinaryid = "";

  try {
    const uploadres = await cloudinary.uploader.upload(
      require("path").join(__dirname, "..", "adminlogo", req.file.filename),
      { resource_type: "raw" }
    );

    cloudinaryurl = uploadres.url;
    cloudinaryid = uploadres.public_id;

    const updateduser = await updateuser(
      {
        _id: req.user.id,
      },
      {
        adminlogo: cloudinaryurl,
      },
      "set"
    );

    if (!updateduser) {
      return errorreturn(res, 401, "Could not find user");
    }

    res.json(updateduser);

    require("fs").unlinkSync(
      require("path").join(__dirname, "..", "adminlogo", req.file.filename)
    );
    console.log("unlinked ");
  } catch (error) {
    return errorreturn(res, 401, "could not upload to cloud");
  }
}

async function updateuserfaviconhandler(req, res) {
  console.log(req.body);
  if (req.mymultererror) {
    return res.status(500).json({
      errors: [{ msg: req.mymultererror }],
    });
  }
  uploadfavico(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log("a multer error occured");
      return res.status(500).json({
        errors: [{ msg: err }],
      });
    } else if (err) {
      // return res.status(500).json(err);

      return res.status(500).json({
        errors: [{ msg: err }],
      });
    }
  });

  let cloudinaryurl = "";
  let cloudinaryid = "";

  try {
    const uploadres = await cloudinary.uploader.upload(
      require("path").join(__dirname, "..", "adminlogo", req.file.filename),
      { resource_type: "raw" }
    );

    cloudinaryurl = uploadres.url;
    cloudinaryid = uploadres.public_id;

    const updateduser = await updateuser(
      {
        _id: req.user.id,
      },
      {
        adminfavicon: cloudinaryurl,
      },
      "set"
    );

    if (!updateduser) {
      return errorreturn(res, 401, "Could not find user");
    }

    res.json(updateduser);

    require("fs").unlinkSync(
      require("path").join(__dirname, "..", "adminlogo", req.file.filename)
    );
    console.log("unlinked ");
  } catch (error) {
    return errorreturn(res, 401, "could not upload to cloud");
  }
}
module.exports = {
  forgotPasswordHandler,
  tokenverifyhandler,
  resetpasswordhandler,
  verifyPasswordsMatch,
  updateuserlogohandler,
  upload,
  uploadfavico,
  updateuserfaviconhandler,
};
