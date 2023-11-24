// @ts-nocheck

const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { check } = require("express-validator");

const dotenv = require("dotenv");

const {
  findcampaignshandler,
  fuzzysearchhandler,
  createcampaignhandler,
  deletecampaignhandler,
  abortcampaignhandler,
  pausecampaignhandler,
  resumecampaignhandler,
} = require("../controllers/campaign.controller");
const premiumverify = require("../middleware/premiumverify");

dotenv.config();

router.get("/", auth, premiumverify, findcampaignshandler);

router.post(
  "/create",
  auth,
  premiumverify,
  [
    check("name", "Campaign name is required").exists(),

    check(
      "ischeduled",
      "Scheduled value must be either true or false"
    ).isBoolean(),
  ],

  createcampaignhandler
);

router.get("/fuzzy-search", auth, premiumverify, fuzzysearchhandler);

router.post(
  "/delete/:id",
  auth,
  premiumverify,

  deletecampaignhandler
);

router.post(
  "/edit/abort/:id",
  auth,
  premiumverify,

  abortcampaignhandler
);
router.post("/edit/pause/:id", auth, premiumverify, pausecampaignhandler);
router.post(
  "/edit/resume/:id",
  auth,
  premiumverify,

  resumecampaignhandler
);
module.exports = router;
