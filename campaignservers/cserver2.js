// @ts-nocheck
const express = require("express");
const connectDB = require("../config/db");

const socket = require("socket.io");
const app = express();

const dotenv = require("dotenv");
const sendcampaigns = require("../helperfunctions/sendcampaigns");

dotenv.config();

const PORT = process.env.campaignserver2;
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
  socket.on("send", (campaign) => {
    console.log(campaign, "to be scrubbed");

    sendcampaigns(campaign._id, io);
  });
});
