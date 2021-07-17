// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");

const LeadsTotal = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  shortid: {
    type: String,
  },
  user: {
    type: String,
    required: true,
  },
  leadgroup: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "LeadGroup",
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

LeadsTotal.index({ user: 1 });
LeadsTotal.index({ leadgroup: 1 });

LeadsTotal.index({
  _id: 1,
  user: 1,
});

// LeadsTotal.index({ uniqueIdentifier: 1, status: 1 });

LeadsTotal.index({ shortid: 1 });

LeadsTotal.index({ user: 1, phone: 1, leadgroup: 1 }, { unique: true });

module.exports = mongoose.model("LeadsTotal", LeadsTotal); // takes in model name and schema
