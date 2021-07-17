// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");

const ScrubManager = new mongoose.Schema({
  currentIndex: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("ScrubManager", ScrubManager); // takes in model name and schema
