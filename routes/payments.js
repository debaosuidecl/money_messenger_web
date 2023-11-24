const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  payRequestInit,
  balanceSuccess,
} = require("../controllers/payments.controller");

router.get("/paypal/payinit", auth, payRequestInit);
router.get("/paypal/success", balanceSuccess);
router.post("/paypal/success", balanceSuccess);

module.exports = router;
