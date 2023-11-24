// @ts-nocheck
const express = require("express");
const connectDB = require("../config/db");

const socket = require("socket.io");
const app = express();
const cron = require("node-cron");

const dotenv = require("dotenv");
const sendcampaigns = require("../helperfunctions/sendcampaigns");
const campaignsender = require("../schedulefunctions/campaignsender");
const redis = require("../redisfunctions/redisclient");

dotenv.config();

const PORT = process.env.campaignserver1;
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
  console.log(socket.id, "from create campaigns1");

  // io.sockets.emit("ping", "ensure connection");

  let running = false;
  // Schedule tasks to be run on the server.
  // cron.schedule("* * * * * *", () => campaignsender(io));

  socket.on("status_click", (campaignval) => {
    io.sockets.emit("status_click", campaignval);
  });
  socket.on("status_conversion", (campaignval) => {
    io.sockets.emit("status_conversion", campaignval);
  });
  socket.on("send", (campaigndetails) => {
    console.log(campaigndetails, "to be scrubbed");

    sendcampaigns(campaigndetails, io, redis);
  });

  socket.on("scheduledsend", (campaigndetails) => {
    console.log(campaigndetails, "to be scrubbed schedule");
    let stop = false;

    const task = cron.schedule("*/40 * * * * *", async function () {
      console.log("running a task every 10 second");
      const shouldcontinue = await campaignsender(campaigndetails);

      if (shouldcontinue === "stop") {
        stop = true;
      }
      if (shouldcontinue) {
        sendcampaigns(campaigndetails, io, redis);
        stop = true;
      }
    });
    const interval = setInterval(() => {
      if (stop) {
        console.log(stop, "stopping the campaign now");
        task.stop();
        clearInterval(interval);
      }
    }, 60000);
  });
});
