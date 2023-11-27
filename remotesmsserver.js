// @ts-nocheck

const express = require("express");

const mongoose = require("mongoose");
// const connectDB = require("./config/db");
// let socket = require("socket.io");
const MMU = require("./models/MoneyMessengerUser");

const app = express();
const cors = require("cors");
const FcmEngine = require("./classes/fcmEngine.class");
// const API_KEY = "u3PzY2kxEwCQ7mHDNq9B"
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const MemoryStore = rateLimit.MemoryStore;
const logger = createLogger({
  format: combine(label({ label: "right meow!" }), timestamp(), prettyPrint()),
  transports: [new transports.Console()],
});

const PORT = 9283;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const u = process.env.MONGOURIUSER2;
const p = process.env.MONGOURIPASS2;
// console.log(MONGO_URI);

mongoose
  .connect(
    `mongodb+srv://${u}:${p}@cluster0-rzlot.mongodb.net/test?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      dbName: "Power-SMS",

      useCreateIndex: true,
    }
  )
  .then((res) => {
    // console.log(res);
    // const server = http.createServer(app);
    // @ts-nocheck

    app.listen(PORT, () => {
      console.log(`listening on port: ${PORT}`);
    });

    console.log("Mongo success daze");
  })
  .catch((err) => {
    console.log(err);
  });

// const apiLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   store: new MemoryStore(),
// });

const userRateLimit = async (req, res, next) => {
  try {
    // Get the user identifier from the request (assuming it's available in the request)
    const api_key = req.query.api_key; // Replace this with how you retrieve the user's identifier

    // Fetch the user's rate limit from the database

    let data = {}
    try {
      let res222 = await axios.get(
        `http://localhost:8080/api/user/apikey/${api_key}`
      );
      if (!data) {
        console.log("could not find api key", data);
        return res.status(400).send({
          message: "could not find API Key",
          sent_data: false,
        });
      }

      data = res222.data;

    } catch (error) {
      return res.status(400).send({
        message: error.response.data.message,
        success: false,
      })
    }

  
    // console.log("found api key");
    // user = data
    req.user = data.user;

    if (data.user.balance <= 0) {
      return res.status(400).send({
        message: `Your balance is too low : $${data.user.balance}`,
        sent_data: false,
      });
    }

    // if (req.user.requestLimit < data.allowedCountPerMinute) {
    //   return res.status(400).send({
    //     message: `Too many requests, you are only allowed ${data.allowedCountPerMinute} sends per minute`,
    //     sent_data: false,
    //   });
    // }
    // Apply the rate limit for the user's requests
    // const limiter = rateLimit({
    //   windowMs: 1 * 60 * 1000, // 1 minute - The time frame for which requests are counted.
    //   max: 100, // The maximum number of requests allowed within the specified windowMs.
    //   message: `Too many requests for user please try again later.`,
    // });

    // Apply the rate limiter to the current request
    // limiter(req, res, next);
    next();
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
app.post("/v1/messages/send", userRateLimit, async (req, res) => {
  const { to_phone, message } = req.body;

  try {
    const {data} =await axios.post(
      `http://localhost:8080/api/user/sendcount/create/${req.user._id}`,
      {
        from: "money_messenger",
        to: to_phone,
        message: message,
      },
    );
 
    res.send({
      sent_data: true,
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(400).send({
      sent_data: false,
      message: "could not create message",
    });
  }

  
});

app.get("/v1/messages/status", async(req,res)=>{
try {
    const {data} =await axios.get(
      `http://localhost:8080/api/user/sendcount/status?api_key=${req.query.api_key}&msg_id=${req.query.msg_id}`,
      
    );

    res.send(data);
} catch (error) {
  console.log(error.response.data)
     res.status(500).json({
      message: error.response.data.message,
    });
}
})
app.post("/sendsms", async (req, res) => {
  res.status(200).send({
    message: "sms sent",
    _id: "23f3293f9332f2fdsefeeswe2",
  });
  // console.log(req.headers);

  logger.log({
    level: "info",
    headers: req.headers,
    body: req.body,
    query: req.query,
  });

  // console.log(req.body);
  // console.log(req.query);
});
