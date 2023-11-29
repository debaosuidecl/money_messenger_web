const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { check } = require("express-validator");

const {
  checkIpDowloadAndBotCheck
} = require("../controllers/mmdl.controller");
// const adminverify = require("../middleware/adminverify");

router.get(
  "/",
  checkIpDowloadAndBotCheck
);

module.exports = router;
