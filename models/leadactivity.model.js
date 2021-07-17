// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");

const LeadActivitySchema = new mongoose.Schema(
  {
    date: {
      type: Number,
      default: Date.now,
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
    address: {
      type: String,
    },
    servername: {
      type: String,
    },
    city: {
      type: String,
    },
    zip: {
      type: String,
    },
    state: {
      type: String,
    },

    campaign: {
      type: String,
    },
    dataowner: {
      type: String,
    },
    vertical: {
      type: String,
    },
    leadgroup: {
      type: String,
    },
    payout: {
      type: Number,
      default: 0,
    },
    domaingroup: {
      type: String,
    },
    smsroute: {
      type: String,
    },
    messageschema: {
      type: String,
    },
    user: {
      type: String,
    },

    OS: {
      type: String,
    },

    ip: {
      type: String,
    },

    clicker: {
      type: Boolean,
      default: true,
    },

    converter: {
      type: Boolean,
      default: false,
    },
    browser: {
      type: String,
    },
    device: {
      type: String,
    },
    lead: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

LeadActivitySchema.index({ campaign: 1, user: 1, lead: 1 }, { unique: true });
LeadActivitySchema.index({ user: 1 });
LeadActivitySchema.index({
  _id: 1,
  user: 1,
});
LeadActivitySchema.index({
  date: 1,
  user: 1,
  converter: 1,
  payout: 1,
});
LeadActivitySchema.index({
  date: 1,
  user: 1,
});
LeadActivitySchema.index({
  date: 1,
  serverame: 1,
});

module.exports = mongoose.model("LeadActivity", LeadActivitySchema); // takes in model name and schema
