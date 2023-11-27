//@ts-nocheck
const parseCSV = require("../helperfunctions/parseCSV");
const LeadGroup = require("../models/LeadGroup");
const split = require("../helperfunctions/split");
const LeadsTotal = require("../models/LeadUndeduped");
const carrierSwitch = require("./carrierswitch");
const { blacklistScrub } = require("../services/blacklist.service");
function leadupload(_id, io) {
  return new Promise(async (resolve, reject) => {
    try {
      let csvparsed = [];

      const group = await LeadGroup.findById(_id);

      group.status = "processing";
      await group.save();

      // return;

      try {
        csvparsed = await parseCSV(group.cloudinaryurl, ",", {
          remote: true,
        });
        console.log(csvparsed);
      } catch (error) {
        console.log(error);
      }

      const headers = csvparsed[0];

      const phoneheaderindex = headers.indexOf(group.headerMaps.phone);
      const firstnameheaderindex = headers.indexOf(group.headerMaps.firstname);
      const lastnameheaderindex = headers.indexOf(group.headerMaps.lastname);
      const addressheaderindex = headers.indexOf(group.headerMaps.address);
      const cityheaderindex = headers.indexOf(group.headerMaps.city);
      const stateheaderindex = headers.indexOf(group.headerMaps.state);
      if (phoneheaderindex == -1) {
        await LeadGroup.findOneAndUpdate(
          {
            _id: group._id,
          },
          {
            $set: {
              status: "error",
              error: "Header improperly matched.  Please try again.",
            },
          }
        );
        resolve("error");
      }

      csvparsed.shift();

      const phones = {};

      let infiledupes = 0;

      let totalUploadCount = csvparsed.length;
      csvparsed = csvparsed
        .map((item) => {
          return JSON.parse(
            JSON.stringify({
              phone:
                phoneheaderindex === -1 ? undefined : item[phoneheaderindex],
              firstname:
                firstnameheaderindex === -1
                  ? undefined
                  : item[firstnameheaderindex],
              lastname:
                lastnameheaderindex === -1
                  ? undefined
                  : item[lastnameheaderindex],
              address:
                addressheaderindex === -1
                  ? undefined
                  : item[addressheaderindex],
              city: cityheaderindex === -1 ? undefined : item[cityheaderindex],
              state:
                stateheaderindex === -1 ? undefined : item[stateheaderindex],

              leadgroup: group._id,
              user: group.user,
            })
          );
        })
        .filter((item) => {
          let isExisting = phones.hasOwnProperty(`${item["phone"]}`);
          if (isExisting) {
            infiledupes++;
          }
          return isExisting ? false : (phones[`${item["phone"]}`] = 1);
        });

      let duplicates = 0;
      console.log(csvparsed);

      // let csvtosave = [...csvparsed];

      const updatevalue = await LeadGroup.findOneAndUpdate(
        {
          _id: group._id,
        },
        {
          $set: {
            uploadCount: totalUploadCount,
            infileduplicates: infiledupes,
          },
        },
        {
          new: true,
        }
      );

      // console.log(updatevalue, "update");

      io.sockets.emit("updatescrub", updatevalue);

      let splitdata = split(csvparsed, 10000);

      const blacklistCount = 0;

      const carrierdetails = {
        "AT&T": 0,
        VERIZON: 0,
        SPRINT: 0,
        "T-MOBILE": 0,

        METRO: 0,
        "US Cellular": 0,

        OTHER: 0,

        landline: 0,

        blacklist: 0,
      };

      for (let i = 0; i < splitdata.length; i++) {
        console.time("adding records");
        try {
          // save 10000 in map

          const phone_details_map = {};
          let splitindividual = splitdata[i];
          for (let j = 0; j < splitindividual.length; j++) {
            phone_details_map[splitindividual[j]["phone"]] = splitindividual[j];
            // onlyphonesarray.push({phone: splitindividual[j]['phone']})
          }

          console.log(splitdata[i], 23232332)

          // scrub splitdata[i]

          // let scrubresult = await blacklistScrub(splitindividual);
          // console.log({scrubresult}, scrubresult.phoneList)
          // scrubresult = scrubresult.flat().map((d) => {
          //   let fulldetails = phone_details_map[`${d.phone}`];

          //   if (d.reason || d.status === "Blacklisted") {
          //     carrierdetails["blacklist"] = carrierdetails["blacklist"] + 1;
          //   }
          //   let carrier = carrierSwitch(d.company);
          //   carrierdetails[carrier] = carrierdetails[carrier] + 1;

          //   console.log(carrierdetails, "carrier details");
          //   if (d.phone_type === "Landline") {
          //     carrierdetails["landline"] = carrierdetails["landline"] + 1;
          //   }
          //   let res = {
          //     phone: d.phone,
          //     type: d.phone_type,
          //     carrier,
          //     status: d.status,
          //     reason: d.reason,
          //     firstname: fulldetails.firstname || undefined,
          //     lastname: fulldetails.lastname || undefined,
          //     address: fulldetails.address || undefined,
          //     city: fulldetails.city || undefined,
          //     state: fulldetails.state || undefined,

          //     leadgroup: fulldetails.leadgroup,
          //     user: fulldetails.user,
          //   };
          //   return JSON.parse(JSON.stringify(res));
          // });

          //extract results from map in an efficient way

          // console.log(scrubresult, "final 197");
          // // save carrier results
          const result = await LeadsTotal.collection.insertMany(splitdata[i], {
            ordered: false,
          });
          console.log(i);
        } catch (error) {
          console.log(error, 163);
        }
        const updatevalue = await LeadGroup.findOneAndUpdate(
          {
            _id: group._id,
          },
          {
            $inc: {
              totalProcessed: splitdata[i].length,
            },
          },
          {
            new: true,
          }
        );

        io.sockets.emit("updatescrub", updatevalue);

        if (updatevalue.status === "deleted") {
          return console.log("halting upload");
        }
        console.timeEnd("adding records");
      }

      console.log(duplicates, "duplicates");

      const realdupes = await LeadsTotal.aggregate([
        {
          $group: {
            _id: { phone: "$phone", user: "$user" },
            docs: { $push: "$leadgroup" },
            count: { $sum: 1 },
          },
        },
        {
          $match: {
            count: { $gt: 1 },
            docs: { $in: [group._id.toString()] },
          },
        },
      ]);

      // console.log(realdupes, 195)
      const finalupdate = await LeadGroup.findOneAndUpdate(
        {
          _id: group.id,
        },
        {
          $set: {
            status: "done",
            globalduplicates: realdupes.length,
            ATT: carrierdetails["AT&T"],
            VERIZON: carrierdetails["VERIZON"],
            METRO: carrierdetails["METRO"],
            SPRINT: carrierdetails["SPRINT"],
            TMOBILE: carrierdetails["T-MOBILE"],
            USCellular: carrierdetails["US Cellular"],
            OTHER: carrierdetails["OTHER"],
            landline: carrierdetails["landline"],
            blacklist: carrierdetails["blacklist"],
          },
        },
        { new: true }
      );

      io.sockets.emit("updatescrub", finalupdate);
      resolve(csvparsed);
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = leadupload;
