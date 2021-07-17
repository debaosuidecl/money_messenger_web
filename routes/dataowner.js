const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { check } = require("express-validator");
const {
  findDataOwnerHandler,
  fuzzySearchDataownerHandler,
  findSingleDataOwnerHandler,
  editDataownerHandler,
  deletedataownerhandler,
  createdataownerhandler,
} = require("../controllers/dataowner.controller");
const premiumverify = require("../middleware/premiumverify");

router.get("/", auth, premiumverify, findDataOwnerHandler);

router.get("/get-one", auth, premiumverify, findSingleDataOwnerHandler);

router.get(
  "/fuzzy-search",
  auth,

  premiumverify,

  fuzzySearchDataownerHandler
);

router.post(
  "/edit/:id",
  auth,
  premiumverify,

  [
    check(
      "name",
      "Name is required and must be more than 2 characters"
    ).isLength({ min: 3, max: 20 }),
  ],
  editDataownerHandler
);

router.post(
  "/delete/:id",
  auth,
  premiumverify,

  deletedataownerhandler
);

router.post(
  "/create",
  auth,
  premiumverify,

  [
    check(
      "name",
      "Name is required and must be more than 2 characters"
    ).isLength({ min: 3, max: 20 }),
  ],
  createdataownerhandler
);

module.exports = router;
