// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");

const SendingPhone = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  phone: {
    type: String,
  },

  user: {
    type: String,
    required: true,
  },
  route: {
    type: String,
  },
  sendingphonegroup: {
    type: String,
  },
});

// var ItemModel = mongoose.model("Item", ItemSchema);
SendingPhone.index({ user: 1 });

SendingPhone.index({
  _id: 1,
  user: 1,
});
SendingPhone.index({
  sendingphonegroup: 1,
});
SendingPhone.index({
  route: 1,
});
SendingPhone.index({
  // _id: 1,
  user: 1,
  route: 1,
  status: 1,
});

// SendingPhone.index({ uniqueIdentifier: 1, status: 1 });

SendingPhone.index({ user: 1, route: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model("SendingPhone", SendingPhone); // takes in model name and schema
