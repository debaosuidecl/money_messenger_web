// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");

const NamecheapCredentials = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  apikey: {
    type: String,
    // unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  servername: {
    type: String,
  },
  user: {
    type: String,
    required: true,
  },
});

// var ItemModel = mongoose.model("Item", ItemSchema);
NamecheapCredentials.index({ user: 1 });

NamecheapCredentials.index({
  _id: 1,
  user: 1,
});

// NamecheapCredentials.index({ uniqueIdentifier: 1, status: 1 });

module.exports = ProcessBlacklistUploadExport = mongoose.model(
  "NamecheapCredentials",
  NamecheapCredentials
); // takes in model name and schema
