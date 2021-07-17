// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");

const DomainGroup = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  rotationnumber: {
    type: Number,
    default: 10000,
  },
  name: {
    type: String,
    // unique: true,
  },
  dataowner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dataowner",
  },

  traffic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "verticals",
  },

  user: {
    type: String,
    required: true,
  },
});

// var ItemModel = mongoose.model("Item", ItemSchema);
DomainGroup.index({ user: 1 });

DomainGroup.index({
  _id: 1,
  user: 1,
});

// DomainGroup.index({ uniqueIdentifier: 1, status: 1 });

module.exports = ProcessBlacklistUploadExport = mongoose.model(
  "DomainGroup",
  DomainGroup
); // takes in model name and schema
