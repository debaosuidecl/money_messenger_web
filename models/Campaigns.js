// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },

  carrierstoexclude: [],
  failedsends: {
    type: Number,
    default: 0,
  },

  successfulsends: {
    type: Number,
    default: 0,
  },
  error: {
    type: String,
  },
  dateofschedule: {
    type: Date,
  },
  handlingserver: {
    type: Number,
    default: 1,
  },

  ischeduled: {
    type: Boolean,
  },
  dataowner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dataowner",
  },

  vertical: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "verticals",
  },
  leadgroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeadGroup",
  },
  domaingroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DomainGroup",
  },
  smsroute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SMSRoute",
  },

  messageschema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MessageSchema",
  },
  totalsent: {
    type: Number,
    default: 0,
  },

  domainList: [],

  startpossendingphone: {
    type: Number,
    default: 0,
  },
  endpossendingphone: {
    type: Number,
    default: 0,
  },
  startposleadphone: {
    type: Number,
    default: 0,
  },
  endposleadphone: {
    type: Number,
    default: 0,
  },
  payout: {
    type: Number,
    default: 0,
  },
  clickcount: {
    type: Number,
    default: 0,
  },
  conversioncount: {
    type: Number,
    default: 0,
  },
  user: {
    type: String,
    required: true,
  },

  name: {
    type: String,
  },

  status: {
    type: String,
    default: "scheduled",
  },

  servername: {
    type: String,
  },

  numericdate: {
    type: Number,
    default: Date.now,
  },
});

CampaignSchema.index({ user: 1 });
CampaignSchema.index({ servername: 1 });
CampaignSchema.index({ servername: 1, user: 1 });

CampaignSchema.index({
  _id: 1,
  user: 1,
});

// LeadGroup.index({ uniqueIdentifier: 1, status: 1 });

// LeadGroup.index({ user: 1, route: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model("Campaigns", CampaignSchema); // takes in model name and schema
