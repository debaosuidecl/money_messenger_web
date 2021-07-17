const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { check } = require("express-validator");
// const DIR = "adminlogo/";

// let uuidv4 = require("uuid");

const {
  forgotPasswordHandler,
  tokenverifyhandler,
  verifyPasswordsMatch,
  resetpasswordhandler,
  updateuserlogohandler,
  upload,
  uploadfavico,
  updateuserfaviconhandler,
} = require("../controllers/user.controller");
const adminverify = require("../middleware/adminverify");

// const cloudinary = require("cloudinary").v2;
// const multer = require("multer");

// cloudinary.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.api_key,
//   api_secret: process.env.api_secret,
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, DIR);
//   },
//   filename: (req, file, cb) => {
//     console.log(file);
//     const fileName = file.originalname.toLowerCase().split(" ").join("-");
//     cb(null, uuidv4.v4() + "-" + fileName);
//   },
// });

// var maxSize = 1 * 20 * 1000 * 1000;

// var upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: maxSize,
//   },
//   fileFilter: (req, file, cb) => {
//     console.log(file);
//     if (file.mimetype == "application/vnd.ms-excel") {
//       console.log("Hit here2222");
//       cb(null, true);
//     } else {
//       console.log("there is an error");
//       // @ts-ignore
//       req.mymultererror = "Only CSV Files are allowed";
//       cb(null, false);
//       // cb(new Error("Only CSV Files are allowed"));
//     }
//   },
// }).single("logo");

router.post(
  "/one-time-link",
  [check("email", "email is required").isEmail()],
  forgotPasswordHandler
);

router.get("/reset-password/:userid/:token", tokenverifyhandler);
router.post(
  "/reset-password/:userid/:token",
  verifyPasswordsMatch,

  resetpasswordhandler
);
router.post("/logo/upload", auth, adminverify, upload, updateuserlogohandler);
router.post(
  "/favicon/upload",
  auth,
  adminverify,
  uploadfavico,
  updateuserfaviconhandler
);
module.exports = router;
