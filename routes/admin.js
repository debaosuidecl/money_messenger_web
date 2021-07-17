const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();
const { check } = require("express-validator");

const adminverify = require("../middleware/adminverify");
const {
  findusershandler,
  fuzzysearchusershandler,
  createuserhandler,
  deleteuserhandler,
  edituserhandler,
  fetchuserdetails,
} = require("../controllers/admin.controller");

router.get(
  "/user/fuzzy-search",
  auth,

  adminverify,

  fuzzysearchusershandler
);

router.get("/user", auth, adminverify, findusershandler);
router.post(
  "/user/create",
  auth,
  adminverify,

  [
    check("fullName", "Your full name is required").not().isEmpty(),

    check("email", "Use a valid Email").isEmail(),
    // check(
    //   "password",
    //   "Please Enter a password with 6 or more characters"
    // ).isLength({ min: 8 }),
  ],

  createuserhandler
);
router.post(
  "/user/delete/:userid",
  auth,
  adminverify,

  deleteuserhandler
);
router.post(
  "/user/edit/:userid",
  auth,
  adminverify,

  [check("fullName", "Your full name is required").not().isEmpty()],

  edituserhandler
);
router.get("/user/single/:userid", auth, adminverify, fetchuserdetails);

module.exports = router;
