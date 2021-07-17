// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Dataowner = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    // unique: true,
  },
  user: {
    type: String,
    required: true,
  },
  friendlyID: {
    type: Number,
  },
});

Dataowner.plugin(AutoIncrement, {
  id: "dataowners",
  inc_field: "friendlyID",
});
// var ItemModel = mongoose.model("Item", ItemSchema);
Dataowner.index({ user: 1 });
Dataowner.index({ friendlyID: 1 });
Dataowner.index({ friendlyID: 1, user: 1 });
Dataowner.index({
  _id: 1,
  user: 1,
});

// Dataowner.index({ uniqueIdentifier: 1, status: 1 });

module.exports = ProcessBlacklistUploadExport = mongoose.model(
  "Dataowner",
  Dataowner
); // takes in model name and schema
