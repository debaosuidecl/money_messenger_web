// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    // unique: true,
  },
  messagestructure: {
    type: String,
  },
  user: {
    type: String,
    required: true,
  },
  servername: {
    type: String,
  },
});

// var ItemModel = mongoose.model("Item", ItemSchema);
MessageSchema.index({ user: 1 });

MessageSchema.index({
  _id: 1,
  user: 1,
});

// MessageSchema.index({ uniqueIdentifier: 1, status: 1 });

module.exports = ProcessBlacklistUploadExport = mongoose.model(
  "MessageSchema",
  MessageSchema
); // takes in model name and schema
