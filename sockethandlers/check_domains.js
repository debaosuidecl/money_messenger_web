// @ts-nocheck
const randomtring = require("randomstring");
var convert = require("xml-js");
const axios = require("axios");
const NamecheapCredentials = require("../models/NamecheapCredentials");
const { requestModule } = require("../helperfunctions/requestModule");
async function domainGeneration({ numberoflinks, selectedtlds, socket }) {
  try {
    console.log(numberoflinks, selectedtlds);

    if (numberoflinks <= 0 || selectedtlds.lenght <= 0) {
      return socket.emit("errors-domain-check", {
        errors: [
          {
            msg: "Number of links must be",
          },
        ],
      });
    }

    // get Namecheap credentials

    // generate random characters
    let namecheapcred = {};

    try {
      namecheapcred = await NamecheapCredentials.findOne({
        user: socket.user.id,
      });

      if (!namecheapcred) {
        return socket.emit("errors-domain-check", {
          errors: [
            {
              msg: "API KEY NOT FOUND",
            },
          ],
        });
      }
    } catch (error) {
      return socket.emit("errors-domain-check", {
        errors: [
          {
            msg: "API KEY NOT FOUND",
          },
        ],
      });
    }

    const arrayOfLinks = [];

    await checkdomainalgo(
      socket,
      namecheapcred,
      numberoflinks,
      selectedtlds,
      arrayOfLinks,
      0,
      false
    );

    socket.emit("fetch_complete", true);
  } catch (error) {
    console.log(error);
  }
}
function checkdomainalgo(
  socket,
  namecheapcred,
  numberoflinks,
  selectedtlds,
  arrayOfLinks,
  numberofdomainstoredo = 0,
  addtoalreadyposteddomains = false
) {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < numberoflinks; i++) {
      const domainString = randomtring.generate({
        length: 5,
      });

      var random_tld =
        selectedtlds[Math.floor(Math.random() * selectedtlds.length)];

      arrayOfLinks.push({
        domain: domainString + "." + random_tld,
        price: null,
      });
    }

    socket.emit("tldlist", arrayOfLinks);

    const doubleList = split(arrayOfLinks, 10);
    for (let i = 0; i < doubleList.length; i++) {
      try {
        let pricingdetails = await Promise.all(
          doubleList[i].map((domain) =>
            _checknamecheapdomainscost(
              domain,
              namecheapcred.apikey,
              namecheapcred.username,
              socket
            )
          )
        );
        console.log(pricingdetails, "pricingdetails");

        if (i === 0) {
          socket.emit("tldlist", pricingdetails, arrayOfLinks);
        } else {
          socket.emit("tldlistadd", pricingdetails, arrayOfLinks);
        }

        resolve("done");
      } catch (error) {
        console.log(error, 86);
      }

      //   console.log(pricingdetails);
    }
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
async function _checknamecheapdomainscost(domain, apikey, apiuser, socket) {
  return new Promise(async (resolve, reject) => {
    try {
      //   console.log(domain, 24242323);
      const { data } = await requestModule(
        "get",
        `https://api.namecheap.com/xml.response?APIKey=${apikey}&ClientIP=105.112.185.237&UserName=${apiuser}&APIUser=${apiuser}&Command=namecheap.users.getPricing&ProductType=DOMAIN&ProductName=${
          domain.domain.split(".")[1]
        }`,
        {},
        false
      );

      let data2 = await requestModule(
        "get",
        `https://api.namecheap.com/xml.response?ApiUser=${apiuser}&APIKey=${apikey}&UserName=${apiuser}&ClientIp=45.41.134.50&Command=namecheap.domains.check&DomainList=${domain.domain}`,
        {},
        false
      );

      data2 = data2.data;

      data2 = convert.xml2json(data2, {
        compact: true,
        spaces: 1,
      });
      console.log(data2, "2");

      let checkJson = JSON.parse(data2);
      // console.log(result2);
      // fsExtra.writeFile("errors-domain-check.txt", result2);

      if (checkJson.ApiResponse["_attributes"].Status === "ERROR") {
        console.log(
          "error occured",
          `${checkJson.ApiResponse.Errors.Error["_text"]}`
        );
        return socket.emit("errors-domain-check", {
          errors: [{ msg: `${checkJson.ApiResponse.Errors.Error["_text"]}` }],
        });
      } else {
        // socket.emit("purchaseSuccess", domain);
      }

      let isAvailable =
        checkJson.ApiResponse.CommandResponse.DomainCheckResult["_attributes"]
          .Available;
      let isPremiumName =
        checkJson.ApiResponse.CommandResponse.DomainCheckResult["_attributes"]
          .IsPremiumName;
      let domain2 =
        checkJson.ApiResponse.CommandResponse.DomainCheckResult["_attributes"]
          .Domain;

      var result = convert.xml2json(data, {
        compact: true,
        spaces: 1,
      });
      let newR = JSON.parse(result);

      let priceDetail;

      try {
        priceDetail =
          newR["ApiResponse"]["CommandResponse"]["UserGetPricingResult"][
            "ProductType"
          ]["ProductCategory"][1]["Product"]["Price"][0]["_attributes"][
            "Price"
          ];
      } catch (error) {
        return socket.emit("errors-domain-check", {
          errors: [
            {
              msg: `Could not access price details for this ${domain.domain}. Please try another Tld`,
            },
          ],
        });
      }

      console.log(priceDetail, "price detail");
      let final_value = {};
      if (!JSON.parse(isAvailable) || JSON.parse(isPremiumName)) {
        console.log(domain, isAvailable);
        final_value = await _checknamecheapdomainscost(
          {
            domain:
              randomtring.generate({
                length: 6,
              }) +
              "." +
              domain.domain.split(".")[1],
          },
          apikey,
          apiuser,
          socket
        );

        resolve(final_value);
      } else {
        resolve({
          domain: domain.domain,
          price: parseFloat(priceDetail) + 0.95,

          isAvailable: isAvailable,
          isPremiumName: isPremiumName,
        });
      }
    } catch (error) {
      console.log(error);
      return socket.emit("errors-domain-check", {
        errors: [
          { msg: `An Error occured in your fetch please generate again.` },
        ],
      });
    }
  });
}

module.exports = {
  domainGeneration,
};
