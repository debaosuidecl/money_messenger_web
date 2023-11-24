// THIS IS THE USER SCHEMA FILE

const mongoose = require("mongoose");

const BalanceMMWebSchema = new mongoose.Schema(
  {
    date: {
      type: Number,
      default: Date.now,
    },
    amount: {
      type: Number,
      default: 0,
    },
    user_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
BalanceMMWebSchema.index({ phone: 1 });

const myModule = (module.exports = mongoose.model(
  "BalanceMMWeb",
  BalanceMMWebSchema
)); // takes in model name and schema

myModule.BalanceSchema = BalanceMMWebSchema;
