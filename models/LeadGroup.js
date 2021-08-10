// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");

const LeadGroup = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  ATT: {
    type: Number,
    default: 0,
  },
  VERIZON: {
    type: Number,
    default: 0,
  },

  blacklist: {
    type:Number, 
    default: 0
  },
  METRO: {
    type: Number,
    default: 0,
  },
  SPRINT: {
    type: Number,
    default: 0,
  },
  TMOBILE: {
    type: Number,
    default: 0,
  },
  USCellular: {
    type: Number,
    default: 0,
  },
  OTHER: {
    type: Number,
    default: 0,
  },
  landline: {
    type: Number,
    default: 0,
  },
  cloudinaryurl: {
    type: String,
  },
  cloudinaryid: {
    type: String,
  },
  error: {
    type: String,
  },
  servername: {
    type: String,
  },
  dedupedlocation: {
    type: String,
  },
  dataowner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dataowner",
  },

  vertical: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "verticals",
  },

  totalProcessed: {
    type: Number,
    default: 0,
  },
  user: {
    type: String,
    required: true,
  },
  handlingServer: {
    type: Number,
    default: 1,
  },
  originalname: {
    type: String,
  },
  name: {
    type: String,
  },
  friendlyname: {
    type: String,
  },
  status: {
    type: String,
    default: "matching headers",
  },
  headers: [],

  uploadCount: {
    type: Number,
    default: 0,
  },
  headerMaps: {
    phone: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
  },
  infileduplicates: {
    type: Number,
    default: 0,
  },
  globalduplicates: {
    type: Number,
    default: 0,
  },
});

LeadGroup.index({ user: 1 });

LeadGroup.index({
  _id: 1,
  user: 1,
});

// LeadGroup.index({ uniqueIdentifier: 1, status: 1 });

// LeadGroup.index({ user: 1, route: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model("LeadGroup", LeadGroup); // takes in model name and schema
