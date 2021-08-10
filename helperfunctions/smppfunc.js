const smpp = require("smpp");

async function bind(session, conf, ignorelisteners) {
  return new Promise(async (res, rej) => {
    if (!ignorelisteners) {
      session.on("error", (err) => {
        session.close();
        rej(err);
      });

      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        session.close();
        rej("Binding Timed out");
      }, 8000);
    }

    session["bind_" + conf.bindType](
      {
        system_id: conf.user,
        password: conf.pass,
      },
      function (pdu) {
        console.log(pdu);

        if (pdu.command_status == 0) {
          console.log("Bind is up");
          res({
            success: true,
            code: 0,
          });
        } else {
          rej({
            error: true,
            pducode: pdu.command_status,
          });
        }
      }
    );
  });
}

function connectsmpp(conf) {
  return new Promise((res, rej) => {
    console.log(conf);
    console.log("connecting");
    try {
      const session = smpp.connect({
        url: `smpp://${conf.endpoint}:${conf.port}`,
        auto_enquire_link_period: 100000,
      });

      session.on("error", (err) => {
        // console.log(err);

        session.close();

        rej(err);

        // return errorreturn(res, 401, "Error Connecting to SMPP server");
      });

      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        res(session);
      }, 4000);
      return session;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
}

function sendmessagesmpp(session, from, to, message, ignorelisteners) {
  return new Promise(async (res, rej) => {
    if (!ignorelisteners) {
      session.on("error", (err) => {
        console.log(err, "failed to send");

        session.close();

        res({
          error: true,
          code: 0,
          msg: "failure submitting message",
        });

        // return errorreturn(res, 401, "Error Connecting to SMPP server");
      });
    }
    session.submit_sm(
      {
        registered_delivery: 1,
        source_addr: from,
        destination_addr: to,
        short_message: message,
      },
      function (pdu) {
        if (pdu.command_status == 0) {
          // console.log("Bind is up");
          res({
            success: true,
            code: 0,
            msg: pdu,
          });
        } else {
          res({
            error: true,
            code: pdu.command_status,
            msg: pdu,
          });
        }
      }
    );
  });
}

module.exports = {
  bind,
  connectsmpp,
  sendmessagesmpp,
};
