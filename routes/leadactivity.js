const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  clickerhandler,
  conversionhandler,
  conversionamounthandler,
  conversioncounthandler,
  clickcounthandler,
  clickcounthandleradmin,
  usercountadmin,
  countcampaignshandler,
  countmessagesfromcampaigns,
} = require("../controllers/leadactivity.controller");
const premiumverify = require("../middleware/premiumverify");
const adminverify = require("../middleware/adminverify");

router.get("/clickers/:id", clickerhandler);
router.get("/converters/:userid", conversionhandler);
router.get("/conversion-amount", auth, premiumverify, conversionamounthandler);
router.get("/conversion-count", auth, premiumverify, conversioncounthandler);
router.get("/click-count", auth, premiumverify, clickcounthandler);

// admin lead activity routes
router.get("/click-count-admin", auth, adminverify, clickcounthandleradmin);
router.get("/user-count-admin", auth, adminverify, usercountadmin);
router.get("/campaign-count-admin", auth, adminverify, countcampaignshandler);
router.get(
  "/message-count-admin",
  auth,
  adminverify,
  countmessagesfromcampaigns
);

module.exports = router;
