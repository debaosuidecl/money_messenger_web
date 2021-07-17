// THIS IS THE USER SCHEMA FILE

const mongoose = require("mongoose");

const Verticals = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  postback: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "frontEndUser",
  },
});

Verticals.index({
  _id: 1,
  user: 1,
});
Verticals.index({
  user: 1,
});

module.exports = mongoose.model("verticals", Verticals); // takes in model name and schema
