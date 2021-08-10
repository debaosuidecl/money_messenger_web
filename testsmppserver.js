var smpp = require("smpp");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
  format: combine(label({ label: "right meow!" }), timestamp(), prettyPrint()),
  transports: [new transports.Console()],
});
var server = smpp.createServer(function (session) {
  session.on("error", function (error) {
    console.log("an error occured");
  });

  session.on("connect", () => {
    console.log("connected, 13");
  });

  session.on("submit_sm", function (pdu) {
    // console.log("submitted");

    logger.log({
      level: "info",
      pdu,
    });

    var msgid = "132jf323fdsf32fds432f"; // generate a message_id for this message.
    session.send(
      pdu.response({
        message_id: msgid,
      })
    );
  });

  session.on("deliver_sm", function (pdu) {
    console.log(pdu.short_message, "delivery report");
    session.send(pdu.response());
  });
  session.on("deliver_sm_resp ", function (pdu) {
    console.log(pdu.short_message, "delivery report");
    session.send(pdu.response());
  });
  session.on("bind_transceiver", function (pdu) {
    console.log(pdu);
    // we pause the session to prevent further incoming pdu events,
    // untill we authorize the session with some async operation.
    session.pause();
    checkAsyncUserPass(pdu.system_id, pdu.password, function (err) {
      if (err) {
        session.send(
          pdu.response({
            command_status: smpp.ESME_RBINDFAIL,
          })
        );
        session.close();
        return;
      }
      session.send(pdu.response());
      session.resume();
    });
  });
});

function checkAsyncUserPass(system_id, password, callback) {
  console.log(system_id, password, "accurate");

  callback(null);
}
server.listen(2775);
