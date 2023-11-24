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
const UserMessageModel = conMobile.model("usermessage", UserMessageSchema);

async function messageSendRefer() {
  try {
    // const m = await MoneyMessengerUserModel.updateMany({}, {
    //     timeOfLastSend: 0
    // }, {
    //     new: true
    // })

    // return console.log(m)

    const messages = await UserMessageModel.find({
      status: "refer",
    }).limit(1000);

    console.log({ messages });
    // return

    for (let i = 0; i < messages.length; i++) {
      const { status, user_id, message, to, _id, from } = messages[i];
      const fcmEngine = new FcmEngine();
        
      console.log(i)

     try{
        console.log("continue here")
        // continue 
         const sent_data = await fcmEngine.send([from], {
          phone: to,
          message: message,
          type: "SMS",
          postback: "refer",
        });
        console.log(sent_data, 88);
        // if (sent_data === true) {
        // console.log(usermu, ": last send user");
        console.log({ to, message, from });
        const [moneyMessengerUserUpdate, messageUpdate] = await Promise.all([
          MoneyMessengerUserModel.findOneAndUpdate(
            {
                firebaseToken: from,
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
                status: "refer",
              },
            },
            {
              new: true,
            }
          ),
        ]);

        console.log({ moneyMessengerUserUpdate, messageUpdate });
        await delay(6000);
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
  messageSendRefer();
})();
// messageSendRefer();
