const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  retrievecustomerhandler,
  paymentintenthandler,
  updatesubscriptionhandler,
  retrivecarddetailshandler,
  updatebillinghandler,
  subscriptiondeletehandler,
  stripewebhookhandler,
} = require("../controllers/subscription.controller");
const premiumverify = require("../middleware/premiumverify");
const { check } = require("express-validator");

router.post("/customer/retrieve", auth, retrievecustomerhandler);
router.post("/subscription/payment-intent", auth, paymentintenthandler);
router.post("/subscription/update", auth, updatesubscriptionhandler);

/* retrieve card details */
router.get(
  "/customer/paymentmethod",
  auth,
  premiumverify,
  retrivecarddetailshandler
);

/* update billing details*/
router.post(
  "/customer/updatepaymentmethod",
  auth,
  premiumverify,

  [
    check(
      "name",
      "Name is required and must be more than 2 characters"
    ).isLength({ min: 2, max: 20 }),
    check(
      "payment_method",
      "Name is required and must be more than 2 characters"
    ).exists({}),
  ],
  updatebillinghandler
);

/* Delete Subscription */
router.post(
  "/subscription/delete",
  auth,
  premiumverify,

  subscriptiondeletehandler
);

router.post("/webhook-stripe", stripewebhookhandler);
module.exports = router;
