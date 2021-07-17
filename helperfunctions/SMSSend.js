// @ts-nocheck
const getaxiosobjectfromroute = require("./getaxiosobjectfromroute");
const Agent = require("agentkeepalive");
// const httpAgent = new http.Agent({ keepAlive: true });
// const httpsAgent = new https.Agent({ keepAlive: true });
const axios = require("axios");
function bulkSend(smsobjectsplit, smsroute) {
  return new Promise(async (resolve, reject) => {
    const res = await Promise.allSettled(
      smsobjectsplit.map((smsobject) => sendfunc(smsobject, smsroute))
    );

    resolve(res);
  });
}

function sendfunc(smsobject, smsroute) {
  //   console.log(smsobject, smsroute, 15);
  return new Promise(async (resolve, reject) => {
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
  });
}

module.exports = {
  bulkSend,
};
