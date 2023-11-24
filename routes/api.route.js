const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
// const { check } = require("express-validator");
const {createAPIKey, fetchApiKey} = require("../controllers/api.controller");
// const premiumverify = require("../middleware/premiumverify");

router.get("/", auth, fetchApiKey);

router.get(
  "/create",
  auth,
  createAPIKey,);

module.exports = router;
