// @ts-nocheck

const express = require("express");
const auth = require("../middleware/auth");
const LeadGroup = require("../models/LeadGroup");
const router = express.Router();
const uuidv4 = require("uuid");
const { check } = require("express-validator");
const multer = require("multer");
const DIR = "lead-uploads/";

const dotenv = require("dotenv");
// const ScrubManager = require("../models/ScrubManager");
const {
  findleadshandler,
  uploadhandler,
  findsingleleadhandler,
  scheduleuploadhandler,
  fuzzysearchleads,
  deleteleadgrouphandler,
} = require("../controllers/leads.controller");
const premiumverify = require("../middleware/premiumverify");

dotenv.config();

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
    if (file.mimetype == "application/vnd.ms-excel" || file.mimetype == "text/csv") {
      console.log("Hit here2222");
      cb(null, true);
    } else {
      console.log("there is an error");

      req.mymultererror = "Only CSV Files are allowed";
      cb(null, false);
      // cb(new Error("Only CSV Files are allowed"));
    }
  },
}).single("leads");

router.get("/", auth, premiumverify, findleadshandler);

router.get("/single/:id", auth, premiumverify, findsingleleadhandler);
router.post(
  "/upload",
  auth,
  (req, res, next) => {
    if (!req.query.name) {
      return res.status(400).send([
        {
          errors: [
            {
              msg: "Name is required",
            },
          ],
        },
      ]);
    }
    next();
  },
  upload,
  uploadhandler
);

router.post(
  "/scheduleupload/:id",
  auth,
  premiumverify,

  [check("phone", "Phone is required").exists({})],
  scheduleuploadhandler
);

router.get("/fuzzy-search", auth, fuzzysearchleads);

router.post(
  "/delete/:id",
  auth,
  premiumverify,

  deleteleadgrouphandler
);

module.exports = router;
