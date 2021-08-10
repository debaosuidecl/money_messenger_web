// @ts-nocheck
const express = require("express");

const connectDB = require("../config/db");

const socket = require("socket.io");
const app = express();
const uploadphones = require("../helperfunctions/uploadphones");
const deletephonegroup = require("../helperfunctions/deletephonegroup");

const dotenv = require("dotenv");
const leadupload = require("../helperfunctions/leadupload");

dotenv.config();

const PORT = process.env.uploadleads1;
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
  socket.on("uploadsource", (phonegroup) => {
    console.log(phonegroup, "to be scrubbed phoneg");

    uploadphones(phonegroup._id, io);
  });
  socket.on("deletesource", (phonegroup) => {
    console.log(phonegroup, "to be scrubbed");

    deletephonegroup(phonegroup, io);
  });
  // add blacklist upload
});
