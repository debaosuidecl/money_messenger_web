// THIS IS THE USER SCHEMA FILE

const mongoose = require("mongoose");

const ApiKeySchema = new mongoose.Schema(
  {
    user: {
      type: String,
    },

    apiKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ApiKeySchema.index({ apiKey: 1, });
ApiKeySchema.index({ user: 1, });
// ApiKeySchema.index({ servername: 1, admin: 1, premium: 1 });
module.exports = mongoose.model("apikey", ApiKeySchema); // takes in model name and schema
