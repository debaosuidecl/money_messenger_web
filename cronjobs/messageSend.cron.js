// const connectDB = require("../config/db");
const delay = require("../helperfunctions/delay");
// import connectDB from "../config/db";
// const MMU = require("../models/MoneyMessengerUser")
const mongoose = require("mongoose");
const { MoneyMessengerUserSchema } = require("../models/MoneyMessengerUser");
const User = require("../models/User");
const { UserSchema1 } = require("../models/User");
const { UserMessageSchema } = require("../models/UserMessage");
const FcmEngine = require("../classes/fcmEngine.class");

require("dotenv").config();

const u = process.env.MONGOURIUSER;
const p = process.env.MONGOURIPASS;
const u2 = process.env.MONGOURIUSER2;
const p2 = process.env.MONGOURIPASS2;
// console.log(MONGO_URI);
console.log(u, p, u2, p2);
const conMobile = mongoose.createConnection(
  `mongodb+srv://${u2}:${p2}@cluster0-rzlot.mongodb.net/test?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: "Power-SMS",

    useCreateIndex: true,
  }
); // remote sms server db
const connWeb = mongoose.createConnection(
  `mongodb+srv://${u}:${p}@devconnector-ekky8.mongodb.net/test?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    dbName: "MERN",
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
); // server for money messenger web db

const MoneyMessengerUserModel = conMobile.model(
  "userlb",
  MoneyMessengerUserSchema
);
const WebUserModel = connWeb.model("frontEndUser", UserSchema1);
const UserMessageModel = connWeb.model("usermessage", UserMessageSchema);

async function messageSend() {
  try {
    // const m = await MoneyMessengerUserModel.updateMany({}, {
    //     timeOfLastSend: 0
    // }, {
    //     new: true
    // })

    // return console.log(m)

    const messages = await UserMessageModel.find({
      status: "pending",
    }).limit(1000);

    console.log({ messages });
    // return

    for (let i = 0; i < messages.length; i++) {
      const { status, user_id, message, to, _id } = messages[i];
      const fcmEngine = new FcmEngine();
      let minutesToAddForPing = 1500000;
      let minutesToAddForLastSend = 1;
 
      let currentDate = new Date();
      let dateOfPingAllowed = new Date(
        currentDate.getTime() - minutesToAddForPing * 60000
      ).getTime();
      let dateOfLastSendAllowed = new Date(
        currentDate.getTime() - minutesToAddForLastSend * 60000
      ).getTime();
      try {
        console.log(new Date().getTime());
        const mmu = await MoneyMessengerUserModel.find({
          lastping: {
            $gte: dateOfPingAllowed,
          },
          timeOfLastSend: {
            $lt: dateOfLastSendAllowed,
          },
          verified: "yes",
        })
          .sort({ sendCount: 1 }) // Sorting in ascending order based on 'sendCount'
          .limit(1); // Retrieve only the first document (with the lowest value)

        console.log(mmu, "the item that was used to send");
        // continue
        const usermu = mmu[0];
        if (!usermu) {
          console.log("Money message user not found");
          continue;
        }
        const sent_data = await fcmEngine.send([usermu.firebaseToken], {
          phone: to,
          message: message,
          type: "SMS",
          postback: "http://164.90.152.80:9978/api/delivery-postback",
        });
        console.log(sent_data, 88);
        // if (sent_data === true) {
        console.log(usermu, ": last send user");
        console.log({ to, message });
        const [moneyMessengerUserUpdate, messageUpdate] = await Promise.all([
          MoneyMessengerUserModel.findOneAndUpdate(
            {
              _id: usermu._id,
            },
            {
              $inc: {
                sendCount: 1,
              },
              $set: {
                timeOfLastSend: new Date().getTime(),
              },
            },
            {
              new: true,
            }
          ),

          UserMessageModel.findOneAndUpdate(
            {
              _id: _id,
            },
            {
              $set: {
                status: "sent",
              },
            },
            {
              new: true,
            }
          ),
        ]);

        console.log({ moneyMessengerUserUpdate, messageUpdate });
        await delay(1000);
      } catch (error) {
        console.log(error);
      }
    }

    process.exit(1);
  } catch (error) {
    console.log(error, 142);
  }
}

(async () => {
  await delay(1000);
  messageSend();
})();
messageSend();
