// @ts-nocheck
var convert = require("xml-js");
const NamecheapCredentials = require("../models/NamecheapCredentials");
const { requestModule } = require("../helperfunctions/requestModule");

async function balancecheck({ socket }) {
  try {
    let namecheapcred = {};

    try {
      namecheapcred = await NamecheapCredentials.findOne({
        user: socket.user.id,
      });

      if (!namecheapcred) {
        return socket.emit("errors-balance", {
          errors: [
            {
              msg: "API KEY NOT FOUND",
            },
          ],
        });
      }
    } catch (error) {
      return socket.emit("errors-balance", {
        errors: [
          {
            msg: "API KEY NOT FOUND",
          },
        ],
      });
    }

    // const arrayOfLinks = [];

    let BALANCE = 0;

    try {
      BALANCE = await getBalance(socket, namecheapcred);

      socket.emit("balance", BALANCE);
    } catch (error) {
      console.log(error);

      return socket.emit("errors-balance", {
        errors: [
          {
            msg: "Could not fetch balance, please try again later",
          },
        ],
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function getBalance(socket, namecheapcred) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await requestModule(
        "get",
        `https://api.namecheap.com/xml.response?APIKey=${namecheapcred.apikey}&ClientIP=105.112.185.237&UserName=${namecheapcred.username}&APIUser=${namecheapcred.username}&Command=namecheap.users.getBalances`,
        null,
        false
      );

      let parsedJSON = convert.xml2json(data, {
        compact: true,
        spaces: 1,
      });

      //   console.log(parsedJSON);
      parsedJSON = JSON.parse(parsedJSON);
      console.log(parsedJSON);
      //   return;
      if (parsedJSON.ApiResponse["_attributes"].Status === "ERROR") {
        console.log(
          "error occured",
          `${parsedJSON.ApiResponse.Errors.Error["_text"]}`
        );
        return socket.emit("error", {
          errors: [{ msg: `${parsedJSON.ApiResponse.Errors.Error["_text"]}` }],
        });
      }

      const balance =
        parsedJSON.ApiResponse.CommandResponse.UserGetBalancesResult._attributes
          .AccountBalance;

      console.log(balance);
      resolve(balance);
    } catch (error) {
      console.log(error);
      resolve(error);
    }
  });
}

module.exports = {
  balancecheck,
};
