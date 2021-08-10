const smpp = require("smpp");
const cron = require("node-cron");
const { bind, sendmessagesmpp } = require("../helperfunctions/smppfunc");
function connectsmpp(conf) {
  // console.log(conf);

  console.log("connecting");
  try {
    const session = smpp.connect({
      url: `smpp://${conf.endpoint}:${conf.port}`,
      auto_enquire_link_period: 100000,
    });

    session.on("error", (err) => {
      console.log(err, "115");
    });

    return session;
  } catch (error) {
    console.log(error);
    return false;
  }
}

(async () => {
  try {
    let stop = false;

    const task = cron.schedule("*/1 * * * * *", function () {
      // console.log("running every second");
      // console.log(stop);
      // stop = true;
    });
    const session = connectsmpp({
      // user: "clement",
      // pass: "debapassword",
      // endpoint: "67.229.32.2",
      // bindType: "transceiver",
      // port: 8392,

      // endpoint: "67.229.90.2", //SMSC
      // port: 8392,
      // // bindType: "transceiver", // receiver || transmitter
      // user: "cs_cqd0bc",
      // pass: "G6gbnT7t",
      // srcTon: 4,
      // srcNpi: 5,
      // dstTon: 6,
      // dstNpi: 7,
      // encoding: 3,
      // srcAddr: "12242776490",

      user: "cs_cqd0bc",
      pass: "G6gbnT7t",
      endpoint: "localhost",
      bindType: "transceiver",
      port: 2775,
    });

    let config = {
      user: "cs_cqd0bc",
      pass: "G6gbnT7t",
      endpoint: "localhost",
      bindType: "transceiver",
      port: 2775,
    };

    session.on("deliver_sm", function (pdu) {
      console.log(pdu.short_message, "delivery reportclient");
      session.send(pdu.response());
    });
    try {
      let bindval = await bind(session, config);
      console.log(bindval);
    } catch (error) {
      console.log(error, 70);
    }
    try {
      console.log("sending message");
      let sendmessage = await sendmessagesmpp(
        session,
        "123456",
        "19785947255",
        "hello Jared",
        config
      );
      console.log(sendmessage, "messsage");
    } catch (error) {
      console.log(error, 84);
    }

    //   console.log(connected, 38);
  } catch (error) {
    console.log(error, "24");
  }
})();
