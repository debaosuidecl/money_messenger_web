// @ts-nocheck
const randomtring = require("randomstring");
var convert = require("xml-js");
const axios = require("axios");
const NamecheapCredentials = require("../models/NamecheapCredentials");
const { requestModule } = require("../helperfunctions/requestModule");
const DomainGroup = require("../models/DomainGroup");
const Verticals = require("../models/Verticals");
const Dataowner = require("../models/Dataowner");
const Domain = require("../models/Domain");
async function domainPurchase({
  domainstopurchase,
  domaingroupid,
  trafficid,
  datasupplierid,
  socket,
}) {
  try {
    // console.log(numberoflinks, selectedtlds);

    console.log(domainstopurchase, domaingroupid, trafficid, datasupplierid);
    // return;
    if (
      domainstopurchase.length <= 0 ||
      !domaingroupid ||
      !trafficid ||
      !datasupplierid
    ) {
      return socket.emit("errors", {
        errors: [
          {
            msg: "Please enter all configurations",
          },
        ],
      });
    }

    // // get Namecheap credentials

    // // generate random characters
    let namecheapcred = {};

    try {
      namecheapcred = await NamecheapCredentials.findOne({
        user: socket.user.id,
      });

      if (!namecheapcred) {
        return socket.emit("errors", {
          errors: [
            {
              msg: "API KEY NOT FOUND",
            },
          ],
        });
      }
    } catch (error) {
      return socket.emit("errors", {
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
    } catch (error) {
      console.log(error);

      return socket.emit("errors", {
        errors: [
          {
            msg: "Could not fetch balance, please try again later",
          },
        ],
      });
    }

    let cost_of_domains = 0;

    try {
      cost_of_domains =
        domainstopurchase &&
        domainstopurchase
          .reduce((prev, cur) => {
            return prev + cur.price;
          }, 0)
          .toFixed(2);
    } catch (error) {
      console.log(error);
    }

    console.log(cost_of_domains, "cost of domains");
    if (parseFloat(cost_of_domains) >= parseFloat(BALANCE)) {
      console.log("stop here");
      return socket.emit("errors", {
        errors: [
          {
            msg: `You do not have enough funds to complete this purchase. Balance USD${BALANCE}`,
          },
        ],
      });
    }

    console.log("verifying validity");
    // verify domain group validity
    let domaingroup;
    try {
      domaingroup = await DomainGroup.findOne({
        user: socket.user.id,
        _id: domaingroupid,
      });

      console.log(domaingroup);

      if (!domaingroup) {
        console.log("domain group id is invalid");
        return socket.emit("errors", {
          errors: [
            {
              msg: `Domain group id is invalid`,
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);

      return socket.emit("errors", {
        errors: [
          {
            msg: `error fetching domaingroupid`,
          },
        ],
      });
    }

    // verify traffic validity
    let traffic;
    try {
      traffic = await Verticals.findOne({
        user: socket.user.id,
        _id: trafficid,
      });

      console.log(traffic);
      if (!traffic) {
        console.log("Vertical id is invalid");
        return socket.emit("errors", {
          errors: [
            {
              msg: `Vertical id is invalid`,
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);

      return socket.emit("errors", {
        errors: [
          {
            msg: `error fetching vertical`,
          },
        ],
      });
    }

    // verify traffic dataowner
    let datasupplier;
    try {
      datasupplier = await Dataowner.findOne({
        user: socket.user.id,
        _id: datasupplierid,
      });

      console.log(datasupplier);

      if (!datasupplier) {
        console.log("data supplier id is invalid");
        return socket.emit("errors", {
          errors: [
            {
              msg: `Data Supplier id is invalid`,
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);
      return socket.emit("errors", {
        errors: [
          {
            msg: `error fetching data supplier`,
          },
        ],
      });
    }

    if (domaingroup.traffic && domaingroup.datasupplier) {
      if (
        domaingroup.traffic != traffic._id ||
        domaingroup.dataowner != datasupplier._id
      ) {
        return socket.emit("errors", {
          errors: [
            {
              msg: "The traffic or dataowner details do not match",
            },
          ],
        });
      }
    }

    console.log("everything was found");
    const { domainlengthbeforepurchase, finalDomainsPurchased } =
      await purchasedomains(
        socket,
        namecheapcred,
        domainstopurchase,
        domaingroup,
        traffic,
        datasupplier
      );

    console.log(domainlengthbeforepurchase, finalDomainsPurchased, 220);

    socket.emit("success-purchase", {
      msg: `Purchase Process Finished:${finalDomainsPurchased} of ${domainstopurchase.length} domains purchased`,
    });

    await DomainGroup.findOneAndUpdate(
      {
        _id: domaingroupid,
      },
      {
        $set: {
          traffic: traffic._id,
          dataowner: datasupplier._id,
        },
      }
    );

    // socket.emit("fetch_complete", true);
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
      //   .AccountBalance;

      console.log(balance);
      resolve(balance);
    } catch (error) {
      console.log(error);
      resolve(error);
    }
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function purchasedomains(
  socket,
  namecheapcred,
  domainstopurchase,
  domaingroup,
  traffic,
  datasupplier
) {
  return new Promise(async (resolve, reject) => {
    // socket.emit("tldlist", domainstopurchase);

    let domainlengthbeforepurchase = domainstopurchase.length;
    const doubleList = split(domainstopurchase, 5);
    let finalDomainsPurchased = 0;
    for (let i = 0; i < doubleList.length; i++) {
      await delay(2000);
      try {
        let purchasedetails = await Promise.all(
          doubleList[i].map((domain) =>
            _buydomains(
              domain,
              namecheapcred.apikey,
              namecheapcred.username,
              domaingroup,
              traffic,
              datasupplier,
              socket
            )
          )
        );

        purchasedetails = purchasedetails.filter(
          (detail) => detail.isPurchased != false
        );

        // const domainLengthAfterPurchase =  purchasedetails.length;

        console.log(purchasedetails);

        finalDomainsPurchased = finalDomainsPurchased + purchasedetails.length;
        await Domain.insertMany(purchasedetails);
      } catch (error) {
        console.log(error, 86);
        console.log(error);
        return socket.emit("error", {
          errors: [{ msg: `An Error occured in domain purchase.` }],
        });
      }

      //   console.log(pricingdetails);
    }

    resolve({
      domainlengthbeforepurchase,
      finalDomainsPurchased,
    });
  });
}
function split(a, n) {
  let newArray = [];
  let total = a;
  for (let i = 0; i < total.length; i++) {
    if (a.length <= 0) return newArray;
    newArray.push([...a.slice(0, n)]);
    a = a.slice(n);
  }
  return newArray;
}
async function _buydomains(
  domain,
  apikey,
  apiuser,
  domaingroup,
  traffic,
  datasupplier,
  socket
) {
  return new Promise(async (resolve, reject) => {
    try {
      //   console.log(domain, 24242323);
      let { data } = await requestModule(
        "get",
        `https://api.namecheap.com/xml.response?ApiUser=${apiuser}&ApiKey=${apikey}&UserName=${apiuser}&Command=namecheap.domains.create&ClientIP=105.112.98.221&DomainName=${domain.domain}&Years=1&AuxBillingFirstName=Jared&AuxBillingLastName=Mancinelli&AuxBillingAddress1=111POWERSMSLAND&AuxBillingStateProvince=CA&AuxBillingPostalCode=01002&AuxBillingCountry=US&AuxBillingPhone=+1.9785947255&AuxBillingEmailAddress=hello@freshdatanow.com&AuxBillingOrganizationName=POWERSMSLAND&AuxBillingCity=Massachusettes&TechFirstName=Jared&TechLastName=Mancinelli&TechAddress1=POWERSMSLAND&TechStateProvince=Massachusettes&TechPostalCode=01002&TechCountry=US&TechPhone=+1.9785947255&TechEmailAddress=hello@freshdatanow.com&TechOrganizationName=POWERSMSLAND&TechCity=Massachusettes&AdminFirstName=Jared&AdminLastName=Mancinelli&AdminAddress1=powersmsland111&AdminStateProvince=CA&AdminPostalCode=01002&AdminCountry=US&AdminPhone=+1.9785947255&AdminEmailAddress=hello@freshdatanow.com&AdminOrganizationName=POWERSMSLAND&AdminCity=Massachusettes&RegistrantFirstName=Jared&RegistrantLastName=Mancinelli&RegistrantAddress1=POWERSMSLAND&RegistrantStateProvince=CA&RegistrantPostalCode=01002&RegistrantCountry=US&RegistrantPhone=+1.9785947255&RegistrantEmailAddress=hello@freshdatanow.com&RegistrantOrganizationName=POWERSMSLAND&RegistrantCity=CA&AddFreeWhoisguard=yes&WGEnabled=yes&GenerateAdminOrderRefId=False&`,
        {},
        false
      );

      //  let data2 = data;

      data = convert.xml2json(data, {
        compact: true,
        spaces: 1,
      });
      console.log(data, "2");

      let checkJson = JSON.parse(data);

      if (checkJson.ApiResponse["_attributes"].Status === "ERROR") {
        resolve({
          //   ...domain,
          isPurchased: false,
          name: domain.domain,
          traffic: traffic._id,
          dataowner: datasupplier._id,
          domaingroup: domaingroup._id,
          user: socket.user.id,
          purchasemethod: "namecheap",
        });
      }

      let redirecturl = traffic.url;
      let addressToForward = `https://www.domain-secured.com/ping-revamp?redirect=${encodeURIComponent(
        redirecturl
      )}&dg=${domaingroup._id}`;

      let data2 = await requestModule(
        "get",
        `https://api.namecheap.com/xml.response?apiuser=${apiuser}&apikey=${apikey}&username=${apiuser}&Command=namecheap.domains.dns.setHosts&ClientIp=122.178.155.204&SLD=${
          domain.domain.split(".")[0]
        }&TLD=${
          domain.domain.split(".")[1]
        }&HostName1=@&RecordType1=URL&Address1=${encodeURIComponent(
          addressToForward
        )}`,
        {},
        false
      );

      resolve({
        //   ...domain,
        isPurchased: true,
        name: domain.domain,
        traffic: traffic._id,
        dataowner: datasupplier._id,
        domaingroup: domaingroup._id,
        user: socket.user.id,
        purchasemethod: "namecheap",
      });
    } catch (error) {
      console.log(error);
      return socket.emit("error", {
        errors: [{ msg: `An Error occured in domain purchase.` }],
      });
    }
  });
}

module.exports = {
  domainPurchase,
};
