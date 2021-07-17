// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");

const CampaignManager = new mongoose.Schema({
  currentIndex: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("CampaignManager", CampaignManager); // takes in model name and schema
