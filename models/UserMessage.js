const mongoose = require("mongoose");

const UserMessage = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },

    user_id: {
      type: String,
      required: true,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    refer: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

UserMessage.index({ user_id: 1, createdAt: 1 });
UserMessage.index({ user_id: 1 });
UserMessage.index({ pending: 1 });
// export model user with UserMessage
const myModule = (module.exports = mongoose.model("usermessage", UserMessage));

myModule.UserMessageSchema = UserMessage;
