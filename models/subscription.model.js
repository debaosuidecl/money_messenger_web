// THIS IS THE USER SCHEMA FILE

const mongoose = require("mongoose");

const Customer = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    customerid: {
      type: String,
      required: true,
    },
    servername: {
      type: String,
    },
    chargeid: {
      type: String,
    },
    service: {
      type: String,
      default: "stripe",
    },
    subscribed: {
      type: Boolean,
      default: false,
    },
    subscriptionid: {
      type: "string",
    },
    planid: {
      type: "string",
    },
    productid: {
      type: "string",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "frontEndUser",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("subscription", Customer); // takes in model name and schema
