const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const morgan = require("morgan");
const { Server } = require("socket.io");
const MMU = require("./models/MoneyMessengerUser");
const cors = require("cors");

// const pricing = require("./routes/pricing");
// const generalBulkRoutes = require("./routes/generalBulkRoutes");
// const invoices = require("./routes/invoices");
require("dotenv").config();

const app = express();

app.use(morgan("dev"));

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.get("/money-messenger/v1/users", async (req, res) => {
  // find lb users here
  try {
    const users = await MMU.find();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

const port = 2300;

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
  .then(async (res) => {
    // console.log(res);
    // const mmu = await MMU.findOneAndUpdate({
    //     email: "debaosuidecl@gmail.com",

    // }, {
    //     sendCount: 10,
    //     timeOfLastSend: new Date().getTime()
    // },
    //     {
    //         new: true
    //     })
    // console.log(mmu, 70)

    // const mmu = await MMU.find({})
    //     .sort({ sendCount: -1 }) // Sorting in ascending order based on 'yourProperty'
    //     .limit(1) // Retrieve only the first document (with the lowest value)
    // console.log(mmu, 70)
    //   .exec((err, result) => {
    //     if (err) {
    //       console.error("Error:", err);
    //     } else if (result.length === 0) {
    //       console.log("No documents found.");
    //     } else {
    //       console.log("Document with the lowest value:", result[0]);
    //     }
    //   });
    const server = http.createServer(app);
    // @ts-nocheck
    const io = new Server(server);
    io.on("connection", (socket) => {
      console.log("connected", socket.id);
    });

    app.listen(port, () => {
      console.log(`money messenger: ${port}`);
    });

    console.log("Mongo success daze");
  })
  .catch((err) => {
    console.log(err);
  });
