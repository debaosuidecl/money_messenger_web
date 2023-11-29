const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { check } = require("express-validator");

const {
  checkIpDowloadAndBotCheck,
  downloadfile
} = require("../controllers/mmdl.controller");
// const adminverify = require("../middleware/adminverify");

router.get(
  "/",
  checkIpDowloadAndBotCheck
);
router.get(
  "/dl",
  downloadfile
);

module.exports = router;
