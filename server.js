// @ts-nocheck

const express = require("express");

const connectDB = require("./config/db");
const dotenv = require("dotenv");
// const redis = require("./redisfunctions/redisclient");
const transporter = require("./mailer/nodemailer.mailer");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const cors = require("cors");
const { handlestripewebhooks } = require("./controllers/webhookcontroller");
// const CampaignManager = require("./models/CampaignManager");

const PORT = process.env.mainserver;
app.use(cors({ origin: true, credentials: true }));

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  handlestripewebhooks
);

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/verticals", require("./routes/verticals"));
app.use("/api/dataowner", require("./routes/dataowner"));
app.use("/api/domains", require("./routes/domains"));
app.use("/api/domaingroup", require("./routes/domaingroups"));
app.use("/api/smsroutes", require("./routes/smsroute"));
app.use("/api/leads", require("./routes/leads"));
app.use("/api/campaigns", require("./routes/campaigns"));
app.use("/api/messageschema", require("./routes/messageschema"));
app.use("/api/uploadsenderphone", require("./routes/uploadsenderphone"));
app.use("/api/leadactivity", require("./routes/leadactivity"));
app.use("/api/subscriptions", require("./routes/subscription"));
app.use("/api/admin", require("./routes/admin"));
// redis.on("connect", () => {
//   console.log("connected to redis");
// });
if (process.env.NODE_ENV === "production") {
  app.use(express.static("myclient/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "myclient", "build", "index.html"));
  });
}
let server = app.listen(PORT, async () => {
  await connectDB();
  transporter.verify((error, success) => {
    if (error) {
      console.log(error.message, 40);
    } else {
      console.log("Server is ready to take messages", success);
    }
  });
  console.log(`listening on port ${PORT}`);
});


const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.use(require("./sockethandlers/domain").checkAuth);

io.on("connection", (socket) => {
  console.log(socket.id, socket.user);

  socket.on("generate_domains", ({ numberoflinks, selectedtlds }) =>
    require("./sockethandlers/check_domains").domainGeneration({
      numberoflinks,
      selectedtlds,
      socket,
    })
  );
  socket.on(
    "purchase_domains",
    ({ domainstopurchase, domaingroupid, trafficid, datasupplierid }) =>
      require("./sockethandlers/purchase_domains").domainPurchase({
        domainstopurchase,
        domaingroupid,
        trafficid,
        datasupplierid,
        socket,
      })
  );
  socket.on("get_balance", (_) =>
    require("./sockethandlers/check-namecheapbalance").balancecheck({
      socket,
    })
  );

  //   const token = socket.handshake.auth.token;
});

