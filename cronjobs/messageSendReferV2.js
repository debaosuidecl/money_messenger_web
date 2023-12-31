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
    // const m = await MoneyMessengerUserModel.updateMany({
    //     verified: "yes"
    // }, {
    //     sendCount: 0,
    //     timeOfLastSend: 0,
    // }, {
    //     new: true
    // })

    // return console.log(m)

    // const messages = await UserMessageModel.find({
    //   status: "refer",
    // }).limit(40000);

    // if(messages.length <= 0){
    //      console.log("no messages");

    //      process.exit(1);
    // }
    // console.log({messages: messages.length});
    const fcmEngine = new FcmEngine();
    let minutesToAddForPing = 1500000000;
    let minutesToAddForLastSend = 12;

    let currentDate = new Date();
    let dateOfPingAllowed = new Date(
      currentDate.getTime() - minutesToAddForPing * 60000
    ).getTime();
    let dateOfLastSendAllowed = new Date(
      currentDate.getTime() - minutesToAddForLastSend * 60000
    ).getTime();

    const senders = await MoneyMessengerUserModel.find({
        lastping: {
          $gte: dateOfPingAllowed,
        },
        timeOfLastSend: {
          $lt: dateOfLastSendAllowed,
        },
        hasReferred: true,
     

        sendCount: {
            $lt: 6
        }
,
        
        verified: "yes",
      })
        .sort("timeOfLastSend") // Sorting in ascending order based on 'sendCount'
        .limit(50000)
        .lean()

    // 

      console.log({senders})

      if(senders.length <= 0){
         console.log("could not find senders to send")
         process.exit(1);

      }

     const updateNumberForRefer = await UserMessageModel.updateMany({
        status: "refer",
      },{
        status: "referstart",
        refer: true,
      }).limit(senders.length)

      console.log({updateNumberForRefer})
      
      // for(let i=0; i < senders.length; i++){

      // }
   
      process.exit(1)



// 
    // await 




      return;

    // return

    // await Promise.all(messages.map(message=> {
    //     const { status, user_id, message, to, _id } = messages[i];
    //   const fcmEngine = new FcmEngine();
    //   let minutesToAddForPing = 1500000;
    //   let minutesToAddForLastSend = 1;
 
    //   let currentDate = new Date();
    //   let dateOfPingAllowed = new Date(
    //     currentDate.getTime() - minutesToAddForPing * 60000
    //   ).getTime();
    //   let dateOfLastSendAllowed = new Date(
    //     currentDate.getTime() - minutesToAddForLastSend * 60000
    //   ).getTime();
    // }))
    

  } catch (error) {
    console.log(error, 142);
  }
}

(async () => {
  await delay(1000);
  messageSend();

//    const res =  await MoneyMessengerUserModel.updateMany({}, {
//         timeOfLastSend: 0
//     })

//     console.log(res)
})();
// messageSend();
