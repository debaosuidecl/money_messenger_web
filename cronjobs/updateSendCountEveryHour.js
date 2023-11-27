const cron = require("node-cron");
const { MoneyMessengerUserSchema } = require("../models/MoneyMessengerUser");
const mongoose = require("mongoose");
require("dotenv").config();

const u = process.env.MONGOURIUSER;
const p = process.env.MONGOURIPASS;
const u2 = process.env.MONGOURIUSER2;

const p2 = process.env.MONGOURIPASS2;
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
const MoneyMessengerUserModel = conMobile.model(
    "userlb",
    MoneyMessengerUserSchema
  );
  console.log("scheduling")
cron.schedule("5 0 8-21 * *", async ()=>{
    try {
    const m = await MoneyMessengerUserModel.updateMany({
        verified: "yes"
    }, {
        sendCount: 0,
        // timeOfLastSend: 0,
    }, {
        new: true
    })

    console.log({updateResPerHour: m})

    } catch (error) {
        console.log(error, "an error occured in the execution of this code")
    }
})