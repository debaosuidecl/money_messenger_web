// @ts-nocheck

const express = require("express");

// const mongoose = require("mongoose");
// const connectDB = require("./config/db");
// let socket = require("socket.io");

const app = express();
const cors = require("cors");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
  format: combine(label({ label: "right meow!" }), timestamp(), prettyPrint()),
  transports: [new transports.Console()],
});

const PORT = 1000;
app.use(cors());
app.use(express.json());

let server = app.listen(PORT, async () => {
  //   await connectDB();
  console.log(`listening on port ${PORT}`);
});

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
