const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const SMSRoute = require("../models/SMSRoute");
const {
  findrouteshandler,
  editsmsroutehandler,
  fuzzysearchsmsroutehandler,
  deleteroutehandler,
  findsingleroute,
  createsmsroutehandler,
  editurlhandler,
  editheaderhandler,
  deleteheader,
  addpostbodyhandler,
  editpostbody,
  deletepostbodyhandler,
  setauthhandler,
  setroutespeedhandler,
  deleteauthhandler,
  testsmsroutehandler,
  editsmppconfighandler,
  checkhasphonegrouphandler,
  testsmsroutehandlersmpp,
} = require("../controllers/smsroute.controller");
const premiumverify = require("../middleware/premiumverify");

router.get("/", auth, premiumverify, findrouteshandler);

router.get("/fuzzy-search", auth, premiumverify, fuzzysearchsmsroutehandler);

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
  editsmsroutehandler
);

router.post(
  "/delete/:id",
  auth,
  premiumverify,

  deleteroutehandler
);

router.post(
  "/create-api",
  auth,
  premiumverify,

  [
    check(
      "name",
      "Name is required and must be more than 2 characters"
    ).isLength({ min: 3, max: 20 }),
    check("routetype", "Route type must be API or SMPP").isIn(["API"]),
  ],
  createsmsroutehandler
);
router.post(
  "/create-smpp",
  auth,
  premiumverify,

  [
    check(
      "name",
      "Name is required and must be more than 2 characters"
    ).isLength({ min: 3, max: 20 }),
    check(
      "username",
      "SMPP username is required and must be more than 2 characters"
    ).isLength({ min: 3, max: 20 }),
    check(
      "password",
      "SMPP password is required and must be more than 2 characters"
    ).isLength({ min: 3, max: 20 }),
    check(
      "endpoint",
      "SMPP Endpoint is required and must be more than 2 characters"
    ).isLength({ min: 3, max: 20 }),
    check(
      "port",
      "PORT Endpoint is required and most be between 1000 and 100,000"
    ).isInt({
      min: 1000,
      max: 100000,
    }),
    check("routetype", "Route type must be API or SMPP").isIn(["SMPP"]),
    check("bindtype", "bind type must be transceiver or transmitter").isIn([
      "transceiver",
      "transmitter",
    ]),
  ],
  createsmsroutehandler
);

router.get("/single/:id", auth, premiumverify, findsingleroute);

router.post(
  "/edit-sms-route/url/:id",
  auth,
  premiumverify,

  [
    check("sendsmsurl", "sms url must be a valid URL").isURL({
      require_tld: false,
    }),
    check("sendsmsmethod", "SMS METHOD MUST BE EITHER GET OR POST").isIn([
      "GET",
      "POST",
    ]),
  ],
  editurlhandler
);
router.post(
  "/edit-sms-route/header/:id",
  auth,
  premiumverify,

  [
    check("key", "header key is important").exists({}),
    check("value", "header value is important").exists({}),
  ],
  editheaderhandler
);

router.post(
  "/edit-sms-route/edit-header/:id",
  auth,
  premiumverify,

  [
    check("key", "header key is important").exists({}),
    check("value", "header value is important").exists({}),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      // find smsroute

      const { key, value, id } = req.body;
      const smsroute = await SMSRoute.findOne({
        user: req.user.id,
        _id: req.params.id,
      }).lean();

      if (!smsroute) {
        return res.status(400).json({
          errors: [
            {
              error: true,
              msg: "SMS ROUTE NOT FOUND",
            },
          ],
        });
      }

      if (!smsroute.smsheaders) {
        return res.status(400).json({
          errors: [
            {
              error: true,
              msg: "No SMS Headers exist",
            },
          ],
        });
      }

      const updateres = await SMSRoute.findOneAndUpdate(
        {
          user: req.user.id,
          _id: req.params.id,
          "smsheaders._id": id,
        },
        {
          $set: {
            "smsheaders.$.key": key,
            "smsheaders.$.value": value,
          },
        },
        {
          new: true,
        }
      );

      res.send(updateres);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        errors: [
          {
            error: true,
            msg: "A server error occured please try again later",
            errorMessage: error,
          },
        ],
      });
    }
  }
);

router.post(
  "/edit-sms-route/delete-header/:id",
  auth,
  premiumverify,

  [
    check("key", "header key is important").exists({}),
    check("value", "header value is important").exists({}),
  ],
  deleteheader
);

// post body
router.post(
  "/edit-sms-route/postbody/:id",
  auth,
  premiumverify,

  [
    check("key", "postbody key is important").exists({}),
    check("value", "postbody value is important").exists({}),
  ],
  addpostbodyhandler
);

router.post(
  "/edit-sms-route/edit-postbody/:id",
  auth,
  premiumverify,

  [
    check("key", "Post body key is important").exists({}),
    check("value", "Post body value is important").exists({}),
  ],
  editpostbody
);

router.post(
  "/edit-sms-route/delete-postbody/:id",
  auth,
  premiumverify,

  [
    check("key", "Post body key is important").exists({}),
    check("value", "Post body value is important").exists({}),
  ],
  deletepostbodyhandler
);

// auth

router.post(
  "/edit-sms-route/auth/:id",
  auth,
  premiumverify,

  [
    check("key", "Auth username is required").exists({}),
    check("value", "Auth passowrd is required").exists({}),
  ],
  setauthhandler
);

router.post(
  "/edit-sms-route/setspeed/:id",
  auth,
  premiumverify,

  [
    check("speed", "Text/second must be an integer between 10 and 500").isInt({
      min: 1,
      max: 2,
    }),
  ],
  setroutespeedhandler
);
router.post(
  "/edit-sms-route/edit-smpp/:id",
  auth,
  premiumverify,

  [
    check(
      "user",
      "SMPP username is required and must be more than 2 characters"
    ).isLength({ min: 3, max: 20 }),
    check(
      "pass",
      "SMPP password is required and must be more than 2 characters"
    ).isLength({ min: 3, max: 20 }),
    check(
      "endpoint",
      "SMPP Endpoint is required and must be more than 2 characters"
    ).isLength({ min: 3, max: 20 }),
    check(
      "port",
      "PORT Endpoint is required and most be between 1000 and 100,000"
    ).isInt({
      min: 1000,
      max: 100000,
    }),
    check("bindType", "bind type must be transceiver or transmitter").isIn([
      "transceiver",
      "transmitter",
    ]),
  ],
  editsmppconfighandler
);

router.post(
  "/edit-sms-route/delete-auth/:id",
  auth,
  premiumverify,

  [
    check("key", "Auth username is important").exists({}),
    check("value", "Auth password is important").exists({}),
  ],
  deleteauthhandler
);

router.post(
  "/test-sms-route/:id",

  auth,
  premiumverify,

  [
    check("smsurl", "SMS URL MUST BE A VALID URL").isURL({}),
    check("smsmethod", "sms method must be a GET or POST REQUEST").isIn([
      "GET",
      "POST",
    ]),
  ],

  testsmsroutehandler
);

router.post(
  "/test-sms-route-smpp/:id",

  auth,
  premiumverify,

  testsmsroutehandlersmpp
);

// check if sms route has a phone group
router.get("/hasphonegroup/:routeid", auth, checkhasphonegrouphandler);

module.exports = router;
