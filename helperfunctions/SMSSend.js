// @ts-nocheck
const getaxiosobjectfromroute = require("./getaxiosobjectfromroute");
const Agent = require("agentkeepalive");
// const httpAgent = new http.Agent({ keepAlive: true });
const { sendmessagesmpp } = require("./smppfunc");
// const httpsAgent = new https.Agent({ keepAlive: true });
const axios = require("axios");
function bulkSend(smsobjectsplit, smsroute, session) {
  return new Promise(async (resolve, reject) => {
    const res = await Promise.allSettled(
      smsobjectsplit.map((smsobject) => sendfunc(smsobject, smsroute, session))
    );

    resolve(res);
  });
}
async function bulkSendMoneyMessenger(smsobjectsplit) {
  try {
    // console.log(smsobjectsplit["lead"], smsobjectsplit["message"], 19999)
    const result = await axios.post(
      "http://localhost:1000/mmsend?api_key=u3PzY2kxEwCQ7mHDNq9B",
      {
        to_phone: smsobjectsplit["lead"],
        message: smsobjectsplit["message"],
      }
    );

    console.log(result.data, "from money_messenger");
    return result.data;
  } catch (error) {
    console.log(error.response.data, "the error that occurred");
    // return error.response.data
    return { sent_data: false };
  }
}
function sendfunc(smsobject, smsroute, session) {
  //   console.log(smsobject, smsroute, 15);
  return new Promise(async (resolve, reject) => {
    if (!session && smsroute.routetype == "API") {
      const axiosobject = getaxiosobjectfromroute(
        smsroute,
        smsobject.message,
        smsobject.fromphone.phone,
        smsobject.lead.phone
      );

      // console.log(axiosobject);
      // return;
      let res;
      const keepaliveAgent = new Agent({
        maxSockets: 100,
        maxFreeSockets: 10,
        timeout: 1000000, // active socket keepalive for 60 seconds
        freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
      });
      try {
        res = await axios({
          ...axiosobject,
          httpAgent: keepaliveAgent,
        });
        resolve(res);
      } catch (error) {
        try {
          console.log(error.response.data);
        } catch (error) {
          console.log(error);
        }
        resolve(error);
      }
    }

    if (session && smsroute.routetype === "SMPP") {
      try {
        const messageresult = await sendmessagesmpp(
          session,
          smsobject.fromphone.phone,
          smsobject.lead.phone,
          smsobject.message,
          true
        );

        resolve(messageresult);
      } catch (error) {
        console.log(error);
        resolve({
          error: true,
          msg: error,
        });
      }
    }
  });
}

module.exports = {
  bulkSend,
  bulkSendMoneyMessenger,
};
