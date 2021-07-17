const cron = require("node-cron");
const express = require("express");
const path = require("path");
const SendingPhoneGroup = require("../models/SendingPhonesGroup");
const connectDB = require("../config/db");
const parseCSV = require("../helperfunctions/parseCSV");
const split = require("../helperfunctions/split");
const SendingPhones = require("../models/SendingPhones");

const app = express();

const dotenv = require("dotenv");
const SMSRoute = require("../models/SMSRoute");

dotenv.config();

const PORT = process.env.uploaduserphone1;
app.listen(PORT, async () => {
  await connectDB();

  let running = false;
  // Schedule tasks to be run on the server.
  cron.schedule("* * * * * *", async function () {
    if (running === true) return;
    console.log("running a task every second");
    running = true;
    const sendingphonegroupschedule = await SendingPhoneGroup.find({
      status: "scheduled",
    }).limit(10);

    const result = await Promise.allSettled(
      sendingphonegroupschedule.map((group) => ProcessGroup(group))
    );
    console.log(result, 46);
    running = false;
  });
});

function ProcessGroup(group) {
  return new Promise(async (resolve, reject) => {
    try {
      let csvparsed = [];

      try {
        csvparsed = await parseCSV(path.resolve(__dirname, "..", group.name));
      } catch (error) {
        console.log(error);
        await SendingPhoneGroup.findOneAndUpdate(
          {
            _id: group._id,
          },
          {
            $set: {
              status: "error",
              errors: "CSV could not be parsed. ",
            },
          }
        );
      }

      const headers = csvparsed[0];
      const headerindex = headers.indexOf(group.phoneHeaderName);
      if (headerindex == -1) {
        await SendingPhoneGroup.findOneAndUpdate(
          {
            _id: group._id,
          },
          {
            $set: {
              status: "error",
              errors: "Header improperly matched.  Please try again.",
            },
          }
        );
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
          sendingphonegroup: group._id,
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

      await SendingPhoneGroup.findOneAndUpdate(
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
        }
      );
      await SMSRoute.findOneAndUpdate(
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
