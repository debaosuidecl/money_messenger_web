// THIS IS THE USER SCHEMA FILE

const mongoose = require("mongoose");

const FrontEndUserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  smppPass: {
    type: String,
  },
  ipList: [{
    type: String,
  }],
  
  email: {
    type: String,
    required: true,
    unique: true,
  },
  apikey: {
    type: String,
  },
  requestLimit: {
    type: Number,
    default: 10,
  },
  balance:{
    type: Number,
    default: 0,
  },
  mmsender: {
    type: Boolean,
    default: false,
  },
  companyname: {
    type: String,
  },
  servername: {
    type: String,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  subscriptionid: {
    type: String,
  },

  sub_valid_till: {
    type: Number,
    default: Date.now,
  },

  customerid: {
    type: String,
  },

  adminlogo: {
    type: String,
    default: "",
  },
  adminfavicon: {
    type: String,
    default: "",
  },

  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  allowRequests: {
    type: Boolean,
  },
  pauseScrub: {
    type: Boolean,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

FrontEndUserSchema.index({ servername: 1, admin: 1 });
FrontEndUserSchema.index({ servername: 1, admin: 1, premium: 1 });
const myModule = (module.exports = mongoose.model(
  "frontEndUser",
  FrontEndUserSchema
)); // takes in model name and schema

myModule.UserSchema1 = FrontEndUserSchema;
