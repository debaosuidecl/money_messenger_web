// @ts-nocheck

const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();
const { check } = require("express-validator");

const {
  checkconfigurationstatushandler,
  finddomainshandler,
  fuzzysearchdomainshandler,
  gettldlist,
  configureapikey,
} = require("../controllers/domain.controller");
const premiumverify = require("../middleware/premiumverify");

router.get(
  "/check-configuration-status/:id",
  auth,
  premiumverify,
  checkconfigurationstatushandler
);

router.get("/", auth, premiumverify, finddomainshandler);
router.get(
  "/fuzzy-search",
  auth,

  premiumverify,

  fuzzysearchdomainshandler
);

router.get(
  "/tld-list",

  gettldlist
);
router.post(
  "/configure-apikey/namecheap",
  auth,
  premiumverify,

  [
    check(
      "apikey",
      "Your Namecheap API KEY must be 32 characters long"
    ).isLength({ min: 32, max: 32 }),
    check("username", "Your User Name is required").isLength({
      //   min: 4,
      max: 64,
    }),
  ],
  configureapikey
);

module.exports = router;
