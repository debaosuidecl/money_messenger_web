// @ts-nocheck

const express = require("express");
const auth = require("../middleware/auth");
let multer = require("multer");
let uuidv4 = require("uuid");
const path = require("path");
const socket1 = require("socket.io-client")(
  "http://localhost:" + process.env.uploadleads1
);
const SendingPhonesGroup = require("../models/SendingPhonesGroup");
const readOneLine = require("../helperfunctions/readOneLine");
// const { check } = require("express-validator");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const SMSRoute = require("../models/SMSRoute");

const DIR = "phone-uploads/";

const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const premiumverify = require("../middleware/premiumverify");
dotenv.config();
// configure cloudinary with ENV Variables
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

var upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (file.mimetype == "application/vnd.ms-excel") {
      console.log("Hit here2222");
      cb(null, true);
    } else {
      console.log("there is an error");

      req.mymultererror = "Only CSV Files are allowed";
      cb(null, false);
      // cb(new Error("Only CSV Files are allowed"));
    }
  },
}).single("senderphones");

router.post(
  "/upload/:routeid",
  auth,
  premiumverify,
  upload,
  async (req, res) => {
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
    try {
      const firstline = await readOneLine(
        path.join(__dirname, "..", "phone-uploads", req.file.filename)
      );
      let cloudinaryurl = "";
      let cloudinaryid = "";
      try {
        // console.log("uploading csv");
        console.time("uploading csv");

        const uploadres = await cloudinary.uploader.upload(
          path.join(__dirname, "..", "phone-uploads", req.file.filename),
          { resource_type: "raw" }
        );
        console.timeEnd("uploading csv");
        console.log(uploadres);

        cloudinaryurl = uploadres.url;
        cloudinaryid = uploadres.public_id;
      } catch (error) {
        console.log(error, 162);
        return res.status(400).json({
          errors: [
            {
              msg: "File upload failed please try again later",
            },
          ],
        });
      }

      // console.log(firstline, "firstline");
      if (!firstline) {
        return res.status(400).json({
          errors: [
            {
              msg: "Content not detected",
            },
          ],
        });
      }
      // return;

      console.log("hit here", req.file);

      const phoneGroupWithSameOriginalName = await SendingPhonesGroup.findOne({
        user: req.user.id,
        route: req.params.routeid,
      });

      let neworiginalname = req.file.originalname;
      if (phoneGroupWithSameOriginalName) {
        return res.status(400).send({
          errors: [
            {
              msg: "Phone group already exists",
            },
          ],
        });
      }
      const newphonegroup = new SendingPhonesGroup({
        user: req.user.id,
        name: "phone-uploads/" + req.file.filename,
        route: req.params.routeid,
        originalname: neworiginalname,
        cloudinaryurl,
        cloudinaryid,
        headers: firstline.split(","),
      });

      await newphonegroup.save();

      res.status(201).send(newphonegroup);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        errors: [
          {
            msg: "An error occured in upload",
          },
        ],
      });
    }
  }
);

router.get("/single/:id", auth, premiumverify, async (req, res) => {
  // res.send("auth Route");
  try {
    // const { page = 1, limit = 30 } = req.query;

    if (req.params.id.length < 24 || req.params.id.length > 24) {
      return res.send({
        // success: false
      });
    }
    const phonegroup = await SendingPhonesGroup.findOne({
      user: req.user.id,
      _id: req.params.id,
    }).lean();

    if (!phonegroup) {
      return res.send({
        // success: false
      });
    }

    // res.send();

    res.send(phonegroup);
  } catch (error) {
    console.log(error);
    res.status(500).json([{ msg: "Server Error" }]);
  }
});
router.post(
  "/scheduleupload/:id",
  auth,
  premiumverify,

  [check("selectedheader", "Header is required").exists({})],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      // const { page = 1, limit = 30 } = req.query;

      if (req.params.id.length < 24 || req.params.id.length > 24) {
        return res.send({
          // success: false
        });
      }
      const phonegroup = await SendingPhonesGroup.findOne({
        user: req.user.id,
        _id: req.params.id,
      });

      if (!phonegroup) {
        return res.status(400).send({
          // success: false

          errors: [
            {
              msg: "Phone group not found",
            },
          ],
        });
      }

      if (phonegroup.headers.indexOf(req.body.selectedheader) === -1) {
        return res.status(400).send({
          // success: false

          errors: [
            {
              msg: "header not found in list",
            },
          ],
        });
      }
      phonegroup.status = "processing";

      phonegroup.phoneHeaderName = req.body.selectedheader;
      await phonegroup.save();

      socket1.emit("uploadsource", phonegroup);

      // res.send();

      res.send(phonegroup);

      // res.send(phonegroup);
    } catch (error) {
      console.log(error);
      res.status(500).json({ errors: [{ msg: "Server Error" }] });
    }
  }
);
router.get(
  "/phone-group-uploads/:routeid",
  auth,
  premiumverify,
  async (req, res) => {
    try {
      const phonesgroup = await SendingPhonesGroup.findOne({
        user: req.user.id,
        route: req.params.routeid,
        $or: [
          { status: "scheduled" },
          { status: "processing" },
          { status: "done" },
          { status: "deleting" },
        ],
      });

      const route = await SMSRoute.findOne({
        user: req.user.id,
        _id: req.params.routeid,
      }).lean();

      console.log(phonesgroup);
      res.json({ phonesgroup, route });
    } catch (error) {
      res.status(400).send({
        errors: [{ msg: "Server Error" }],
      });
    }
  }
);

router.post(
  "/scheduledeleting/:routeid",
  auth,
  premiumverify,
  async (req, res) => {
    try {
      console.log(req.params);
      const phonesgroup = await SendingPhonesGroup.findOne({
        user: req.user.id,
        route: req.params.routeid,
        // status: "done",
      });

      if (!phonesgroup) {
        return res.status(400).send({
          errors: [{ msg: "Phone Group not found" }],
        });
      }

      const update = await SendingPhonesGroup.findOneAndUpdate(
        {
          user: req.user.id,
          route: req.params.routeid,
          // status: "done",
        },
        {
          $set: {
            status: "deleting",
          },
        },
        {
          new: true,
        }
      );

      res.json(update);

      socket1.emit("deletesource", update);
    } catch (error) {
      res.status(400).send({
        errors: [{ msg: "Server Error" }],
      });
    }
  }
);

module.exports = router;
