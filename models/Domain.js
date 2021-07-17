// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");

const Domain = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    // unique: true,
  },
  traffic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "verticals",
  },
  dataowner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dataowner",
  },
  domaingroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainGroup",
  },
  user: {
    type: String,
    required: true,
  },

  purchasemethod: {
    type: String,
  },
});

// var ItemModel = mongoose.model("Item", ItemSchema);
Domain.index({ user: 1 });

Domain.index({
  _id: 1,
  user: 1,
});

// Domain.index({ uniqueIdentifier: 1, status: 1 });

module.exports = ProcessBlacklistUploadExport = mongoose.model(
  "Domain",
  Domain
); // takes in model name and schema
