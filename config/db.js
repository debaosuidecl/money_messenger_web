// // this is where we do the mongodb connection

// const mongoose = require("mongoose");

// const config = require("config");
// const dotenv = require("dotenv")
// dotenv.config()
// const db = process.env.MONGOURI
// // const db = config.get("mongoURI");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(db, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       dbName: "MERN",
//       useFindAndModify: false,
//       useUnifiedTopology: true,
//     });
//     console.log("Mongo DB connected");
//   } catch (e) {
//     console.log(e.message);
//     process.exit(1); // we exit the process with a failure code 1;
//   }
// };

// module.exports = connectDB;

// this is where we do the mongodb connection

const mongoose = require("mongoose");

const config = require("config");

const dotenv = require("dotenv");

dotenv.config();

const u = process.env.MONGOURIUSER;
const p = process.env.MONGOURIPASS;
// const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(
      // `mongodb+srv://${u}:${p}@cluster0-rzlot.mongodb.net/test?retryWrites=true&w=majority`,
      `mongodb+srv://${u}:${p}@devconnector-ekky8.mongodb.net/test?retryWrites=true&w=majority`,
      // 'mongodb+srv://deba:clemento@power-sms-2tibs.mongodb.net/test?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        dbName: "MERN",
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );
    console.log("Mongo DB connected");
  } catch (e) {
    console.log(e.message);
    process.exit(1); // we exit the process with a failure code 1;
  }
};

module.exports = connectDB;
