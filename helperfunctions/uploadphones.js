const path = require("path");
const SendingPhoneGroup = require("../models/SendingPhonesGroup");
const parseCSV = require("../helperfunctions/parseCSV");
const split = require("../helperfunctions/split");
const SendingPhones = require("../models/SendingPhones");
const SMSRoute = require("../models/SMSRoute");

function ProcessGroup(groupid, io) {
  return new Promise(async (resolve, reject) => {
    try {
      let csvparsed = [];

      let group = await SendingPhoneGroup.findOne({ _id: groupid });
      console.log("recieved group", group, group.cloudinaryurl, 12);
      try {
        // csvparsed = await parseCSV(path.resolve(__dirname, "..", group.name)); // part to be edited
        // csvparsed = await parseCSV(path.resolve(__dirname, "..", group.name)); // part to be edited
        csvparsed = await parseCSV(group.cloudinaryurl, ",", {
          remote: true,
        });
      } catch (error) {
        console.log(error);
        const update = await SendingPhoneGroup.findOneAndUpdate(
          {
            _id: group._id,
          },
          {
            $set: {
              status: "error",
              errors:
                "CSV could not be parsed. please delete and try again with a proper csv file",
            },
          }
        );

        io.sockets.emit("sourceupload", update);
      }

      const headers = csvparsed[0];
      const headerindex = headers.indexOf(group.phoneHeaderName);
      if (headerindex == -1) {
        const update = await SendingPhoneGroup.findOneAndUpdate(
          {
            _id: group._id,
          },
          {
            $set: {
              status: "error",
              errors:
                "Header improperly matched.  Please  delete and try again.",
            },
          }
        );

        io.sockets.emit("sourceupload", update);

        resolve("error");
      }

      csvparsed.shift();

      csvparsed = csvparsed.map((item) => item[headerindex]);

      const initalLength = csvparsed.length;
      // console.log(csvparsed, 93);

      csvparsed = [...new Set(csvparsed)].map((item) => {
        // console.log(item, 102);

        return {
          phone: item,
          user: group.user,
          route: group.route,
          sendingphonegroup: group._id.toString(),
        };
      });

      const totalInFileDuplicates = initalLength - csvparsed.length;

      let splitdata = split(csvparsed, 10000);

      // console.log(splitdata[0], 111);
      let duplicates = 0;
      for (let i = 0; i < splitdata.length; i++) {
        try {
          const result = await SendingPhones.collection.insertMany(
            splitdata[i],
            {
              ordered: false,
            }
          );
        } catch (error) {
          console.log(error.writeErrors.length, 131);
          // if (error.writeErrors && error.writeErrors.length > 0) {
          //   error.writeErrors.forEach((e) => {
          //     if (e.code === 11000) {
          //       duplicates++;
          //     }
          //   });
          // }

          // console.log(error.writeErrors.length, "118", group.originalname);
        }
      }

      console.log(duplicates, "duplicates");

      const updatesending = await SendingPhoneGroup.findOneAndUpdate(
        {
          _id: group.id,
        },
        {
          $set: {
            status: "done",

            uploadCount: csvparsed.length,

            // globalduplicates: duplicates,
            // infileduplicates: totalInFileDuplicates,
          },
        },
        {
          new: true,
        }
      );

      io.sockets.emit("sourceupload", updatesending);

      const updateroute = await SMSRoute.findOneAndUpdate(
        {
          _id: group.route,
        },
        {
          $set: {
            numberofsources: csvparsed.length,

            // globalduplicates: duplicates,
            // infileduplicates: totalInFileDuplicates,
          },
        }
      );
      resolve(csvparsed);

      // for(let i=0; i < csvparsed.length; i++){

      // }

      // console.log(csvparsed, 56);
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = ProcessGroup;
