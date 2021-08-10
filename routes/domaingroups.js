const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { check } = require("express-validator");
const {
  finddomaingroupshandlers,
  fuzzysearchdomaingroupshandler,
  findonedomaingrouphandler,
  editdomaingrouphandler,
  deletedomaingrouphandler,
  createdomaingrouphandler,
} = require("../controllers/domaingroup.controller");
const premiumverify = require("../middleware/premiumverify");

router.get("/", auth, premiumverify, finddomaingroupshandlers);

router.get(
  "/fuzzy-search",
  auth,
  premiumverify,

  fuzzysearchdomaingroupshandler
);

router.get("/get-one", auth, premiumverify, findonedomaingrouphandler);

router.post(
  "/edit/:id",
  auth,
  premiumverify,

  [
    check(
      "name",
      "Name is required and must be more than 2 characters"
    ).isLength({ min: 3, max: 80 }),
    check(
      "rotationnumber",
      "Rotation Number must be an Integer between 1000 and 100,000"
    ).isInt({
      min: 1,
      max: 100000,
    }),
  ],
  editdomaingrouphandler
);

router.post(
  "/delete/:id",
  auth,
  premiumverify,

  deletedomaingrouphandler
);

router.post(
  "/create",
  auth,
  premiumverify,

  [
    check(
      "name",
      "Name is required and must be more than 2 characters"
    ).isLength({ min: 3, max: 80 }),
    check(
      "rotationnumber",
      "Rotation Number must be an Integer between 1,000 and 100,000"
    ).isInt({
      min: 1,
      max: 100000,
    }),
  ],
  createdomaingrouphandler
);

module.exports = router;
