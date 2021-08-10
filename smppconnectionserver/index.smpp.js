// @ts-nocheck

const express = require("express");

const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require("cors");
const { handlestripewebhooks } = require("./controllers/webhookcontroller");
// const CampaignManager = require("./models/CampaignManager");

const PORT = process.env.smppserver;
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());

app.post(
  "/connect-smpp",
  (req, res, next) => {
    console.log("verify headers");
    next();
  },
  (req, res) => {}
);

let server = app.listen(PORT, async () => {});
