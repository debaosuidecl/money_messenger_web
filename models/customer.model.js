// THIS IS THE USER SCHEMA FILE

const mongoose = require("mongoose");

const Customer = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  customerid: {
    type: String,
    required: true,
  },

  service: {
    type: String,
    default: "stripe",
  },
  payment_method: {
    type: String,
  },
  servername: {
    type: String,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "frontEndUser",
  },
});

module.exports = mongoose.model("customer", Customer); // takes in model name and schema
