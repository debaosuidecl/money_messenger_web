// THIS IS THE USER SCHEMA FILE

const mongoose = require("mongoose");

const BlacklistPhonesSchema = new mongoose.Schema({
  date: {
    type: Number,
    default: Date.now,
  },
  phone: {
    unique: true,
    type: Number,
  },
});
BlacklistPhonesSchema.index({ phone: 1 });

module.exports = mongoose.model("BlacklistPhones", BlacklistPhonesSchema); // takes in model name and schema
