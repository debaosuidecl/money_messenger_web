// @ts-nocheck

const express = require("express");

const mongoose = require("mongoose");
const connectDB = require("../config/db");
let socket = require("socket.io");

const app = express();
const cors = require("cors");

const PORT = 8081;
app.use(cors());
app.use(express.json());

let server = app.listen(PORT, async () => {
  await connectDB();
  console.log(`listening on port ${PORT}`);
});

// let io = socket(server);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.use(require("../sockethandlers/domain").checkAuth);

io.on("connection", (socket) => {
  console.log(socket.id, socket.user);

  socket.on("generate_domains", ({ numberoflinks, selectedtlds }) =>
    require("../sockethandlers/check_domains").domainGeneration({
      numberoflinks,
      selectedtlds,
      socket,
    })
  );
  socket.on(
    "purchase_domains",
    ({ domainstopurchase, domaingroupid, trafficid, datasupplierid }) =>
      require("../sockethandlers/purchase_domains").domainPurchase({
        domainstopurchase,
        domaingroupid,
        trafficid,
        datasupplierid,
        socket,
      })
  );
  socket.on("get_balance", (_) =>
    require("../sockethandlers/check-namecheapbalance").balancecheck({
      socket,
    })
  );

  //   const token = socket.handshake.auth.token;
});
