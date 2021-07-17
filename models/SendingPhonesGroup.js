// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");
const { toString } = require("./_tldList");

const SendingPhonesGroup = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    // unique: true,
  },
  originalname: {
    type: String,
  },
  cloudinaryurl: {
    type: String,
  },

  cloudinaryid: {
    type: String,
  },
  user: {
    type: String,
    required: true,
  },
  servername: {
    type: String,
  },
  status: {
    type: String,
    default: "matchingheaders",
  },

  errordescription: {
    type: String,
  },
  headers: [],
  uploadCount: {
    type: Number,
    default: 0,
  },
  selectedheader: {
    type: String,
  },
  globalduplicates: {
    type: Number,
  },
  infileduplicates: {
    type: Number,
  },
  phoneHeaderName: {
    type: String,
  },
  route: {
    type: String,
  },
});

// var ItemModel = mongoose.model("Item", ItemSchema);
SendingPhonesGroup.index({ user: 1 });

SendingPhonesGroup.index({
  _id: 1,
  user: 1,
});
SendingPhonesGroup.index({
  // _id: 1,
  user: 1,
  route: 1,
  status: 1,
});
SendingPhonesGroup.index({
  // _id: 1,
  user: 1,
  route: 1,
  // status: 1,
});
SendingPhonesGroup.index({
  status: 1,
});

// SendingPhonesGroup.index({ uniqueIdentifier: 1, status: 1 });

module.exports = mongoose.model("SendingPhonesGroup", SendingPhonesGroup); // takes in model name and schema
