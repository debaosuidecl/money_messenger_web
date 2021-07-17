const cron = require("node-cron");
const express = require("express");
const fs = require("fs");
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

const PORT = process.env.deleteuserphone;
app.listen(PORT, async () => {
  await connectDB();

  let running = false;
  // Schedule tasks to be run on the server.
  cron.schedule("* * * * * *", async function () {
    if (running === true) return;
    console.log("running a task every second");
    running = true;
    const sendingphonegroupschedule = await SendingPhoneGroup.find({
      status: "deleting",
    }).limit(10);

    const result = await Promise.allSettled(
      sendingphonegroupschedule.map((group) => DeleteGroup(group))
    );
    console.log(result, 46);
    running = false;
  });
});

function DeleteGroup(group) {
  return new Promise(async (resolve, reject) => {
    try {
      const findItemsToDelete = await SendingPhones.find({
        route: group.route,
        sendingphonegroup: group._id,
      })
        .limit(10000)

        .lean();

      const itemdeletion = await SendingPhones.collection.deleteMany({
        _id: {
          $in: findItemsToDelete.map((item) => item._id),
        },
      });
      console.log(itemdeletion, 54);

      const itemsStillExist = await SendingPhones.findOne({
        route: group.route,
        sendingphonegroup: group._id,
      });

      console.log(itemsStillExist, 60);

      if (itemsStillExist) {
        await DeleteGroup(group);
        resolve("done");
      } else {
        const deletinggroup = await SendingPhoneGroup.findOneAndDelete({
          _id: group.id,
        });
        await SMSRoute.findOneAndUpdate(
          {
            _id: group.route,
          },
          {
            $set: {
              numberofsources: 0,
            },
          },
          {
            new: true,
          }
        );

        console.log(deletinggroup, "68");

        try {
          fs.unlinkSync(path.resolve(__dirname, "..", group.name));
        } catch (error) {
          console.log(error);
        }

        resolve("done");
      }
    } catch (error) {
      console.log(error);
    }
  });
}
