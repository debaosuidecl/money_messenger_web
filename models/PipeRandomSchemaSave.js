// THIS IS THE USER SCHEMA FILE

const mongoose = require("mongoose");

const pipeRandomSchema = new mongoose.Schema({
  date: {
    type: Number,
    default: Date.now,
  },
  pipeList: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("pipeRandom", pipeRandomSchema); // takes in model name and schema
