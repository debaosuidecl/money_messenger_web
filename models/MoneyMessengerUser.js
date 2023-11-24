const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    sendCount: {
      type: Number,
      default: 0,
    },
    timeOfLastSend: {
      type: Number,
      default: 0,
    },
    timeOfNextEligibility: {
      type: Number,
      default: 0,
    },
    code: {
      type: String,
    },
    firebaseToken: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    detached: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    lastping: {
      type: Number,
      default: Date.now,
    },
    verified: {
      type: String,
      default: "no",
    },
  },
  {
    timestamps: true,
  }
);

// export model user with UserSchema
// module.exports =
module.exports = {
  MoneyMessengerUserSchema: UserSchema,
  MoneyMessengerUserModel: mongoose.model("userlb", UserSchema),
};
