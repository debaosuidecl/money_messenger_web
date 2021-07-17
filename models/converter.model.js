// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");

const ConvertersSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },

  camapaign: {
    type: String,
  },

  OS: {
    type: String,
  },

  servername: {
    type: String,
  },
  ip: {
    type: String,
  },
  device: {
    type: String,
  },
  lead: {
    type: String,
  },
});

module.exports = mongoose.model("Converters", ConvertersSchema); // takes in model name and schema
