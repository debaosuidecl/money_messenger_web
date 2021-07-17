// @ts-nocheck

const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const { check } = require("express-validator");

const {
  findmessageschemashandler,
  fuzzysearchmessageschemahandler,
  findsinglemessageschemahandler,
  createpipelinemaphandler,
  getpipelineshandler,
  updatepipelinemaphandler,
  deletepipelinehandler,
  saveschemahandler,
  editschemahandler,
  getonehandlermessage,
  deletemessageschemahandler,
  createmessageschemahandler,
} = require("../controllers/message.controller");
const premiumverify = require("../middleware/premiumverify");

router.get("/", auth, premiumverify, findmessageschemashandler);

router.get(
  "/fuzzy-search",
  auth,
  premiumverify,
  fuzzysearchmessageschemahandler
);

router.get("/single/:id", auth, premiumverify, findsinglemessageschemahandler);

router.post(
  "/createpipelinemap",
  auth,
  premiumverify,

  [
    check("pipeName", "PipeName is required").exists(),
    check("pipeList", "There is no pipelist. Pipelist is required").isArray({}),
  ],
  createpipelinemaphandler
);

router.get("/getpipelines", auth, premiumverify, getpipelineshandler);

router.post(
  "/updatepipelinemap/:id",
  auth,
  premiumverify,

  [
    check("pipeName", "PipeName is required").exists(),
    check("pipeList", "There is no pipelist. Pipelist is required").isArray({}),
  ],
  updatepipelinemaphandler
);

router.post(
  "/deletepipelinemap/:id",
  auth,
  premiumverify,
  deletepipelinehandler
);

router.post(
  "/save-schema/:id",
  auth,
  premiumverify,

  [check("formatSchema", "Format schema is required").exists()],

  saveschemahandler
);

router.get("/get-one", auth, premiumverify, getonehandlermessage);

router.post(
  "/edit/:id",
  auth,
  premiumverify,

  [
    check(
      "name",
      "Name is required and must be more than 2 characters"
    ).isLength({ min: 3, max: 80 }),
  ],
  editschemahandler
);

router.post(
  "/delete/:id",
  auth,
  premiumverify,

  deletemessageschemahandler
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
  ],
  createmessageschemahandler
);

module.exports = router;
