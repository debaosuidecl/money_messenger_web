const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { check } = require("express-validator");

const {
  forgotPasswordHandler,
  tokenverifyhandler,
  verifyPasswordsMatch,
  resetpasswordhandler,
  updateuserlogohandler,
  upload,
  uploadfavico,
  updateuserfaviconhandler,
  createApiKeyHandler,
  getApiKeyHandler,
  increaseSendCountOfUser,
  countUserSends,
} = require("../controllers/user.controller");
const adminverify = require("../middleware/adminverify");

router.post(
  "/apikey",
  auth,
  [check("apikey", "apikey is required").not().isEmpty()],

  createApiKeyHandler
);
router.get("/apikey/:apikey", getApiKeyHandler);
router.post("/sendcount/create/:user_id", increaseSendCountOfUser);
router.post(
  "/one-time-link",
  [check("email", "email is required").isEmail()],
  forgotPasswordHandler
);

router.get("/reset-password/:userid/:token", tokenverifyhandler);
router.post(
  "/reset-password/:userid/:token",
  verifyPasswordsMatch,

  resetpasswordhandler
);

router.get("/send-count", auth, countUserSends);
router.post("/logo/upload", auth, adminverify, upload, updateuserlogohandler);
router.post(
  "/favicon/upload",
  auth,
  adminverify,
  uploadfavico,
  updateuserfaviconhandler
);
module.exports = router;
