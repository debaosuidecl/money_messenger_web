// @ts-nocheck
const express = require("express");
const connectDB = require("../config/db");

const socket = require("socket.io");
const app = express();

const dotenv = require("dotenv");
const leadupload = require("../helperfunctions/leadupload");

dotenv.config();

const PORT = process.env.campaignserver4;
const server = app.listen(PORT, async () => {
  await connectDB();
});

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id, "from upload leads1");
  socket.on("scrub", (leadgroup) => {
    console.log(leadgroup, "to be scrubbed");

    leadupload(leadgroup._id, io);
  });
});
