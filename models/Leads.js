// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");

const Lead = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },

  shortid: {
    type: String,
  },

  user: {
    // last 3 chars
    type: String,
    required: true,
  },
  leadgroup: {
    type: String,
  },
  phone: {
    type: String,
  },
  firstname: {
    type: String,
  },

  lastname: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  address: {
    type: String,
  },
  ip: {
    type: String,
  },
});

Lead.index({ user: 1 });

Lead.index({
  _id: 1,
  user: 1,
});

// Lead.index({ uniqueIdentifier: 1, status: 1 });

Lead.index({ leadgroup: 1 });

Lead.index({ user: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model("Lead", Lead); // takes in model name and schema
