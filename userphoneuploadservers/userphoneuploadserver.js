// @ts-nocheck

const express = require("express");

const connectDB = require("../config/db");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const cors = require("cors");

const PORT = process.env.userphonesserver;
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/uploadsenderphone", require("../routes/uploadsenderphone"));

let server = app.listen(PORT, async () => {
  await connectDB();
  console.log(`listening on port ${PORT}`);
});
