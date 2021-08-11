// this is where we do the mongodb connection

const mongoose = require("mongoose");

const config = require("config");
const dotenv = require("dotenv")
dotenv.config()
const db = process.env.MONGOURI
// const db = config.get("mongoURI");



const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      dbName: "MERN",
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("Mongo DB connected");
  } catch (e) {
    console.log(e.message);
    process.exit(1); // we exit the process with a failure code 1;
  }
};

module.exports = connectDB;