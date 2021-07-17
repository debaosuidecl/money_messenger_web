const authMiddleWare = require("../middleware/auth");
const { check } = require("express-validator");
const express = require("express");
const {
  fuzzySearchVertical,
  verticalCreateHandler,
  getOneVerticalHandler,
  verticalEditHandler,
  deleteVerticalHandler,
  findVerticalsHandler,
  findOneVerticalHandler,
} = require("../controllers/vertical.controller");
const premiumverify = require("../middleware/premiumverify");
const router = express.Router();

router.get("/", authMiddleWare, premiumverify, findVerticalsHandler);

router.get("/get-one", authMiddleWare, premiumverify, getOneVerticalHandler);

// fuzzy search
router.get("/fuzzy-search", authMiddleWare, premiumverify, fuzzySearchVertical);

// create a vertical
router.post(
  "/create",
  authMiddleWare,
  premiumverify,

  [
    check("name", "Name is required").exists().isLength({ max: 20 }),
    check("url", "URL must be a valid URL with http:// or https://")
      .exists()
      .isURL({}),
  ],

  verticalCreateHandler
);

// edit vertical

router.post(
  "/edit/:id",
  authMiddleWare,
  premiumverify,

  [
    check("name", "Name is required").exists().isLength({ min: 6, max: 20 }),
    check("url", "URL must be a valid URL with http:// or https://")
      .exists()
      .isURL({}),
    check("postback", "Postback must be a valid URL with http:// or https://")
      .isURL({})
      .optional({ nullable: true }),
  ],

  verticalEditHandler
);

// delete vertical

router.post(
  "/delete/:id",
  authMiddleWare,
  premiumverify,
  deleteVerticalHandler
);

// get single vertical
router.get(
  "/single/:id",
  authMiddleWare,
  premiumverify,
  findOneVerticalHandler
);

module.exports = router;
