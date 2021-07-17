// THIS IS THE USER SCHEMA FILE
//@ts-nocheck
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const SMSRoute = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
  },

  numberofsources: {
    type: Number,
  },

  user: {
    type: String,
    required: true,
  },
  friendlyID: {
    type: Number,
  },
  servername: {
    type: String,
  },

  sendsmsurl: {
    type: String,
  },
  sendsmsmethod: {
    type: String,
  },

  smsauthusername: {
    type: String,
  },
  smsauthpassword: {
    type: String,
  },
  smsheaders: [
    {
      key: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],

  variables: [
    {
      key: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  smsrequestmethod: {
    type: String,
  },

  defaultsendspeed: {
    type: Number,
    default: 100,
  },
  postbody: [
    {
      key: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
});

SMSRoute.plugin(AutoIncrement, {
  id: "smsroute",
  inc_field: "friendlyID",
});

SMSRoute.index({ user: 1 });
SMSRoute.index({ friendlyID: 1 });
SMSRoute.index({ friendlyID: 1, user: 1 });
SMSRoute.index({
  _id: 1,
  user: 1,
});

// SMSRoute.index({ uniqueIdentifier: 1, status: 1 });

module.exports = mongoose.model("SMSRoute", SMSRoute); // takes in model name and schema
